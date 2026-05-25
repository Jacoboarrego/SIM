// Controlador que guarda y lista información de desarrolladores.
const Developer = require('../models/developerModel');

// Devuelve la lista de desarrolladores guardados para la interfaz.
exports.listDevelopers = async (req, res) => {
  try {
    const developers = await Developer.find().sort({ createdAt: -1 });
    res.json(developers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener desarrolladores.' });
  }
};

exports.createDeveloper = async (req, res) => {
  try {
    const { name, role, email, message } = req.body;
    if (!name || !role || !email) {
      return res.status(400).json({ message: 'Nombre, rol y correo son obligatorios.' });
    }

    const developer = new Developer({ name, role, email, message });
    await developer.save();
    res.status(201).json(developer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al guardar información de desarrollador.' });
  }
};
