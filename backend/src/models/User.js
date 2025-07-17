
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true 
  },
  correo: { 
    type: String, 
    required: true, 
    unique: true 
  },
  contraseña: { 
    type: String, 
    required: true,
    select: false 
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Roles permitidos
    default: 'user'
  },
  fechaRegistro: { 
    type: Date, 
    default: Date.now 
  },
  telefono: { 
    type: String, 
    default: '' 
  },
  direcciones: [
  {
    alias: { type: String, required: true },
    direccion: { type: String, required: true },
    detalles: { type: String },
    esPrincipal: { type: Boolean, default: false }
  }
],

  imagenPerfil: { 
    type: String, 
    default: '' 
  },
  activo: { 
    type: Boolean, 
    default: true 
  }

  
});

export default mongoose.model('User', userSchema);