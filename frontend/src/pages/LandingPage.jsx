import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { sliderImages } from '../data/sliderImages';
import SocialLinks from '../components/SocialLinks';
import GoogleMap from '../components/GoogleMap';
import ImageSlider from '../components/ImageSlider';
import heroPlaceholder from '../assets/hero-placeholder.svg';
import logoImage from '../assets/logo.svg';
import './LandingPage.css';

// Datos del equipo que se muestran en la sección final del landing.
const teamMembers = [
  { name: 'Jacobo Arregoces', role: 'Desarrollador Full Stack' },
  { name: 'Andrés Urquijo', role: 'Diseño UX/UI' },
  { name: 'Tomás Cabrejo', role: 'Data & IA' },
  { name: 'Camilo Zúñiga', role: 'QA y Frontend' },
];

function LandingPage() {
  // Acciones de autenticación y estado del usuario desde el contexto global.
  const { login, register, user } = useAuth();
  // Bandera para alternar entre formulario de registro e ingreso.
  const [isRegister, setIsRegister] = useState(false);
  // Texto de error o notificación para mostrar en el formulario.
  const [message, setMessage] = useState('');
  // Hook para redirigir programáticamente a otra ruta.
  const navigate = useNavigate();

  // Estado controlado para los campos del formulario.
  const [form, setForm] = useState({
    email: '',
    password: '',
    company: '',
    businessType: '',
  });

  // Selecciona una imagen aleatoria de la lista de slides solo una vez al cargar.
  const currentSlide = useMemo(() => Math.floor(Math.random() * sliderImages.length), []);
  // Fuente actual de la imagen hero, con fallback si la imagen falla.
  const [heroSrc, setHeroSrc] = useState(sliderImages[currentSlide].src);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Si cambia la diapositiva seleccionada, actualiza la fuente de hero.
    setHeroSrc(sliderImages[currentSlide].src);
  }, [currentSlide]);

  useEffect(() => {
    // Reinicia el formulario cuando el usuario sale o no está autenticado.
    if (!user) {
      setMessage('');
      setForm({ email: '', password: '', company: '', businessType: '' });
      setIsRegister(false);
    }
  }, [user]);

  const handleChange = (event) => {
    // Actualiza el campo correspondiente según el name del input.
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const toggleMode = (mode) => {
    // Cambia el modo de formulario y limpia mensajes anteriores.
    setMessage('');
    setIsRegister(mode);
  };

  const handleImageError = () => {
    // Si la carga de la imagen falla, muestra el placeholder local.
    if (heroSrc !== heroPlaceholder) {
      setHeroSrc(heroPlaceholder);
    }
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();
    const company = form.company.trim();
    const businessType = form.businessType.trim();

    if (!isValidEmail(email)) {
      setMessage('Ingresa un correo válido.');
      return;
    }

    if (!password) {
      setMessage('Ingresa una contraseña.');
      return;
    }

    if (isRegister && (!company || !businessType)) {
      setMessage('Completa nombre de empresa y tipo de negocio.');
      return;
    }

    const payload = { email, password, company, businessType };

    if (isRegister) {
      const result = await register(payload);
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      navigate('/dashboard');
    } else {
      const result = await login(email, password);
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      navigate('/dashboard');
    }
  };

  return (
    <main className="landing-page">
      <section className="hero-section animate-fade-in">
        {/* Sección principal con título, subtítulo y botones de acceso rápido. */}
        <div className="hero-copy">
          <div className="hero-brand">
            <img src={logoImage} alt="Logo SIM Inventarios" />
            <div className="brand-text">
              <span className="brand-name">SIM Inventarios</span>
              <span className="brand-tag">Control inteligente</span>
            </div>
          </div>
          <span className="eyebrow">Sistema de Inventarios con IA</span>
          <h1>SIM - Control inteligente de tu negocio</h1>
          <p>
            Gestiona productos, inventario, carrito y pagos. Crea una experiencia accesible,
            responsive y con análisis proactivo para tu empresa.
          </p>
          <div className="hero-actions">
            <button className="btn primary" onClick={() => toggleMode(false)}>
              Ya tengo cuenta
            </button>
            <button className="btn secondary" onClick={() => toggleMode(true)}>
              Crear cuenta
            </button>
          </div>
          <div className="hero-highlights">
            <div className="highlight-card">
              <strong>+ IA</strong>
              <span>Recomendaciones intuitivas</span>
            </div>
            <div className="highlight-card">
              <strong>+ Rapidez</strong>
              <span>Interfaz limpia y moderna</span>
            </div>
            <div className="highlight-card">
              <strong>+ Seguridad</strong>
              <span>Login y registro confiables</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-image hero-card animate-pop-in">
            <img
              src={heroSrc}
              alt={sliderImages[currentSlide].title}
              onError={handleImageError}
              loading="lazy"
            />
            <div className="hero-caption">{sliderImages[currentSlide].title}</div>
          </div>
          <div className="auth-card hero-auth-card animate-pop-in">
            <div className="auth-panel-header">
              <span className="eyebrow-light">Accede rápido para comenzar</span>
              <h2>{isRegister ? 'Crea tu cuenta' : 'Bienvenido de vuelta'}</h2>
              <p className="auth-subtitle">
                {isRegister
                  ? 'Registra tu negocio y comienza a gestionar inventarios al instante.'
                  : 'Ingresa con tu correo para acceder al panel de inventarios y pagos.'}
              </p>
            </div>
            {/* Formulario de registro o login. */}
            <form onSubmit={handleSubmit} className="auth-form">
              <label>
                Email
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>
                Contraseña
                <input name="password" type="password" value={form.password} onChange={handleChange} required />
              </label>
              {isRegister && (
                <>
                  <label>
                    Empresa
                    <input name="company" type="text" value={form.company} onChange={handleChange} required />
                  </label>
                  <label>
                    Tipo de negocio
                    <select name="businessType" value={form.businessType} onChange={handleChange} required>
                      <option value="">Selecciona una opción</option>
                      <option value="Retail">Retail / Tienda</option>
                      <option value="Restaurante">Restaurante / Café</option>
                      <option value="Farmacia">Farmacia</option>
                      <option value="Electrónica">Electrónica</option>
                      <option value="Ropa">Ropa y accesorios</option>
                      <option value="Alimentos">Alimentos y bebidas</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </label>
                </>
              )}
              <button type="submit" className="btn primary full-width">
                {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>
            </form>
            <div className="auth-switch">
              <span>{isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}</span>
              <button className="link-button" type="button" onClick={() => toggleMode(!isRegister)}>
                {isRegister ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </div>
            {message && <p className="form-message">{message}</p>}
          </div>
        </div>
      </section>

      <section className="slider-section animate-fade-in-delay">
        <div className="section-head">
          <h2>Recorrido rápido</h2>
          <p>Explora las pantallas principales del sistema y descubre cómo funciona el control de inventarios.</p>
        </div>
        <ImageSlider />
      </section>

      <section className="team-section animate-fade-in-delay">
        <div className="section-head">
          <h2>Equipo del proyecto</h2>
          <p>Conoce a las personas que crearon esta solución de inventarios con IA.</p>
        </div>
        <div className="team-grid">
          {teamMembers.map((member) => (
            <article key={member.name} className="team-card">
              <div className="team-avatar">{member.name.split(' ').map((word) => word[0]).join('')}</div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </article>
          ))}
        </div>
      </section>


      <section className="info-section animate-fade-in">
        <div className="info-grid">
          <article className="info-card">
            <h3>🎯 Misión</h3>
            <p>
              Entregar una plataforma intuitiva para que pequeñas y medianas empresas administren sus productos,
              mantengan el stock actualizado y tomen decisiones acertadas con ayuda de la inteligencia artificial.
            </p>
          </article>
          <article className="info-card accent">
            <h3>🌟 Visión</h3>
            <p>
              Ser un sistema de inventario educativo y funcional que permita a los negocios crecer con análisis real,
              accesibilidad y una experiencia moderna.
            </p>
          </article>
          <article className="info-card">
            <h3>📌 Objetivos</h3>
            <ul>
              <li>Inventario con CRUD completo.</li>
              <li>Carrito y pago simulado.</li>
              <li>Experiencia responsive y accesible.</li>
              <li>Formulario PQR y contactos sociales.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="footer-section animate-fade-in-delay">
        <SocialLinks />
        <GoogleMap />
      </section>
    </main>
  );
}

export default LandingPage;
