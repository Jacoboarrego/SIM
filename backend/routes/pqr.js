// Rutas para Peticiones, Quejas y Reclamos.
const express = require('express');
const router = express.Router();
const { createPqr, listPqrs } = require('../controllers/pqrController');

// Guarda una nueva PQR.
router.post('/', createPqr);

// Lista todas las PQRs registradas.
router.get('/', listPqrs);

module.exports = router;
