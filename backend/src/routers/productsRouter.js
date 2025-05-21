import express from 'express';
import { crearProducto, obtenerProductos } from '../controllers/productsController.js';

const router = express.Router();

// Rutas
router.post('/', crearProducto);
router.get('/', obtenerProductos); 

export default router;
