//backend/src/index.js
import mongoose from 'mongoose';

import './db.js';
import app from './app.js'

const PORT = 5000;


// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/golosito_db')
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch(err => console.error('Error al conectar a MongoDB:', err));