import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './CartSidebar.css';

const CartSidebar = () => {
  const {
    cartItems,
    updateQuantity,
    removeItem,
    isCartOpen,
    setIsCartOpen,
  } = useContext(CartContext);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0
  );

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
            <div key={item.id} className="cart-item">
              <img src={item.imagen} alt={item.nombre} className="cart-img" />
              <div className="item-details">
                <h4>{item.nombre}</h4>
                <p>Precio unitario: ${item.precio.toFixed(2)}</p>
                <p>Total: ${(item.precio * item.quantity).toFixed(2)}</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeItem(item.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-footer">
        <h3>Total: ${subtotal.toFixed(2)}</h3>
        <button className="checkout-btn">Finalizar compra</button>
      </div>
    </div>
  );
};

export default CartSidebar;
