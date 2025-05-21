import './ProductCard.css';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ id, nombre, descripcion, precio, imagen }) => {
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  
  const handleAgregar = () => {
    addToCart({
      id,
      nombre,
      descripcion,
      precio: parseFloat(precio),
      imagen,
    });
    console.log("Producto agregado:", { id, nombre }); 
    setIsCartOpen(true); 
  };

  return (
    <div className="product-card">
      <img src={imagen} alt={nombre} className="product-image" />
      <h3>{nombre}</h3>
      <p>{descripcion}</p>
      <p className="price">${parseFloat(precio).toFixed(2)}</p>
      <button className="add-to-cart-btn" onClick={handleAgregar}>
        🛒 Añadir al carrito
      </button>
    </div>
    
  );
};



/*
const ProductCard = ({ 
  name = "Aceite la avorita", 
  category = "Categoría", 
  price = 1900, 
  regularPrice = 3000, 
  imageUrl = "/aceite.jpg" 
}) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={name} />
        <span className="discount-badge"></span> 
      </div>
      <div className="product-details">
        <h3 className="product-name">{name}</h3>
        <p className="product-category">{category}</p>
        <div className="product-prices">
          <span className="current-price">${price.toLocaleString()}</span>
          {regularPrice && (
            <span className="regular-price">${regularPrice.toLocaleString()}</span>
          )}
        </div>
        <button className="add-to-cart-btn">🛒 Añadir al carrito</button>
      </div>
    </div>
  );


};*/

export default ProductCard;
