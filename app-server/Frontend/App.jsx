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

// Vista de Detalle
const Detalle = () => {
  const location = useLocation();
  const peli = location.state?.pelicula; 

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', fontSize: '2rem', fontWeight: 'normal' }}>
        {peli ? peli.title : 'Título de la película'}
      </h1>

      {/* Reproductor de video de YouTube dinámico */}
      <div style={{ marginBottom: '30px' }}>
        <iframe 
          width="100%" 
          height="450px" 
          src={peli?.video_url || "https://www.youtube.com/embed/sqzqyiL8CbA"} 
          title="Reproductor de Película" 
          style={{ border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>      
      
      {/* Cuadro de texto con la sinopsis */}
      <div style={{ border: '1px solid black', padding: '20px', textAlign: 'justify', lineHeight: '1.5', fontSize: '15px' }}>
        {peli?.synopsis || 'Sinopsis no disponible para esta película.'}
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
