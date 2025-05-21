import express from 'express';
import { crearVenta,obtenerVentas } from '../controllers/ventaController.js';

const router = express.Router();

router.post('/', crearVenta); //api/ventas
router.get('/', obtenerVentas);
export default router;
