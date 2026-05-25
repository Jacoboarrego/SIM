import { useMemo, useState } from 'react';
import { callAi } from '../services/aiService';

// Componente de Asistente IA que muestra métricas y permite consultar la IA remota.
function AiAssistant({ products }) {
  const [prompt, setPrompt] = useState('Dame recomendaciones de inventario.');
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const summary = useMemo(() => {
    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = products.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const lowStock = products.filter((item) => item.quantity <= 5);

    return {
      totalProducts,
      totalQuantity,
      totalValue,
      lowStock,
    };
  }, [products]);

  const recommendation = useMemo(() => {
    if (summary.totalProducts === 0) {
      return 'Agrega productos para que el asistente te provea recomendaciones.';
    }
    if (summary.lowStock.length > 0) {
      return `Revisa el stock de ${summary.lowStock.length} producto(s) que tienen menos de 5 unidades.`;
    }
    if (summary.totalValue < 200) {
      return 'Considera aumentar el inventario si el volumen actual es bajo para tu negocio.';
    }
    return 'Tu inventario se ve estable. Continúa revisando niveles y rotación de los productos.';
  }, [summary]);

  const handleQuery = async () => {
    setLoading(true);
    setError('');
    setAiResponse(null);
    try {
      const res = await callAi({ prompt, inventorySummary: summary });
      setAiResponse(res);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Error al consultar la IA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="card ai-card">
      <h3>Asistente IA</h3>
      <div className="ai-grid">
        <div className="ai-block">
          <strong>{summary.totalProducts}</strong>
          <span>Productos</span>
        </div>
        <div className="ai-block">
          <strong>{summary.totalQuantity}</strong>
          <span>Unidades totales</span>
        </div>
        <div className="ai-block">
          <strong>${summary.totalValue.toFixed(2)}</strong>
          <span>Valor total</span>
        </div>
      </div>

      <p>{recommendation}</p>

      <div className="ai-query">
        <textarea
          aria-label="Prompt para IA"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="ai-actions">
          <button className="btn small" onClick={handleQuery} disabled={loading}>
            {loading ? 'Consultando...' : 'Consultar IA'}
          </button>
        </div>
        {error && <div className="error-text">{error}</div>}
        {aiResponse && (
          <div className="ai-response">
            <h4>Respuesta IA</h4>
            <pre>{typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse, null, 2)}</pre>
          </div>
        )}
      </div>
    </article>
  );
}

export default AiAssistant;
