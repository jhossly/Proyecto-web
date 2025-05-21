// src/components/Carrusel/CarruselOfertas.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CarruselOfertas.css";

const productos = [
  {
    nombre: "Arroz Conejo Superior",
    precio: "15.00",
    imagen: "/arroz.jpg",
  },
  {
    nombre: "Leche Entera Vita",
    precio: "0.90",
    imagen: "/leche.jpg",
  },
  {
    nombre: "Aceite La Favorita",
    precio: "2.10",
    imagen: "/aceite.jpg",
  },
  {
    nombre: "Atún",
    precio: "2.00",
    imagen: "/atun-isabel.jpg",
  },
];

const CarruselOfertas = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className="carrusel-contenedor">
      <Slider {...settings}>
        {productos.map((producto, index) => (
          <div className="slide" key={index}>
            <img src={producto.imagen} alt={producto.nombre} />
            <h3>{producto.nombre}</h3>
            <p>${producto.precio}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CarruselOfertas;
