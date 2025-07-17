
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