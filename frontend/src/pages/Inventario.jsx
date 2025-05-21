// src/pages/Inventory.jsx
/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Inventario.css';

const Inventory = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    obtenerProductos();
  }, []);

  return (
    <div className="inventory-container">
      <h2>Inventario</h2>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.nombre}</td>
              <td>{p.categoria}</td>
              <td>${p.precio}</td>
              <td>{p.stock}</td>
              <td>
                <select name "combobox1">
                 <option>Editar</option>
                 <option >Eliminar</option>
                </select>
              </td>
            </tr>

          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inventario.css';

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

  // Obtener productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
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
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, editForm);
      setProducts(products.map(p => 
        p._id === id ? { ...p, ...editForm } : p
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  // Actualizar stock
  const updateStock = async (id, newStock) => {
    try {
      await axios.patch(`http://localhost:5000/api/products/${id}/stock`, {
        stock: newStock
      });
      setProducts(products.map(p => 
        p._id === id ? { ...p, stock: newStock } : p
      ));
    } catch (error) {
      console.error('Error al actualizar stock:', error);
    }
  };

  return (
    <div className="inventory-container">
      <h2>Inventario</h2>
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
          {products.map((p) => (
            <tr key={p._id}>
              <td>
                {editingId === p._id ? (
                  <input
                    type="text"
                    name="nombre"
                    value={editForm.nombre}
                    onChange={handleEditChange}
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
                  />
                ) : (
                  `$${p.precio}`
                )}
              </td>
              <td>
                <div className="stock-control">
                  <button 
                    onClick={() => updateStock(p._id, p.stock - 1)}
                    disabled={p.stock <= 0}
                  >
                    -
                  </button>
                  <span>{p.stock}</span>
                  <button 
                    onClick={() => updateStock(p._id, p.stock + 1)}
                  >
                    +
                  </button>
                </div>
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
                      onClick={() => setEditingId(null)}
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