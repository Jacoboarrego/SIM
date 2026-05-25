#!/usr/bin/env node
/**
 * Script de inicialización: Registra usuario de prueba
 * Uso: npm run setup-user
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/userModel');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventory_system';

async function setupTestUser() {
  try {
    console.log('📦 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');

    const testEmail = 'arregocesandradr@gmail.com';
    const testPassword = '123456789';

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: testEmail });
    
    if (existingUser) {
      console.log('ℹ️  El usuario ya existe.');
      console.log(`📧 Email: ${existingUser.email}`);
      console.log(`🏢 Empresa: ${existingUser.company || 'N/A'}`);
      console.log('\n✅ Puedes iniciar sesión directamente.\n');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Crear nuevo usuario
    console.log('\n🔐 Creando usuario de prueba...');
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    const newUser = new User({
      email: testEmail,
      password: hashedPassword,
      company: 'SIM Academy',
      businessType: 'Educación'
    });

    await newUser.save();
    
    console.log('✅ Usuario creado exitosamente');
    console.log(`📧 Email: ${newUser.email}`);
    console.log(`🏢 Empresa: ${newUser.company}`);
    console.log(`📝 Tipo negocio: ${newUser.businessType}`);
    console.log(`📅 Fecha creación: ${newUser.createdAt}`);
    console.log('\n🚀 Ya puedes iniciar sesión:\n');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Contraseña: ${testPassword}\n`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n⚠️  Verifica:');
    console.error('  1. MongoDB está corriendo en mongodb://127.0.0.1:27017');
    console.error('  2. Variable MONGO_URI en .env es correcta');
    console.error('  3. npm install ejecutado correctamente\n');
    process.exit(1);
  }
}

// Ejecutar
console.log('═══════════════════════════════════════');
console.log('🔧 SETUP: Registrar Usuario de Prueba');
console.log('═══════════════════════════════════════\n');

setupTestUser();
