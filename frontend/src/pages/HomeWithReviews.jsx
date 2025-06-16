
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../components/Header.jsx";
import CarruselOfertas from "../components/CarruselOfertas.jsx";
import ProductCardWithReviews from '../components/ProductCardWithReviews.jsx';
import './Home.css';

const HomeWithReviews = () => {
  const [productos, setProductos] = useState([]);

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
      <Header />
      <CarruselOfertas />
      <ProductCardWithReviews/>
      <h2>Productos disponibles</h2>
      <section className="product-grid">
        {productos.map((producto) => (
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
