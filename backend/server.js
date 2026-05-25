// Servidor Express principal para la API de inventarios.
// Configura CORS, parseo JSON y monta las rutas de auth, productos,
// desarrolladores y pagos.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const developerRoutes = require('./routes/developers');
const paymentRoutes = require('./routes/payments');
const pqrRoutes = require('./routes/pqr');
const deepseekRoutes = require('./routes/deepseek');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/developers', developerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/pqr', pqrRoutes);
app.use('/api/deepseek', deepseekRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend de inventario funcionando.' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventory_system';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Backend iniciado en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar a MongoDB:', error.message);
  });
