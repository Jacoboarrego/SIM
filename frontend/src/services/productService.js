// Servicio de productos, pagos y endpoints relacionados.
// Todas las funciones retornan `response.data` para facilitar su uso en componentes.
import { api, authHeader } from './api';

/**
 * Obtiene la lista de productos pertenecientes al usuario autenticado.
 * @param {string} token
 */
export function fetchProducts(token) {
  return api.get('/products', { headers: authHeader(token) }).then((response) => response.data);
}

/**
 * Crea un nuevo producto asociado al usuario actual.
 * @param {string} token
 * @param {{name:string,category:string,quantity:number,price:number}} product
 */
export function createProduct(token, product) {
  return api.post('/products', product, { headers: authHeader(token) }).then((response) => response.data);
}

/**
 * Actualiza un producto existente si pertenece al usuario.
 * @param {string} token
 * @param {string} id
 * @param {{name:string,category:string,quantity:number,price:number}} product
 */
export function updateProduct(token, id, product) {
  return api.put(`/products/${id}`, product, { headers: authHeader(token) }).then((response) => response.data);
}

/**
 * Elimina el producto indicado por id.
 * @param {string} token
 * @param {string} id
 */
export function deleteProduct(token, id) {
  return api.delete(`/products/${id}`, { headers: authHeader(token) }).then((response) => response.data);
}

/**
 * Llama al endpoint de pagos para simular una transacción y devolver un recibo.
 * @param {string} token
 * @param {{items:Array, total:number, paymentMethod:string}} paymentData
 */
export function simulatePayment(token, paymentData) {
  return api.post('/payments', paymentData, { headers: authHeader(token) }).then((response) => response.data);
}

/**
 * Guarda información de desarrollador (demo) en el servidor.
 * No requiere token.
 */
export function saveDeveloperInfo(data) {
  return api.post('/developers', data).then((response) => response.data);
}
