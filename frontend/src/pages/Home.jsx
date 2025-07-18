// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../components/Header.jsx";
import CarruselOfertas from "../components/CarruselOfertas.jsx";
import ProductCard from '../components/ProductCard.jsx'; 
import './Home.css';

const Home = () => {
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
      <Header busqueda={busqueda}setBusqueda={setBusqueda} />
      <CarruselOfertas />
       
      <h2>Productos disponibles</h2>
  
      <section className="product-grid">
        {productos
        .filter((producto)=>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
       ).map((producto) => (
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

export default Home;
