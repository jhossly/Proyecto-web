
import express from 'express';
import { obtenerPromediosPorProducto } from '../controllers/reviewController.js'
import { 
  crearReseña, 
  obtenerReseñasPorProducto 
} from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, crearReseña);
router.get('/producto/:productoId', obtenerReseñasPorProducto);
router.get('/promedios', obtenerPromediosPorProducto);

export default router;