// Rutas para obtener y crear desarrolladores en la base de datos.
const express = require('express');
const router = express.Router();
const { listDevelopers, createDeveloper } = require('../controllers/developerController');

// Devuelve la lista de desarrolladores guardados.
router.get('/', listDevelopers);

// Crea un registro de desarrollador con nombre, rol y correo.
router.post('/', createDeveloper);

module.exports = router;
