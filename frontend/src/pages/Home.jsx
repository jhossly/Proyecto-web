// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../components/Header.jsx";
import CategoryCard from '../components/CategoryCard.jsx';
import CarruselOfertas from "../components/CarruselOfertas.jsx";
import ProductCard from '../components/ProductCard.jsx'; 
import './Home.css';

const Home = () => {
  const [productos, setProductos] = useState([]);

  const categories = [
    { icon: '🧼', name: 'Aseo' },
    { icon: '📚', name: 'Escolares' },
    { icon: '🍔', name: 'Comida' },
    { icon: '🍎', name: 'Frutas' },
    { icon: '🔥', name: 'Promociones' }
  ];

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

      <h2>Productos disponibles</h2>
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

      <h2>Categorías</h2>
      <section className="categories-grid">
        {categories.map((category, index) => (
          <CategoryCard 
            key={index}
            icon={category.icon}
            name={category.name}
          />
        ))}
      </section>
    </div>
  );
};

export default Home;
