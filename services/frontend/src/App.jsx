import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
const Navbar = () => {
  const location = useLocation();
  const esInicio = location.pathname === '/';
  const esLogin = location.pathname === '/login';
  const esRegistro = location.pathname === '/registro';

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogueadoId'); // Borra el ID de tu sesión
    window.location.href = '/login';
  };
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '2px solid #eee' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/logo-chilecultura.png" alt="ChileCultura" style={{ height: '40px' }} />
      </div>
      <div style={{ display: 'flex', gap: '30px', fontWeight: 'bold' }}>
        {esInicio && (
          <Link to="/login" style={{ textDecoration: 'none', color: '#00aae4' }}>Iniciar Sesión</Link>
        )}
        {esLogin && (
          <Link to="/" style={{ textDecoration: 'none', color: '#00aae4' }}>Inicio</Link>
        )}
        {(!esInicio && !esLogin && !esRegistro) && (
          <>
            <Link to="/catalogo" style={{ textDecoration: 'none', color: location.pathname === '/catalogo' ? '#00aae4' : '#333', borderBottom: location.pathname === '/catalogo' ? '3px solid #00aae4' : 'none' }}>Catálogo</Link>
            <Link to="/revision" style={{ textDecoration: 'none', color: location.pathname === '/revision' ? '#00aae4' : '#333', borderBottom: location.pathname === '/revision' ? '3px solid #00aae4' : 'none' }}>Revisión</Link>
            <button 
              onClick={handleLogout}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: '#00aae4', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
const Footer = () => (
  <footer style={{ backgroundColor: '#002b5c', color: 'white', padding: '40px', display: 'flex', justifyContent: 'space-around', fontSize: '12px' }}>
    <div>
      <strong>ACERCA DE</strong><br/>
      Nosotros<br/>Términos de uso<br/>Contacto
    </div>
    <div>
      <strong>SITIOS DE INTERÉS</strong><br/>
      Ministerio de las Culturas<br/>Patrimonio<br/>Fondos Cultura
    </div>
  </footer>
);

// ---Paginas ---

// Vista de Login
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor ingresa correo y contraseña');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        localStorage.setItem('usuarioLogueadoId', data.user_id);
        navigate('/catalogo');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };
  return (
    <div style={{ backgroundColor: '#29b6f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
      
      {/* Logo y título de ChileCultura */}
      <div style={{ textAlign: 'center', marginBottom: '30px', color: 'white' }}>
        <h1 style={{ fontSize: '3rem', margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          Chile<span style={{ fontWeight: 'normal', color: 'white' }}>Cultura</span>
        </h1>
        <p style={{ margin: '5px 0 0 0', fontSize: '1.2rem', color: 'white' }}>La cartelera cultural de Chile</p>
      </div>      

      {/* Recuadro blanco del formulario */}
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#333', marginBottom: '25px', fontWeight: 'normal', fontSize: '1.3rem' }}>Inicia sesión para comenzar:</h3>
        
        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Correo electrónico</label>
          <input 
            type="email" 
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '1px solid #777', outline: 'none', fontSize: '1rem' }} 
          />
        </div>
        
        <div style={{ marginBottom: '30px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Contraseña</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '1px solid #777', outline: 'none', fontSize: '1rem' }} 
          />
        </div>

        {error && <p style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>{error}</p>}

        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={handleLogin} 
            style={{ backgroundColor: '#29b6f6', color: 'white', padding: '10px 40px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginBottom: '20px' }}
          >
            Ingresar
          </button>
        </div>

        <div style={{ fontSize: '14px', textAlign: 'center' }}>
          <p style={{ margin: '5px 0' }}><a href="#" style={{ color: '#29b6f6', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a></p>
          <p style={{ margin: '5px 0' }}><span style={{ cursor: 'pointer', color: '#29b6f6', textDecoration: 'underline' }} onClick={() => navigate('/registro')}>¿Aún no tienes cuenta? Regístrate.</span></p> 
        </div>
      </div>
    </div>
  );
};

// Vista de Inicio
const Inicio = () => {
  const imagenesCarrusel = [
    '/foto1.jpg',
    '/foto2.jpg',
    '/foto3.jpg'
  ];
  const [indice, setIndice] = useState(0);

  const fotoAnterior = () => {
    setIndice((prev) => (prev === 0 ? imagenesCarrusel.length - 1 : prev - 1));
  };

  const fotoSiguiente = () => {
    setIndice((prev) => (prev + 1) % imagenesCarrusel.length);
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc', padding: '20px 0', marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
            <img src="/Inicio1.jpg" alt="Banner Premios Pedro Sienna" style={{ width: '100%', maxWidth: '1000px', borderRadius: '15px', objectFit: 'contain' }} />
      </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        <button onClick={fotoAnterior} style={{ border: 'none', background: 'none', fontSize: '2rem', cursor: 'pointer' }}>◀</button>
        <img 
          src={imagenesCarrusel[indice]} 
          alt="Carrusel" 
          style={{ width: '600px', height: '300px', objectFit: 'cover', borderRadius: '8px', transition: '0.3s ease' }} 
        />
        <button onClick={fotoSiguiente} style={{ border: 'none', background: 'none', fontSize: '2rem', cursor: 'pointer' }}>▶</button>
      </div>
    </div>
  );
};
// Vista de Catálogo y votacion
const Votacion = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const [votos, setVotos] = useState([]);
  useEffect(() => {
  fetch('/api/peliculas')
    .then(res => res.json())
    .then(data => setPeliculas(data))
    .catch(() => setMensaje('Error de conexión'));

  const userIdActual = localStorage.getItem('usuarioLogueadoId');
  if (userIdActual) {
    fetch(`/api/votes/${userIdActual}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVotos(data);
        }
      })
      .catch(err => console.error('Error al cargar votos previos', err));
  }
}, []);

  const handleVote = async (movieId) => {
    const userIdActual = localStorage.getItem('usuarioLogueadoId');

    if (!userIdActual) {
      setMensaje('Aviso: Debes iniciar sesión para votar');
      return;
    }
    try {
    const isVotada = votos.includes(movieId);

    if (isVotada) {
      const res = await fetch('/api/votes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userIdActual, movie_id: movieId })
      });
      
      if (res.ok) {
        setVotos(votos.filter(votoId => votoId !== movieId));
        setMensaje('Voto eliminado');
      }
    } else {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userIdActual, movie_id: movieId })
      });
      
      if (res.ok) {
        setVotos([...votos, movieId]);
        const data = await res.json();
        setMensaje(res.ok ? `Éxito: ${data.message}` : `Aviso: ${data.error}`);
      }
    }
  } catch (error) {
    setMensaje('Error de conexión al procesar el voto');
  }
  };

  return (
    <div style={{ padding: '40px' }}>
      {mensaje && <div style={{ padding: '15px', backgroundColor: '#e6f7ff', border: '1px solid #91d5ff', marginBottom: '20px', textAlign: 'center' }}>{mensaje}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' }}>
        {peliculas.map(peli => (
            <div key={peli.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '300px', backgroundColor: '#eee', backgroundImage: `url(/posters/${peli.poster_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                {!peli.poster_url && <p style={{textAlign: 'center', paddingTop: '130px'}}>{peli.title}</p>}
             </div>
    
             {/**/}
             <button 
                onClick={() => handleVote(peli.id)} 
                style={{ 
                  backgroundColor: votos.includes(peli.id) ? '#ff4d4d' : '#33b5e5', // Rojo si está votada, celeste si no
                  color: 'white', 
                  padding: '10px', 
                  border: 'none', 
                  borderRadius: '20px', 
                  cursor: 'pointer'
                }}
              >
                {votos.includes(peli.id) ? 'Quitar voto' : 'Votar'}
              </button>
             {/**/}
             <button 
            onClick={() => navigate('/detalle', { state: { pelicula: peli } })} 
            style={{ backgroundColor: '#002b5c', color: 'white', padding: '10px', border: 'none', borderRadius: '20px', cursor: 'pointer', marginTop: '10px' }} >
            Ver
          </button>
         </div>
        ))}
      </div>
    </div>
  );
};

// Vista de Detalle con Sinopsis y Reseñas/IA lado a lado
const Detalle = () => {
  const location = useLocation();
  const peli = location.state?.pelicula;

  const [comentario, setComentario] = useState('');
  const [resenas, setResenas] = useState([]);
  const [analisisIa, setAnalisisIa] = useState(null);
  const [cargandoIa, setCargandoIa] = useState(false);
  const [mensajeEnvio, setMensajeEnvio] = useState('');

  // Cargar reseñas registradas y análisis IA
  const cargarResenasYAnalisis = async (movieId) => {
    try {
      const resReviews = await fetch(`/api/movies/${movieId}/reviews`);
      if (resReviews.ok) {
        const dataReviews = await resReviews.json();
        setResenas(dataReviews);
      }
    } catch (err) {
      console.error('Error al cargar reseñas:', err);
    }

    setCargandoIa(true);
    try {
      const resIa = await fetch(`/api/movies/${movieId}/ai-summary`);
      if (resIa.ok) {
        const dataIa = await resIa.json();
        setAnalisisIa(dataIa);
      }
    } catch (err) {
      console.error('Error al consultar IA:', err);
    } finally {
      setCargandoIa(false);
    }
  };

  useEffect(() => {
    if (peli?.id) {
      cargarResenasYAnalisis(peli.id);
    }
  }, [peli]);

  // Enviar reseña
  const handleEnviarResena = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    const userId = localStorage.getItem('usuarioLogueadoId');
    const autor = userId ? `Usuario #${userId}` : 'Espectador Pedro Sienna';

    try {
      const res = await fetch(`/api/movies/${peli.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: autor, comment: comentario })
      });

      if (res.ok) {
        setComentario('');
        setMensajeEnvio('¡Reseña agregada con éxito!');
        setTimeout(() => setMensajeEnvio(''), 3000);
        await cargarResenasYAnalisis(peli.id);
      } else {
        setMensajeEnvio('Error al guardar la reseña.');
      }
    } catch (error) {
      setMensajeEnvio('Error de conexión al enviar el comentario.');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '25px', fontSize: '2.2rem', fontWeight: 'bold', color: '#002b5c' }}>
        {peli ? peli.title : 'Título de la película'}
      </h1>

      {/* Reproductor de video de YouTube */}
      <div style={{ marginBottom: '35px' }}>
        <iframe
          width="100%"
          height="480px"
          src={peli?.video_url || "https://www.youtube.com/embed/sqzqyiL8CbA"}
          title="Reproductor de Película"
          style={{ border: 'none', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Contenedor en dos columnas: Sinopsis a la izquierda | Reseñas e IA a la derecha */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Columna Izquierda: Descripción / Sinopsis */}
        <div style={{ border: '1px solid #e0e0e0', padding: '25px', borderRadius: '8px', backgroundColor: '#fafafa', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#002b5c', borderBottom: '2px solid #00aae4', paddingBottom: '8px' }}>
            Sinopsis
          </h3>
          <p style={{ lineHeight: '1.6', fontSize: '15px', color: '#333', textAlign: 'justify', margin: 0 }}>
            {peli?.synopsis || 'Sinopsis no disponible para esta película.'}
          </p>
        </div>

        {/* Columna Derecha: Panel de IA y Sección de Reseñas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tarjeta de Resumen con IA */}
          <div style={{ backgroundColor: '#f0f7ff', border: '1px solid #b8daff', borderRadius: '8px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ color: '#004085', fontSize: '14px' }}>🤖 Consenso Crítico (IA)</strong>
              {analisisIa?.sentiment && (
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: analisisIa.sentiment === 'Positivo' ? '#28a745' : analisisIa.sentiment === 'Negativo' ? '#dc3545' : '#ffc107'
                }}>
                  {analisisIa.sentiment}
                </span>
              )}
            </div>

            {cargandoIa ? (
              <p style={{ margin: 0, fontSize: '13px', color: '#004085', fontStyle: 'italic' }}>Analizando opiniones con el modelo...</p>
            ) : (
              <div>
                <p style={{ margin: '6px 0', fontSize: '14px', lineHeight: '1.4', color: '#333' }}>
                  {analisisIa?.summary || 'Aún no hay reseñas registradas para generar un consenso.'}
                </p>
                <small style={{ color: '#666', fontSize: '12px' }}>
                  Total analizadas: {analisisIa?.total_reviews_analyzed || 0}
                </small>
              </div>
            )}
          </div>

          {/* Formulario para agregar comentario */}
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '18px', backgroundColor: '#fff' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Escribe tu reseña</h4>
            <form onSubmit={handleEnviarResena}>
              <textarea
                rows="3"
                placeholder="¿Qué te pareció la dirección, actuaciones o guion?..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                {mensajeEnvio && <span style={{ fontSize: '13px', color: mensajeEnvio.includes('éxito') ? 'green' : 'red', fontWeight: 'bold' }}>{mensajeEnvio}</span>}
                <button
                  type="submit"
                  style={{ marginLeft: 'auto', backgroundColor: '#00aae4', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>

          {/* Lista de comentarios */}
          <div style={{ maxHeight: '220px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px', padding: '15px', backgroundColor: '#fafafa' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px' }}>Comentarios de la comunidad</h4>
            {resenas.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', margin: 0 }}>Sé el primero en dejar un comentario.</p>
            ) : (
              resenas.map((r, idx) => (
                <div key={idx} style={{ padding: '8px 0', borderBottom: idx !== resenas.length - 1 ? '1px solid #eee' : 'none' }}>
                  <strong style={{ fontSize: '13px', color: '#002b5c' }}>{r.user_name || 'Espectador'}:</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#444' }}>{r.comment}</p>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

// Vista de Resultados
const Revision = () => {
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/resultados')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setResultados(data);
        } else {
          setError('Error: Los datos no tienen el formato correcto.');
        }
        setCargando(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error de conexión con la base de datos.');
        setCargando(false);
      });
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#0033cc' }}>Resultados en Vivo</h2>
      {cargando ? (
        <p style={{ textAlign: 'center' }}>Calculando votos...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red', fontWeight: 'bold' }}>{error}</p>
      ) : (
        resultados.map((item, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', border: '1px solid #ccc', marginBottom: '10px', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
            <span style={{ fontSize: '18px' }}>{item.titulo}</span>
            <strong style={{ borderLeft: '1px solid #ccc', paddingLeft: '15px', minWidth: '50px', textAlign: 'center' }}>
              {item.votos}
            </strong>
          </div>
        ))
      )}
    </div>
  );
};

// Registro

const Registro = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleRegistro = async () => {
    if (!name || !email || !password) {
      setMensaje('Por favor completa todos los campos');
      return;
    }

    try {
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setMensaje('¡Registro exitoso! Redirigiendo...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMensaje(data.message);
      }
    } catch (err) {
      setMensaje('Error al conectar con el servidor');
    }
  };

  return (
    <div style={{ backgroundColor: '#29b6f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px', color: 'white' }}>
        <h1 style={{ fontSize: '3rem', margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          Chile<span style={{ fontWeight: 'normal', color: 'white' }}>Cultura</span>
        </h1>
      </div>

      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#333', marginBottom: '25px', fontWeight: 'normal', fontSize: '1.3rem' }}>Crea tu cuenta nueva:</h3>
        
        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Nombre completo</label>
          <input type="text" placeholder="Ej. Juan Pérez" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '1px solid #777', outline: 'none', fontSize: '1rem' }} />
        </div>

        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Correo electrónico</label>
          <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '1px solid #777', outline: 'none', fontSize: '1rem' }} />
        </div>
        
        <div style={{ marginBottom: '30px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '1px solid #777', outline: 'none', fontSize: '1rem' }} />
        </div>

        {mensaje && <p style={{ color: mensaje.includes('exitoso') ? 'green' : 'red', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>{mensaje}</p>}

        <div style={{ textAlign: 'center' }}>
          <button onClick={handleRegistro} style={{ backgroundColor: '#29b6f6', color: 'white', padding: '10px 40px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginBottom: '20px' }}>
            Registrarse
          </button>
        </div>

        <div style={{ fontSize: '14px', textAlign: 'center' }}>
          <p style={{ margin: '5px 0' }}><span style={{ cursor: 'pointer', color: '#29b6f6', textDecoration: 'underline' }} onClick={() => navigate('/login')}>¿Ya tienes cuenta? Inicia sesión.</span></p>
        </div>
      </div>
    </div>
  );
};

// --- ENRUTADOR PRINCIPAL ---
function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/catalogo" element={<Votacion />} />
            <Route path="/votacion" element={<Votacion />} />
            <Route path="/detalle" element={<Detalle />} />
            <Route path="/revision" element={<Revision />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
