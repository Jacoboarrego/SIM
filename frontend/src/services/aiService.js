import { api } from './api';

/**
 * Llama al endpoint seguro del backend para consultar la IA de OpenRouter.
 * @param {object} payload - objeto con la consulta, por ejemplo { prompt: '...' }
 */
export async function askAI(payload) {
  const res = await api.post('/deepseek/chat', payload);
  const data = res.data;

  if (data?.success) {
    return {
      text: data.response,
      fallback: false,
      usage: data.usage,
    };
  }

  return {
    text: data?.fallback?.text || data?.error || 'Lo siento, hubo un error con la IA.',
    fallback: !!data?.fallback,
    details: data?.details,
  };
}

export default { askAI };
