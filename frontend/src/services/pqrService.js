// Servicio para enviar Peticiones, Quejas y Reclamos al backend.
import { api } from './api';

export function sendPqr(data) {
  return api.post('/pqr', data).then((response) => response.data);
}
