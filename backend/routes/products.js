// Rutas de CRUD de productos protegidas por JWT.
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { listProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// Protege todas las rutas de producto usando JWT.
router.use(authMiddleware);

// Lista productos del usuario actual.
router.get('/', listProducts);

// Crea un nuevo producto para el usuario autenticado.
router.post('/', createProduct);

// Actualiza un producto existente si pertenece al usuario.
router.put('/:id', updateProduct);

// Elimina un producto existente si pertenece al usuario.
router.delete('/:id', deleteProduct);

module.exports = router;
