// src/pages/Categoria.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import './Categorias.css';

const Categoria = () => {
  const { nombreCategoria } = useParams(); // ← esto lo trae de la URL
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products`);
        const productosFiltrados = res.data.filter(producto => 
          producto.categoria.toLowerCase() === nombreCategoria.toLowerCase()
        );
        setProductos(productosFiltrados);
      } catch (err) {
        console.error("Error al obtener productos:", err);
      }
    };
    obtenerProductos();
  }, [nombreCategoria]);

  return (
    <div className="categoria-container">
      <Header />
      <h2>Productos de la categoría: {nombreCategoria}</h2>
      <section className="product-grid">
        {productos.map((producto) => (
          <ProductCard
            key={producto._id}
            id={producto._id}
            nombre={producto.nombre}
            descripcion={producto.descripcion}
            precio={producto.precio}
            imagen={producto.imagen}
          />
        ))}
      </section>
    </div>
  );
};

export default Categoria;
