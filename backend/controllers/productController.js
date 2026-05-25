// Controlador de productos que gestiona el CRUD asociado al usuario actual.
const Product = require('../models/productModel');

// Obtiene todos los productos del usuario autenticado ordenados por fecha.
exports.listProducts = async (req, res) => {
  try {
    const products = await Product.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos.' });
  }
};

// Crea un producto nuevo y lo asocia al usuario autenticado.
exports.createProduct = async (req, res) => {
  try {
    const { name, category, quantity, price } = req.body;
    if (!name || !category || quantity == null || price == null) {
      return res.status(400).json({ message: 'Todos los campos del producto son obligatorios.' });
    }

    const product = new Product({ name, category, quantity, price, owner: req.userId });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear producto.' });
  }
};

// Actualiza los campos de un producto existente si pertenece al usuario.
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, price } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: id, owner: req.userId },
      { name, category, quantity, price },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar producto.' });
  }
};

// Elimina el producto solicitado y confirma la operación.
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ _id: id, owner: req.userId });

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    res.json({ message: 'Producto eliminado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar producto.' });
  }
};
