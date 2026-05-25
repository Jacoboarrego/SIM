// Controlador para manejar Peticiones, Quejas y Reclamos.
const Pqr = require('../models/pqrModel');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.createPqr = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: 'El correo no tiene un formato válido.' });
    }

    const pqr = new Pqr({ name, email, message });
    await pqr.save();

    res.status(201).json({ message: 'PQR guardada correctamente. Gracias por tu mensaje.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al procesar la PQR.' });
  }
};

exports.listPqrs = async (req, res) => {
  try {
    const pqrs = await Pqr.find().sort({ createdAt: -1 });
    res.json(pqrs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al leer las PQR.' });
  }
};
