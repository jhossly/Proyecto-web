
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Products.js';

export const crearReseña = async (req, res) => {
  const { producto, calificacion } = req.body;
  const usuario = req.userId;

  if (!mongoose.Types.ObjectId.isValid(producto)) {
    return res.status(400).json({ error: 'ID de producto no válido' });
  }

  try {
    // Verificar si el producto existe
    const productoExistente = await Product.findById(producto);
    if (!productoExistente) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar si el usuario ya dejó reseña
    const reseñaExistente = await Review.findOne({ producto, usuario });
    if (reseñaExistente) {
      return res.status(400).json({ 
        error: 'Ya has dejado una reseña para este producto' 
      });
    }

    const nuevaReseña = new Review({
      producto,
      usuario,
      calificacion
    });

    await nuevaReseña.save();
    
    const reseñaGuardada = await Review.findById(nuevaReseña._id)
      .populate('usuario', 'nombre email');

    res.status(201).json({ 
      mensaje: 'Reseña guardada exitosamente', 
      reseña: reseñaGuardada
    });

  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({ 
      error: 'Error al guardar la reseña',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const obtenerReseñasPorProducto = async (req, res) => {
  try {
    const { productoId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(productoId)) {
      return res.status(400).json({ error: 'ID de producto no válido' });
    }

    const reseñas = await Review.find({ producto: productoId })
      .populate('usuario', 'nombre email')
      .sort({ fecha: -1 });

    res.status(200).json(reseñas);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ 
      error: 'Error al obtener reseñas',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const obtenerPromediosPorProducto = async (req, res) => {
  try {
    const resultados = await Review.aggregate([
      {
        $group: {
          _id: '$producto',
          promedio: { $avg: '$calificacion' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'producto'
        }
      },
      {
        $unwind: '$producto'
      },
      {
        $project: {
          nombre: '$producto.nombre',
          promedio: 1
        }
      }
    ]);

    res.json(resultados);
  } catch (error) {
    console.error('Error al obtener promedios:', error);
    res.status(500).json({ error: 'Error al calcular promedios' });
  }
};
