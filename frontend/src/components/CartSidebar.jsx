

import { useContext, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';

const CartSidebar = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    updateQuantity, 
    removeItem, 
    isCartOpen, 
    setIsCartOpen,
    getItemCount
  } = useCart();
  
  const { user } = useAuth();
   useEffect(() => {
    setIsCartOpen(false);
  }, [location.pathname]); 

  // Calcular subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.precio * item.quantity);
  }, 0);

  const handleQuantityChange = (id, change) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;

    const nuevaCantidad = Math.max(1, item.quantity + change);
    updateQuantity(id, nuevaCantidad);
  };

  const handleCheckout = () => {
    if (!user) {
      // Guardar la ruta de redirección
      localStorage.setItem('redirectAfterLogin', '/checkout');
      // Guardar el carrito actual antes de redirigir
      localStorage.setItem('pendingCart', JSON.stringify(cartItems));
      navigate('/login');
    } else {
      setIsCartOpen(false);
      navigate('/checkout');
    }
  };

  return (
    <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>🛒 Tu Carrito ({getItemCount()})</h2>
        <button className="close-btn" onClick={() => setIsCartOpen(false)}>✖</button>
      </div>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Tu carrito está vacío</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.quantity}`} className="cart-item">
              <img src={item.imagen} alt={item.nombre} className="cart-img" />
              <div className="item-details">
                <h4>{item.nombre}</h4>
                <p>Precio unitario: ${item.precio.toFixed(2)}</p>
                <p>Total: ${(item.precio * item.quantity).toFixed(2)}</p>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                </div>
                <button 
                  className="remove-btn" 
                  onClick={() => removeItem(item.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
       
      <div className="cart-footer">
        <h3>Total: ${subtotal.toFixed(2)}</h3>
        <button
          disabled={cartItems.length === 0}
          onClick={handleCheckout}
          className="checkout-btn"
        >
          Comprar
        </button>
      </div>
    </div>
  );
};

export default CartSidebar;