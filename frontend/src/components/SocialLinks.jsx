// Bloque de enlaces sociales usados en la landing y dashboard.
// Mantener `rel="noreferrer"` y `target="_blank"` para seguridad.
function SocialLinks() {
  return (
    <div className="social-links">
      <h3>Conéctate con nosotros</h3>
      <div className="social-grid">
        <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="social-card">
          <span>📸 Instagram</span>
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="social-card">
          <span>📘 Facebook</span>
        </a>
        <a href="https://wa.me/573001234567" target="_blank" rel="noreferrer" className="social-card">
          <span>💬 WhatsApp</span>
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="social-card">
          <span>🔗 LinkedIn</span>
        </a>
      </div>
    </div>
  );
}

export default SocialLinks;
