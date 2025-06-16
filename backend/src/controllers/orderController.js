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

