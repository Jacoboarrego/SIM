// Esquema para guardar Peticiones, Quejas y Reclamos en MongoDB.
const mongoose = require('mongoose');

const pqrSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pqr', pqrSchema);
