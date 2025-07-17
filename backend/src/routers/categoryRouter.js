// routes/categoryRouter.js
import express from 'express';
import categoryController from '../controllers/categoryController.js';

const router = express.Router();

// Usa la exportación por defecto
router.get('/with-subcategories', categoryController.getCategoriesWithSubcategories);

export default router;