// Cliente Axios configurado para llamadas al backend.
// - Lee `VITE_API_URL` de las variables de entorno de Vite si está disponible.
// - Establece `Content-Type: application/json` por defecto para peticiones JSON.
// Uso:
//   import { api, authHeader } from './api';
//   api.get('/products', { headers: authHeader(token) });
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Devuelve un objeto headers con Authorization cuando existe token.
 * @param {string} token - JWT del usuario
 * @returns {object} headers a pasar a Axios
 */
export function authHeader(token) {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
