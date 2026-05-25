// Barra de accesibilidad que permite alternar tema y ajustar escala de texto.
// Props:
// - darkMode: boolean que indica si está activo el modo oscuro.
// - onToggleDark(): callback para alternar modo oscuro.
// - textScale: valor numérico usado para mostrar el % actual.
// - onIncreaseText(), onDecreaseText(): callbacks para ajustar escala.
function AccessibilityBar({ darkMode, highContrast, onToggleDark, onToggleContrast, textScale, onIncreaseText, onDecreaseText }) {
  return (
    <div className="accessibility-bar">
      <div>
        <button className="btn tiny" onClick={onToggleDark}>
          {darkMode ? 'Modo claro' : 'Modo oscuro'}
        </button>
      </div>
      <div>
        <button className="btn tiny" onClick={onToggleContrast}>
          {highContrast ? 'Contraste normal' : 'Alto contraste'}
        </button>
      </div>
      <div>
        <span>Tamaño texto:</span>
        <button className="btn tiny" onClick={onDecreaseText}>
          -
        </button>
        <button className="btn tiny" onClick={onIncreaseText}>
          +
        </button>
        <span>{Math.round(textScale * 100)}%</span>
      </div>
    </div>
  );
}

export default AccessibilityBar;
