import express from 'express';
import { crearProducto, obtenerProductos,
    obtenerTodosProductos, eliminarProducto,actualizarProducto,actualizarStock 
 } from '../controllers/productsController.js';

const router = express.Router();

// Rutas
router.post('/', crearProducto);
router.get('/', obtenerProductos); 
router.get('/todos', obtenerTodosProductos);
router.put('/:id', actualizarProducto);
router.patch('/:id/stock', actualizarStock);
router.delete('/:id', eliminarProducto);


export default router;
