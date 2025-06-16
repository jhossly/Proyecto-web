import Products from '../models/Products.js';
export const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, categoria, stock, imagen, conIVA } = req.body;

  try {
    // Validación 
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
export const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Products.findByIdAndUpdate(
      id,
      {
        activo: false,
        fechaEliminacion: Date.now()
      },
      { new: true }
    );

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ 
      mensaje: 'Producto desactivado correctamente',
      producto
    });
  } catch (error) {
    console.error('Error al desactivar producto:', error);
    res.status(500).json({
      mensaje: 'Error al desactivar producto',
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
export const obtenerTodosProductos = async (req, res) => {
  try {
    const productos = await Products.find();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener todos los productos', 
      error: error.message 
    });
  }
};


export const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, categoria, stock, imagen, conIVA } = req.body;

  try {
    // Validación 
    if (!nombre || !precio) {
      return res.status(400).json({ mensaje: 'Nombre y precio son obligatorios' });
    }

    const precioFinal = conIVA ? parseFloat((parseFloat(precio) * 1.15).toFixed(2)) : parseFloat(precio);

    const productoActualizado = await Products.findByIdAndUpdate(
      id,
      {
        nombre,
        descripcion,
        precio: precioFinal,
        categoria,
        stock,
        imagen,
        conIVA
      },
      { new: true } // Devuelve el documento actualizado
    );

    if (!productoActualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({
      mensaje: 'Producto actualizado correctamente',
      producto: productoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      mensaje: 'Error al actualizar producto',
      error: error.message
    });
  }
};

export const actualizarStock = async (req, res) => {
  const { id } = req.params;
  const { operacion } = req.body; // 'incrementar' o 'decrementar'

  try {
    const producto = await Products.findById(id);
    
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Validar operación
    if (operacion === 'decrementar' && producto.stock <= 0) {
      return res.status(400).json({ mensaje: 'Stock no puede ser menor a 0' });
    }

    // Actualizar stock
    const nuevoStock = operacion === 'incrementar' 
      ? producto.stock + 1 
      : producto.stock - 1;

    const productoActualizado = await Products.findByIdAndUpdate(
      id,
      { stock: nuevoStock },
      { new: true }
    );

    res.json({
      mensaje: 'Stock actualizado correctamente',
      producto: productoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({
      mensaje: 'Error al actualizar stock',
      error: error.message
    });
  }
};