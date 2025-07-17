// src/controllers/reportController.js
import Order from '../models/Order.js';


export const reporteVentas = async (req, res) => {
  let { desde, hasta } = req.query;

   const fechaInicio = desde ? new Date(`${desde}T00:00:00Z`) : new Date('1970-01-01');
  const fechaFin = hasta ? new Date(`${hasta}T23:59:59.999Z`) : new Date();

  try {
      const matchStage = {
      createdAt: {
        $gte: fechaInicio,
        $lte: fechaFin
      }
      
    };

     const kpis = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalVentas: { $sum: '$total' },
          numeroPedidos: { $sum: 1 },
          totalProductos: { $sum: { $sum: '$productos.cantidad' } }
        }
      }
    ]);

    
    const porProducto = await Order.aggregate([
      { $match: { createdAt: { $gte: fechaInicio, $lte: fechaFin } } },
      { $unwind: '$productos' },
      {
        $lookup: {
          from: 'products',
          localField: 'productos.productoId',
          foreignField: '_id',
          as: 'prod'
        }
      },
      { $unwind: '$prod' },
      {
        $group: {
          _id: '$prod.nombre',
          unidades: { $sum: '$productos.cantidad' },
          ingresos: { $sum: { $multiply: ['$productos.cantidad', '$prod.precio'] } }
        }
      },
      { $sort: { ingresos: -1 } }
    ]);

    
    const metodos = await Order.aggregate([
      { $match: { createdAt: { $gte: fechaInicio, $lte: fechaFin } } },
      { $group: { _id: '$metodoPago', total: { $sum: '$total' } } }
    ]);

    
    const topClientes = await Order.aggregate([
      { $match: { createdAt: { $gte: fechaInicio, $lte: fechaFin } } },
      {
        $group: {
          _id: '$usuario',
          gasto: { $sum: '$total' }
        }
      },
      { $sort: { gasto: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'cliente'
        }
      },
      { $unwind: '$cliente' },
      {
        $project: {
          nombre: '$cliente.nombre',
          correo: '$cliente.correo',
          gasto: 1
        }
      }
    ]);

  
    res.json({
      kpis: kpis[0] || { totalVentas: 0, numeroPedidos: 0, totalProductos: 0 },
      porProducto,
      metodos,
      topClientes
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error generando reporte' });
  }
};
