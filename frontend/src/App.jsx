// Componente principal de la aplicación React.
// Controla la navegación, el modo oscuro, la escala de texto y el logout.
import { useMemo, useState } from 'react';
import { Navigate, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import InventoryDashboard from './pages/InventoryDashboard';
import AccessibilityBar from './components/AccessibilityBar';
import './App.css';

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textScale, setTextScale] = useState(1);

  const appClass = useMemo(() => {
    return `app-shell ${darkMode ? 'dark-mode' : ''} ${highContrast ? 'high-contrast' : ''} text-scale-${textScale}`;
  }, [darkMode, highContrast, textScale]);

  // Cierra la sesión del usuario y regresa a la página de inicio.
  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className={appClass}>
      <AccessibilityBar
        darkMode={darkMode}
        highContrast={highContrast}
        onToggleDark={() => setDarkMode((prev) => !prev)}
        onToggleContrast={() => setHighContrast((prev) => !prev)}
        textScale={textScale}
        onIncreaseText={() => setTextScale((prev) => Math.min(prev + 0.1, 1.4))}
        onDecreaseText={() => setTextScale((prev) => Math.max(prev - 0.1, 0.9))}
      />

      {user && (
        <header className="app-header">
          <div className="brand-block">
            <Link to="/dashboard" className="brand-title">
              SIM Inventarios
            </Link>
            <span className="brand-subtitle">Bienvenido, {user.email}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </header>
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={user ? <InventoryDashboard /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
