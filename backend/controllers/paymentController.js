// Controlador para simular un pago de carrito sin integración real de pasarela.
// Simula un pago de carrito sin conexión a pasarela real.
exports.simulatePayment = async (req, res) => {
  try {
    const { items, total, paymentMethod } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'La compra debe incluir al menos un producto.' });
    }
    if (typeof total !== 'number' || total < 0) {
      return res.status(400).json({ message: 'El total debe ser un número válido.' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: 'El método de pago es obligatorio.' });
    }

    const orderId = `ORD-${Date.now()}`;
    res.json({
      status: 'success',
      orderId,
      total,
      message: `Pago simulado exitoso con ${paymentMethod}. Gracias por su compra.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al simular pago.' });
  }
};
