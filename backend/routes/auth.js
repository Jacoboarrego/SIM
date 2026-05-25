// Rutas de autenticación para registro, inicio de sesión y perfil.
const express = require('express');
const router = express.Router();
const { register, login, profile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Crea una nueva cuenta de usuario.
router.post('/register', register);

// Inicia sesión y retorna token JWT.
router.post('/login', login);

// Devuelve datos de usuario autenticado.
router.get('/profile', authMiddleware, profile);

module.exports = router;
