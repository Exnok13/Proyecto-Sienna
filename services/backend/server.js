const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos PostgreSQL con Failover parametrizado
const poolPrimary = new Pool({
  host: process.env.DB_HOST || '10.0.2.3',
  user: process.env.DB_USER || 'sienna_user',
  password: process.env.DB_PASSWORD || 'dbAdmin123',
  database: process.env.DB_NAME || 'pedro_sienna_db',
  port: parseInt(process.env.DB_PORT || '5432'),
  connectionTimeoutMillis: 2000,
});

const poolSecondary = new Pool({
  host: process.env.DB_SECONDARY_HOST || '10.0.2.4',
  user: process.env.DB_USER || 'sienna_user',
  password: process.env.DB_PASSWORD || 'dbAdmin123',
  database: process.env.DB_NAME || 'pedro_sienna_db',
  port: parseInt(process.env.DB_PORT || '5432'),
  connectionTimeoutMillis: 2000,
});

let activePool = poolPrimary;

const pool = {
  async query(text, params) {
    try {
      return await activePool.query(text, params);
    } catch (err) {
      console.warn(`[HA-Failover] Fallo en ${activePool.options.host}, cambiando nodo... Error:`, err.message);
      activePool = (activePool === poolPrimary) ? poolSecondary : poolPrimary;
      console.warn(`[HA-Failover] Reintentando en: ${activePool.options.host}`);
      return await activePool.query(text, params);
    }
  }
};

// Listar las películas
app.get('/api/peliculas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM peliculas');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener películas' });
  }
});

// Registrar un voto (con validación de voto único)
app.post(['/api/votos', '/api/votes'], async (req, res) => {
  const { user_id, movie_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO votos (user_id, movie_id) VALUES ($1, $2) RETURNING *',
      [user_id, movie_id]
    );
    res.json({ message: 'Voto registrado con éxito', vote: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'El usuario ya votó por esta película' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

// Resultados de las votaciones en vivo
app.get('/api/resultados', async (req, res) => {
  try {
    const query = `
      SELECT p.title AS titulo, COUNT(v.id) AS votos
      FROM peliculas p
      LEFT JOIN votos v ON p.id = v.movie_id
      GROUP BY p.id
      ORDER BY votos DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener resultados' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = 'SELECT * FROM usuario WHERE email = $1 AND password_hash = $2';
    const result = await pool.query(query, [email, password]);
    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Login correcto', user_id: result.rows[0].id });
    } else {
      res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});
// Registrar nuevos usuarios
app.post('/api/registro', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const query = "INSERT INTO usuario (name, email, password_hash, role) VALUES ($1, $2, $3, 'espectador')";
    await pool.query(query, [name, email, password]);
    res.json({ success: true, message: 'Registro exitoso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'El correo ya está registrado o hubo un error' });
  }
});

// QUITAR el voto
app.delete('/api/votes', async (req, res) => {
  const { user_id, movie_id } = req.body;
  try {
    await pool.query('DELETE FROM votos WHERE user_id = $1 AND movie_id = $2', [user_id, movie_id]);
    res.status(200).json({ message: 'Voto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el voto' });
  }
});
// Ruta para OBTENER el historial de votos de un usuario
app.get('/api/votes/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT movie_id FROM votos WHERE user_id = $1', [user_id]);
    const movieIds = result.rows.map(row => row.movie_id);
    res.status(200).json(movieIds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los votos previos' });
  }
});

// ENDPOINTS MICROSERVICIO IA Y RESEÑAS
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://ai_service:8000';

// Asegurar tabla de reseñas
pool.query(`
  CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).catch(err => console.error('[DB] Error tabla reviews:', err.message));

// Healthcheck
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Obtener listado de reseñas de una película
app.get('/api/movies/:id/reviews', async (req, res) => {
  const movieId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM reviews WHERE movie_id = $1 ORDER BY id DESC', [movieId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Guardar nueva reseña
app.post('/api/movies/:id/reviews', async (req, res) => {
  const movieId = req.params.id;
  const { user_name, comment } = req.body;
  if (!comment || comment.trim() === '') {
    return res.status(400).json({ error: 'Comentario vacío.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO reviews (movie_id, user_name, comment) VALUES ($1, $2, $3) RETURNING *',
      [movieId, user_name || 'Anónimo', comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resumen y análisis con microservicio de IA
app.get('/api/movies/:id/ai-summary', async (req, res) => {
  const movieId = req.params.id;
  try {
    const reviewsRes = await pool.query('SELECT comment FROM reviews WHERE movie_id = $1', [movieId]);
    if (reviewsRes.rows.length === 0) {
      return res.json({
        movie_title: `Película #${movieId}`,
        summary: 'Aún no hay reseñas registradas para generar un consenso.',
        sentiment: 'Neutro',
        total_reviews_analyzed: 0
      });
    }
    const reviews = reviewsRes.rows.map(r => r.comment);
    const response = await fetch(`${AI_SERVICE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movie_title: `Película #${movieId}`, reviews })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar ai-service', details: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API de Premios Pedro Sienna corriendo en el puerto ${PORT}`);
});
