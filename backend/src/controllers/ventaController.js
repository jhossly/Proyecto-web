import Venta from '../models/Venta.js';

// Crear una venta
export const crearVenta = async (req, res) => {
  try {
    const nuevaVenta = new Venta(req.body);
    await nuevaVenta.save();
    res.status(201).json({
      mensaje: 'Venta registrada exitosamente',
      venta: nuevaVenta
    });
  } catch (error) {
    console.error('Error al crear venta:', error);
    res.status(500).json({ mensaje: 'Error al registrar venta', error: error.message });
  }
};

// Obtener todas las ventas
export const obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate('usuarioId', 'nombre correo') // Opcional: rellena con datos del usuario
      .populate('productos.productoId', 'nombre precio'); // Opcional: rellena con datos del producto

    res.status(200).json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ mensaje: 'Error al obtener ventas', error: error.message });
  }
};
