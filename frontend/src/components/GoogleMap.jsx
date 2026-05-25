// Componente que incrusta un mapa de Google con la ubicación de la empresa.
// Usa un iframe embebido; cambiar `src` si se requiere otra ubicación o parámetros.
function GoogleMap() {
  return (
    <div className="google-map-card">
      <iframe
        title="Ubicación de la empresa"
        width="100%"
        height="280"
        loading="lazy"
        allowFullScreen
        src="https://www.google.com/maps?q=Bogota,Colombia&output=embed"
      ></iframe>
    </div>
  );
}

export default GoogleMap;
