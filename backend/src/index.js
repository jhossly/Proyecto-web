import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routers/userRouter.js'; // Ajusta si está en otra carpeta

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', userRoutes);

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/golosito')
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch(err => console.error('Error al conectar a MongoDB:', err));
