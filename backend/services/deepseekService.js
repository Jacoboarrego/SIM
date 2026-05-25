const axios = require('axios');

const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

/**
 * Construye el payload para DeepSeek a partir de { prompt, inventorySummary, model }
 * - Si `payload.messages` viene completo, lo reenvía tal cual.
 * - Si `payload.prompt` existe, crea un arreglo `messages` con contexto y prompt.
 */
async function queryDeepSeek(payload = {}) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK API not configured');
  }

  let body = {};

  if (payload.messages && Array.isArray(payload.messages)) {
    body = { model: payload.model || 'deepseek-v4-flash', messages: payload.messages };
  } else if (payload.prompt) {
    const messages = [];
    // Contexto base — puedes personalizar esto según necesites
    messages.push({ role: 'system', content: payload.system || 'Eres un asistente útil y conciso.' });

    if (payload.inventorySummary) {
      // Añadimos el resumen del inventario como contexto adicional para la IA
      messages.push({
        role: 'system',
        content: `Inventory summary:\n${JSON.stringify(payload.inventorySummary)}`,
      });
    }

    messages.push({ role: 'user', content: payload.prompt });
    body = { model: payload.model || 'deepseek-v4-flash', messages };
  } else {
    // Reenvío por defecto (por si llaman con otro formato)
    body = payload;
  }

  const response = await axios.post(DEEPSEEK_API_URL, body, {
    headers: {
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });

  return response.data;
}

module.exports = { queryDeepSeek };
