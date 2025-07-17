//backend/src/controllers/orderController.js
import Order from '../models/Order.js';
import Producto from '../models/Products.js';

export const crearOrden = async (req, res) => {
  console.log('Datos recibidos en crearOrden:', req.body);
  const userId = req.userId;
  const { metodoPago, direccion } = req.body;
  const productos = req.body.productos; 

  if (!productos || productos.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío' });
  }

  try {
    let total = 0;
    const productosParaOrden = [];

    // Validar y calcular total
    for (const item of productos) {
      const producto = await Producto.findById(item.productId);
      if (!producto) {
        return res.status(400).json({ error: `Producto ${item.productId} no encontrado` });
      }
      if (producto.stock < item.cantidad) {
        return res.status(400).json({ 
          error: `Stock insuficiente para ${producto.nombre}` 
        });
      }

      total += producto.precio * item.cantidad;
      productosParaOrden.push({
        productoId: item.productId,
        cantidad: item.cantidad
      });

      // Actualizar stock
      producto.stock -= item.cantidad;
      await producto.save();
    }

    const nuevaOrden = await Order.create({
      usuario: userId,
      productos: productosParaOrden,
      metodoPago: metodoPago || 'tarjeta', // Valor por defecto
      direccion: direccion || 'Retiro en local', // Valor por defecto
      total
    });

    res.status(201).json({ 
      mensaje: 'Orden creada exitosamente', 
      orden: nuevaOrden 
    });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ 
      error: 'Error al procesar la orden',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const obtenerTodasLasOrdenes = async (req, res) => {
  try {
    const ordenes = await Order.find()
      .populate('usuario', 'nombre email')
      .populate({
        path: 'productos.productoId',
        select: 'nombre precio',
        model: 'Product' 
      });

    console.log('→ Órdenes recuperadas:', ordenes);

    res.json(ordenes);
  } catch (error) {
    console.error(' Error en obtenerTodasLasOrdenes:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener órdenes', 
      detalles: error.message 
    });
  }
};


export const obtenerResumenVentas = async (req, res) => {
  try {
    const ordenes = await Order.find().populate('productos.productoId');

    let totalVentas = 0;
    let totalProductos = 0;
    const productosVendidos = {};

    ordenes.forEach(orden => {
      totalVentas += orden.total;

      orden.productos.forEach(item => {
        totalProductos += item.cantidad;
        const nombre = item.productoId?.nombre || 'Producto eliminado';

        if (!productosVendidos[nombre]) {
          productosVendidos[nombre] = item.cantidad;
        } else {
          productosVendidos[nombre] += item.cantidad;
        }
      });
    });

    res.json({
  totalVentas: totalVentas || 0,
  totalProductos: totalProductos || 0,
  productosVendidos
});

  } catch (err) {
    res.status(500).json({ error: 'Error al generar el reporte' });
  }
};
export const actualizarEstadoOrden = async (req, res) => {
  try {
    const { id }          = req.params;          // ID de la orden
    const { nuevoEstado } = req.body;           // "procesando", "completada", etc.

    // Validar que sea uno de los valores permitidos
    const ESTADOS_VALIDOS = ['pendiente', 'procesando', 'completada', 'cancelada'];
    if (!ESTADOS_VALIDOS.includes(nuevoEstado))
      return res.status(400).json({ error: 'Estado no válido' });

    const ordenActualizada = await Order.findByIdAndUpdate(
      id,
      { estado: nuevoEstado },
      { new: true }        // ← devuelve el doc actualizado
    )
      .populate('usuario', 'nombre')
      .populate('productos.productoId', 'nombre precio');

    if (!ordenActualizada)
      return res.status(404).json({ error: 'Orden no encontrada' });

    res.json({ mensaje: 'Estado actualizado', orden: ordenActualizada });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};
export const obtenerOrdenesPorUsuario = async (req, res) => {
  try {
    const userId = req.userId;

    const ordenes = await Order.find({ usuario: userId })
      .populate('productos.productoId', 'nombre precio')
      .sort({ createdAt: -1 }); // orden más reciente primero

    res.json(ordenes);
  } catch (error) {
    console.error('Error al obtener órdenes del usuario:', error.message);
    res.status(500).json({ error: 'Error al obtener órdenes del usuario' });
  }
};
export const getFavoriteProduct = async (req, res) => {
  try {
    const fav = await Order.aggregate([
      { $match: { usuario: req.userId } },
      { $unwind: '$productos' },
      { $group: {
          _id: '$productos.producto',
          total: { $sum: '$productos.cantidad' }
      }},
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);

    if (!fav.length) return res.json(null);

    const producto = await Product.findById(fav[0]._id).select('nombre');
    res.json(producto);
  } catch (err) {
    console.error('Fav product error:', err);
    res.status(500).json({ error: 'Error al calcular favorito' });
  }
};