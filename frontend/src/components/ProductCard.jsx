/*ProductCard.jsx */
import './ProductCard.css';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ id, nombre, descripcion, precio, imagen }) => {
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const { user } = useAuth();

  // Validar precio
  const precioValidado = !isNaN(parseFloat(precio)) ? parseFloat(precio).toFixed(2) : '0.00';

  const handleAgregar = () => {
    addToCart({
      id,
      nombre,
      descripcion,
      precio: parseFloat(precioValidado),
      imagen,
      quantity: 1,
    });
    setIsCartOpen(true);
  };

  // No renderizar si faltan datos importantes
  if (!id || !nombre || !imagen) return null;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={imagen} alt={nombre} className="product-image" />
      </div>
      
      <div className="product-content">
        <h3 className="product-name">{nombre}</h3>
        <p className="product-description">{descripcion}</p>

       

        <div className="product-price">${precioValidado}</div>
        
        <button className="add-to-cart-btn" onClick={handleAgregar}>
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};


export default ProductCard;
