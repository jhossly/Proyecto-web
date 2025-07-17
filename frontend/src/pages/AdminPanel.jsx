/*AdminPanel.jsx */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaPlus, FaList, FaPercentage, FaUpload } from 'react-icons/fa';
import './AdminPanel.css';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [categoriasUnicas, setCategoriasUnicas] = useState([]);
  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState([]);
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    nuevaCategoria: '',
    subcategoria: '',
    nuevaSubcategoria: '',
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
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);

        const categorias = res.data.map(p => p.categoria).filter(Boolean);
        const unicas = [...new Set(categorias)];
        setCategoriasUnicas(unicas);
      } catch (err) {
        setError(err.message);
        console.error("Error al obtener productos:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);
    
      useEffect(() => {
    const fetchSubcategories = async () => {
      if (newProduct.categoria && newProduct.categoria !== 'otra') {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/products/subcategories?categoria=${newProduct.categoria}`
          );
          setSubcategoriasDisponibles(res.data);
        } catch (err) {
          console.error("Error cargando subcategorías:", err);
        }
      } else {
        setSubcategoriasDisponibles([]);
      }
    };
    fetchSubcategories();
  }, [newProduct.categoria]);

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
       const subcategoriaFinal =  newProduct.subcategoria === 'nueva'
   ? newProduct.nuevaSubcategoria.trim()
   : newProduct.subcategoria;

    if (!subcategoriaFinal) {
    alert('Debes elegir o escribir una subcategoría');
      return;                     
    }
      const precioFinal = newProduct.conIVA 
        ? (parseFloat(newProduct.precio) * 1.15).toFixed(2) 
        : parseFloat(newProduct.precio);

      const productoConPrecioFinal = {
        nombre: newProduct.nombre,
        descripcion: newProduct.descripcion,
        precio: precioFinal,
        categoria: categoriaFinal,
        subcategoria: subcategoriaFinal,
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
        subcategoria: '',
        nuevaSubcategoria:'',
        stock: 0,
        conIVA: false,
        imagen: null
      });

      alert(res.data.mensaje);
    } catch (err) {
      alert('Error al crear el producto: ' + (err.response?.data?.mensaje || err.message));
    }
  };

  const handleViewInventory = () => {
    navigate('/adminInicio/inventario');
  };

  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="admin-panel-container">
  <div className="admin-panel-header">
    <h1><FaBox /> Gestión de Productos</h1>
    
  </div>

  <form onSubmit={handleCreateProduct} className="product-form">
    <h2><FaPlus /> Nuevo Producto</h2>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={newProduct.nombre}
            onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            value={newProduct.descripcion}
            onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Precio ($):</label>
            <input
              type="number"
              step="0.01"
              value={newProduct.precio}
              onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock:</label>
            <input
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Categoría:</label>
          <select
            value={newProduct.categoria}
            onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
          >
            <option value="">Seleccionar</option>
            {categoriasUnicas.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
            <option value="otra">Otra...</option>
          </select>

          {newProduct.categoria === 'otra' && (
            <input
              type="text"
              placeholder="Nueva categoría"
              value={newProduct.nuevaCategoria}
              onChange={(e) => setNewProduct({ ...newProduct, nuevaCategoria: e.target.value })}
              required
            />
          )}
        </div>
            <div className="form-group">
  <label>Subcategoría:</label>
  {newProduct.categoria ? (
    <>
      <select
  value={newProduct.subcategoria}
  onChange={(e) => setNewProduct({ ...newProduct, subcategoria: e.target.value })} required
>
  <option value="">Seleccionar subcategoría</option>
  {subcategoriasDisponibles.map((subcat, index) => (
    <option key={index} value={subcat}>{subcat}</option>
  ))}
  <option value="nueva">Crear nueva subcategoría...</option>
</select>

      {newProduct.subcategoria === 'nueva' && (
        <input
          type="text"
          placeholder="Nueva subcategoría"
          value={newProduct.nuevaSubcategoria}
          onChange={(e) => setNewProduct({ ...newProduct, nuevaSubcategoria: e.target.value })}
          required
                />
              )}
            </>
          ) : (
            <p className="info-text">Selecciona primero una categoría</p>
          )}
        </div>

        <div className="form-group">
          <label><FaPercentage /> ¿Incluye IVA (15%)?</label>
          <select
            value={newProduct.conIVA ? 'si' : 'no'}
            onChange={(e) => setNewProduct({ ...newProduct, conIVA: e.target.value === 'si' })}
          >
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </div>

        <div className="form-group">
          <label><FaUpload /> Imagen:</label>
          <div className="file-upload">
            <input type="file" id="product-image" accept="image/*" onChange={handleImageUpload} />
            <label htmlFor="product-image">Seleccionar archivo</label>
            {newProduct.imagen && <span className="file-name">Imagen seleccionada</span>}
          </div>
        </div>

        <button type="submit" className="submit-btn">Crear Producto</button>
      </form>
    </div>
  );
};

export default AdminPanel;
