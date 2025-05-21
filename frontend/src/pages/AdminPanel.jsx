// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [categoriasUnicas, setCategoriasUnicas] = useState([]);
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    nuevaCategoria: '',
    stock: 0,
    conIVA: false,
    imagen: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.post('http://localhost:5000/api/products');
         productoConPrecioFinal;
        setProducts(res.data);

        const categorias = res.data.map(p => p.categoria).filter(Boolean);
        const unicas = [...new Set(categorias)];
        setCategoriasUnicas(unicas);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, imagen: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const categoriaFinal = newProduct.categoria === 'otra' ? newProduct.nuevaCategoria : newProduct.categoria;
      const precioFinal = newProduct.conIVA 
        ? (parseFloat(newProduct.precio) * 1.15).toFixed(2) 
        : parseFloat(newProduct.precio);

      const productoConPrecioFinal = {
        nombre: newProduct.nombre,
        descripcion: newProduct.descripcion,
        precio: precioFinal,
        categoria: categoriaFinal,
        stock: newProduct.stock,
        imagen: newProduct.imagen,
        conIVA: newProduct.conIVA
      };

      const res = await axios.post('http://localhost:5000/api/products', productoConPrecioFinal);
      setProducts([...products, res.data.producto]);
      setNewProduct({
        nombre: '',
        descripcion: '',
        precio: 0,
        categoria: '',
        nuevaCategoria: '',
        stock: 0,
        conIVA: false,
        imagen: null
      });
      alert(res.data.mensaje);
    } catch (err) {
      alert('Error al crear el producto: ' + (err.response?.data?.mensaje || err.message));
    }
  };

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>

      <button onClick={() => navigate('/inventario')} className="btn-ver-inventario">
        Ver Inventario
      </button>

      <form onSubmit={handleCreateProduct} className="form-admin">
        <h2>Añadir Nuevo Producto</h2>

        <label>Nombre:</label>
        <input
          type="text"
          placeholder="Nombre"
          value={newProduct.nombre}
          onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
          required
        />

        <label>Descripción:</label>
        <textarea
          placeholder="Descripción"
          value={newProduct.descripcion}
          onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
        />

        <label>Precio:</label>
        <input
          type="number"
          step="0.01"
          placeholder="Precio"
          value={newProduct.precio}
          onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })}
          required
        />

        <label>Categoría:</label>
        <select
          value={newProduct.categoria}
          onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
        >
          <option value="">Seleccionar categoría</option>
          {categoriasUnicas.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
          <option value="otra">Otra...</option>
        </select>

        {newProduct.categoria === 'otra' && (
          <input
            type="text"
            placeholder="Escribe nueva categoría"
            value={newProduct.nuevaCategoria}
            onChange={(e) => setNewProduct({ ...newProduct, nuevaCategoria: e.target.value })}
            required
          />
        )}

        <label>Stock:</label>
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
        />

        <label>¿Este producto incluye IVA (15%)?</label>
        <select
          value={newProduct.conIVA ? 'si' : 'no'}
          onChange={(e) => setNewProduct({ ...newProduct, conIVA: e.target.value === 'si' })}
        >
          <option value="no">No</option>
          <option value="si">Sí</option>
        </select>

        <label>Cargar imagen:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <button type="submit">Crear Producto</button>
      </form>
    </div>
  );
};

export default AdminPanel;
