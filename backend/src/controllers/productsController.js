import Products from '../models/Products.js';
export const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, categoria, stock, imagen, conIVA } = req.body;

  try {
    // Validación básica
    if (!nombre || !precio) {
      return res.status(400).json({ mensaje: 'Nombre y precio son obligatorios' });
    }

    const precioFinal = conIVA ? parseFloat((parseFloat(precio) * 1.15).toFixed(2)) : parseFloat(precio);


    const nuevoProducto = new Products({
      nombre,
      descripcion: descripcion || '',
      precio: precioFinal,
      categoria: categoria || 'general',
      stock: stock || 0,
      imagen: imagen || '',
      conIVA: conIVA || false,
      //fechaIngreso: Date.now,
    });

    await nuevoProducto.save();

    res.status(201).json({
      mensaje: 'Producto registrado correctamente',
      producto: nuevoProducto
    });
  } catch (error) {
    console.error('Error al registrar producto:', error);
    res.status(500).json({
      mensaje: 'Error al registrar producto',
      error: error.message
    });
  }
};

export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Products.find();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener productos', 
      error: error.message 
    });
  }
};