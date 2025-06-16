// src/models/Review.js
/*import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },

  comentario: {
    type: String,
    required: true
  },
  calificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Review', reviewSchema);*/
// src/models/Review.js
/*import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  puntuacion: { type: Number, required: true, min: 1, max: 5 },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model('Review', reviewSchema);
*/
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  producto: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  usuario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  calificacion: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  fecha: { 
    type: Date, 
    default: Date.now 
  }
}, {
  //timestamps: true
});

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);