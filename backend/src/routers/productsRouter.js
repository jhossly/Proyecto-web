import express from 'express';
import Product from '../models/Products.js';
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
router.get('/subcategories', async (req, res) => {
  try {
    const { categoria } = req.query;
    if (!categoria) {
      return res.status(400).json({ error: 'El parámetro categoria es requerido' });
    }
    
    const subcategories = await Product.distinct('subcategoria', { categoria });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener subcategorías' });
  }
});

export default router;
