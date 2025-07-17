
// src/routers/orderRouter.js
import express from 'express';
import { verifyToken,verifyAdmin } from '../middlewares/authMiddleware.js';
import { crearOrden,obtenerTodasLasOrdenes,obtenerResumenVentas,actualizarEstadoOrden, obtenerOrdenesPorUsuario,getFavoriteProduct } from '../controllers/orderController.js';
const router = express.Router();

router.post('/', verifyToken, crearOrden);
router.get('/', verifyToken, verifyAdmin,obtenerTodasLasOrdenes); 
router.get('/reporte', verifyToken, verifyAdmin, obtenerResumenVentas); // Obtener resumen de ventas
router.get('/favorito', verifyToken, getFavoriteProduct);
router.get('/:mis-ordenes', verifyToken, obtenerOrdenesPorUsuario); // Obtener una orden específica
router.patch('/:id/estado', verifyToken, verifyAdmin, actualizarEstadoOrden);
export default router;
