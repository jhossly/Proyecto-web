// controllers/categoryController.js
import Product from '../models/Products.js';

// Función para obtener categorías con subcategorías
export const getCategoriesWithSubcategories = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: {
            categoria: "$categoria",
            subcategoria: "$subcategoria"
          }
        }
      },
      {
        $group: {
          _id: "$_id.categoria",
          subcategorias: { $push: "$_id.subcategoria" }
        }
      }
    ]);
    
    const categories = result.map(cat => ({
      name: cat._id,
      subcategories: [...new Set(cat.subcategorias)] // Elimina duplicados
    }));

    res.json(categories);
  } catch (error) {
    console.error('Error en getCategoriesWithSubcategories:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};


export default {
  getCategoriesWithSubcategories
};