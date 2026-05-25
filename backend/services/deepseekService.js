const axios = require('axios');

const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

function summarizeInventory(inventorySummary = {}) {
  if (!inventorySummary || Object.keys(inventorySummary).length === 0) {
    return 'No inventory data provided.';
  }

  const lines = [
    `Total products: ${inventorySummary.totalProducts}`,
    `Total quantity: ${inventorySummary.totalQuantity}`,
    `Total value: $${Number(inventorySummary.totalValue || 0).toFixed(2)}`,
  ];

  if (Array.isArray(inventorySummary.lowStock) && inventorySummary.lowStock.length > 0) {
    lines.push(`Low stock items (${inventorySummary.lowStock.length}): ${inventorySummary.lowStock
      .map((item) => item.name || item.product || item.id)
      .join(', ')}`);
  }

  return lines.join('\n');
}

function formatDeepSeekResponse(responseData) {
  if (!responseData) return null;

  if (responseData.choices && Array.isArray(responseData.choices) && responseData.choices.length > 0) {
    const choice = responseData.choices[0];
    if (choice.message && choice.message.content) {
      return choice.message.content;
    }
    if (choice.text) {
      return choice.text;
    }
  }

  if (typeof responseData === 'string') {
    return responseData;
  }

  return JSON.stringify(responseData, null, 2);
}

function generateFallbackResponse(payload = {}) {
  const inventorySummaryText = summarizeInventory(payload.inventorySummary);
  const promptText = payload.prompt || 'Dame recomendaciones de inventario.';

  return `No se pudo conectar con el servicio de IA externo. Aquí tienes recomendaciones básicas basadas en tu inventario:\n\nPromp ingresado: ${promptText}\n\nResumen del inventario:\n${inventorySummaryText}\n\nRecomendaciones:\n- Revisa los niveles de stock más bajos y repón antes de que falten productos.\n- Observa productos con menos de 5 unidades y prioriza compras para ellos.\n- Si el valor total es bajo, considera ampliar el inventario con artículos de alta rotación.\n- Mantén un balance entre productos con alta demanda y stock disponible.`;
}

/**
 * Construye el payload para DeepSeek a partir de { prompt, inventorySummary, model }
 * - Si `payload.messages` viene completo, lo reenvía tal cual.
 * - Si `payload.prompt` existe, crea un arreglo `messages` con contexto y prompt.
 */
async function queryDeepSeek(payload = {}) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API not configured');
  }

  let body = {};

  if (payload.messages && Array.isArray(payload.messages)) {
    body = { model: payload.model || 'deepseek-v4-flash', messages: payload.messages };
  } else if (payload.prompt) {
    const messages = [];
    messages.push({ role: 'system', content: payload.system || 'Eres un asistente útil y conciso.' });

    if (payload.inventorySummary) {
      messages.push({
        role: 'system',
        content: `Inventory summary:\n${JSON.stringify(payload.inventorySummary)}`,
      });
    }

    messages.push({ role: 'user', content: payload.prompt });
    body = { model: payload.model || 'deepseek-v4-flash', messages };
  } else {
    body = payload;
  }

  try {
    const response = await axios.post(DEEPSEEK_API_URL, body, {
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    return formatDeepSeekResponse(response.data);
  } catch (err) {
    console.error('DeepSeek request failed', err.response?.status, err.response?.data || err.message);

    if (err.response && [401, 402, 403, 404, 429, 500].includes(err.response.status)) {
      return generateFallbackResponse(payload);
    }

    throw new Error(err.response?.data?.message || err.message || 'DeepSeek request failed');
  }
}

module.exports = { queryDeepSeek };
