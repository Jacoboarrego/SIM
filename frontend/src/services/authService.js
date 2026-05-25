// Wrapper de llamadas al API de autenticación.
// Cada función retorna la `response.data` del backend para simplificar el consumo.
import { api } from './api';

/**
 * Inicia sesión y devuelve `{ token, user }` en caso de éxito.
 * @param {{email: string, password: string}} credentials
 */
export function loginUser(credentials) {
  return api.post('/auth/login', credentials).then((response) => response.data);
}

/**
 * Registra un nuevo usuario y devuelve `{ token, user }`.
 * @param {{email:string,password:string,company?:string,businessType?:string}} data
 */
export function registerUser(data) {
  return api.post('/auth/register', data).then((response) => response.data);
}
