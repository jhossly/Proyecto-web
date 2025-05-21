import express from 'express';
import {crearProducto}from '../controllers/productsController.js';
import Products from '../models/Products.js';

const router =express.Router();
router.post('/',crearProducto)
export default router;
router.get('/', obtenerProductos);
router.get('/', async (req, res) => {
  try {
    const productos = await Products.find(); // Importa Products arriba
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
});