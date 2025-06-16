
// src/routers/orderRouter.js
import express from 'express';
import { verifyToken,verifyAdmin } from '../middlewares/authMiddleware.js';
import { crearOrden,obtenerTodasLasOrdenes } from '../controllers/orderController.js';
const router = express.Router();

router.post('/', verifyToken, crearOrden);
router.get('/', verifyToken, verifyAdmin,obtenerTodasLasOrdenes); // Obtener todas las órdenes

export default router;
