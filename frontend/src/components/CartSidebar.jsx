import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';

const CartSidebar = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeItem, isCartOpen, setIsCartOpen } = useContext(CartContext);

  const [forceUpdate, setForceUpdate] = useState(0); // Forzar redibujado

  // Cuando cambia cartItems, forzamos render
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [cartItems]);

  // Calcular subtotal
  const subtotal = cartItems.reduce((total, item) => {
    const precio = typeof item.precio === 'string'
      ? parseFloat(item.precio.replace('$', '').trim())
      : Number(item.precio);
    const cantidad = Number(item.quantity) || 1;
    return total + (precio * cantidad);
  }, 0);

  console.log('Cart items', cartItems);
  console.log('Subtotal calculado:', subtotal);

  const handleQuantityChange = (id, change) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;

    const nuevaCantidad = Math.max(1, (item.quantity || 0) + change);
    updateQuantity(id, nuevaCantidad);
  };

  return (
    <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>🛒 Tu Carrito</h2>
        <button className="close-btn" onClick={() => setIsCartOpen(false)}>✖</button>
      </div>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Tu carrito está vacío</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.quantity}-${forceUpdate}`} className="cart-item">
              <img src={item.imagen} alt={item.nombre} className="cart-img" />
              <div className="item-details">
                <h4>{item.nombre}</h4>
                <p>Precio unitario: ${Number(item.precio).toFixed(2)}</p>
                <p>Total: ${(Number(item.precio) * Number(item.quantity)).toFixed(2)}</p>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeItem(item.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-footer">
        <h3>Total: ${subtotal.toFixed(2)}</h3>
        <button
          disabled={cartItems.length === 0 || subtotal <= 0}
          onClick={() => {
            setIsCartOpen(false);
            navigate('/checkout');
          }}
        >
          Comprar
        </button>
      </div>
    </div>
  );
};

export default CartSidebar;
