
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './inventario.css';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    stock: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
   const[busqueda, setBusqueda] = useState('');
  // Obtener token de localStorage
  const token = localStorage.getItem('token');
   
  //  axios para incluir el token en todas las peticiones
  axios.interceptors.request.use(config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  // Obtener productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        setError('No se pudieron cargar los productos');
      }
    };
    fetchProducts();
  }, []);

  // Manejar edición
  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditForm({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      stock: product.stock
    });
    setError('');
    setSuccess('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === 'precio' || name === 'stock' ? Number(value) : value
    });
  };

  const handleEditSubmit = async (id) => {
    try {
      // Validación básica
      if (!editForm.nombre || !editForm.precio || editForm.precio <= 0) {
        setError('Nombre y precio válido son requeridos');
        return;
      }

      await axios.put(`http://localhost:5000/api/products/${id}`, editForm);
      setProducts(products.map(p => 
        p._id === id ? { ...p, ...editForm } : p
      ));

      setEditingId(null);
      setSuccess('Producto actualizado correctamente');
      setError('');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setError(error.response?.data?.message || 'Error al actualizar producto');
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
        setSuccess('Producto eliminado correctamente');
        setError('');
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        setError(error.response?.data?.message || 'Error al eliminar producto');
      }
    }
  };

  // Actualizar stock
  const updateStock = async (id, newStock) => {
    if (newStock < 0) return;
    
    try {
      await axios.patch(`http://localhost:5000/api/products/${id}/stock`, {
        stock: newStock
      });
      setProducts(products.map(p => 
        p._id === id ? { ...p, stock: newStock } : p
      ));
      setSuccess('Stock actualizado correctamente');
      setError('');
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      setError(error.response?.data?.message || 'Error al actualizar stock');
    }
  };


  return (
    <div className="inventory-container">
      <h2>Inventario</h2>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      <input
        type="text"
        placeholder='Buscar producto...'
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="search-input"
      />
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products
          .filter((p)=>p.nombre.toLowerCase().includes(busqueda.toLowerCase())).map((p) => (
            <tr key={p._id}>
              <td>{p.nombre}</td>
              <td>
                {editingId === p._id ? (
                  <input
                    type="text"
                    name="nombre"
                    value={editForm.nombre}
                    onChange={handleEditChange}
                    required
                  />
                ) : (
                  p.nombre
                )}
              </td>
              <td>
                {editingId === p._id ? (
                  <input
                    type="text"
                    name="descripcion"
                    value={editForm.descripcion}
                    onChange={handleEditChange}
                  />
                ) : (
                  p.descripcion
                )}
              </td>
              <td>
                {editingId === p._id ? (
                  <input
                    type="text"
                    name="categoria"
                    value={editForm.categoria}
                    onChange={handleEditChange}
                  />
                ) : (
                  p.categoria
                )}
              </td>
              <td>
                {editingId === p._id ? (
                  <input
                    type="number"
                    name="precio"
                    value={editForm.precio}
                    onChange={handleEditChange}
                    min="0"
                    step="0.01"
                    required
                  />
                ) : (
                  `$${p.precio}`
                )}
              </td>
              <td>
                {editingId === p._id ? (
                  <input
                    type="number"
                    name="stock"
                    value={editForm.stock}
                    onChange={handleEditChange}
                    min="0"
                    required
                  />
                ) : (
                  p.stock
                )}
              </td>
              
                
            
              <td>
                {editingId === p._id ? (
                  <>
                    <button 
                      onClick={() => handleEditSubmit(p._id)}
                      className="save-btn"
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={() => {
                        setEditingId(null);
                        setError('');
                      }}
                      className="cancel-btn"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => handleEdit(p)}
                      className="edit-btn"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="delete-btn"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;