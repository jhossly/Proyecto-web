// src/routers/reportRouter.js
import { Router } from 'express';
import { reporteVentas } from '../controllers/reportController.js';
import { verifyToken,verifyAdmin } from '../middlewares/authMiddleware.js';
const router = Router();

// Rutas para reportes

router.get('/ventas', verifyToken, verifyAdmin, reporteVentas);  // ✔ Orden correcto

export default router;
