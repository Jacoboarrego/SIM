// Rutas para simular pagos y comprobantes dentro de la API.
const express = require('express');
const router = express.Router();
const { simulatePayment } = require('../controllers/paymentController');

// Simula el cobro de un carrito de compras.
router.post('/', simulatePayment);

module.exports = router;
