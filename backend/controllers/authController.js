// Controlador de autenticación: registro, login y perfil de usuario.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_jwt_cambio';

// Registra un nuevo usuario, encripta la contraseña y devuelve JWT.
exports.register = async (req, res) => {
  try {
    let { email = '', password = '', company = '', businessType = '' } = req.body;
    email = email.trim().toLowerCase();
    password = password.trim();
    company = company.trim();
    businessType = businessType.trim();

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, company, businessType });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '12h' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, company: user.company, businessType: user.businessType } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el registro.' });
  }
};

// Verifica credenciales y emite un token de sesión válido.
exports.login = async (req, res) => {
  try {
    let { email = '', password = '' } = req.body;
    email = email.trim().toLowerCase();
    password = password.trim();

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, user: { id: user._id, email: user.email, company: user.company, businessType: user.businessType } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el inicio de sesión.' });
  }
};

// Devuelve el perfil del usuario autenticado sin incluir contraseña.
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener perfil.' });
  }
};
