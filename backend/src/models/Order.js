// backend/src/models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  productos: [
    {
      productoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      cantidad: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  metodoPago: {
    type: String,
    enum: ['efectivo', 'tarjeta', 'transferencia','paypal'],
    default: 'tarjeta'
  },
  direccion: {
    type: String,
    required: true,
    default: 'Retiro en local'
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ['pendiente', 'procesando', 'completada', 'cancelada'],
    default: 'pendiente'
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
