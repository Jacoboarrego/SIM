import { api } from './api';

/**
 * Llama al endpoint seguro del backend que a su vez consulta DeepSeek.
 * @param {object} payload - objeto con la consulta, por ejemplo { prompt: '...' }
 */
export function callAi(payload) {
  return api.post('/deepseek', payload).then((res) => res.data);
}

export default { callAi };
