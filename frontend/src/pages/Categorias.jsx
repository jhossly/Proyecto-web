

// src/pages/Categoria.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import './Categorias.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Categoria = () => {
  const query = useQuery();
  const categoria = query.get('categoria');
  const subcategoria = query.get('subcategoria');
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        let data = res.data;

        if (categoria) {
          data = data.filter(p => p.categoria?.toLowerCase() === categoria.toLowerCase());
        }
        if (subcategoria) {
          data = data.filter(p => p.subcategoria?.toLowerCase() === subcategoria.toLowerCase());
        }

        setProductos(data);
      } catch (err) {
        console.error("Error al obtener productos:", err);
      }
    };

    fetchProductos();
  }, [categoria, subcategoria]);

  return (
    <div className="categoria-container">
      <Header />
      <h2>
        {subcategoria
          ? `Productos en: ${categoria} / ${subcategoria}`
          : `Categoría: ${categoria}`
        }
      </h2>
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
