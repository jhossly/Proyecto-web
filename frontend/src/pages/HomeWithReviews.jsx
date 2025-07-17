// File: frontend/src/pages/HomeWithReviews.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../components/HeaderUser.jsx";
import CarruselOfertas from "../components/CarruselOfertas.jsx";
import ProductCardWithReviews from '../components/ProductCardWithReviews.jsx';
import './Home.css';

const HomeWithReviews = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProductos(res.data);
      } catch (err) {
        console.error("Error al obtener productos:", err);
      }
    };
    obtenerProductos();
  }, []);

  return (
    <div className="home-container">
      <Header busqueda={busqueda} setBusqueda={setBusqueda} />
      <CarruselOfertas />
      <ProductCardWithReviews/>
      <h2>Productos disponibles</h2>
      <section className="product-grid">
  {productos
    .filter((producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
    .map((producto) => (
      <ProductCardWithReviews
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

export default HomeWithReviews;
