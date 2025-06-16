// src/pages/Checkout.jsx
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [direccion, setDireccion] = useState('');
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Debes iniciar sesión para comprar');
      return;
    }

    if (cartItems.length === 0) {
  return (
    <div className="checkout-container">
      <h2>Tu carrito está vacío</h2>
      <button onClick={() => navigate('/')}>Ir a productos</button>
    </div>
  );
}


    const orderData = {
      productos: cartItems.map(item => ({
        productId: item.id,
        cantidad: item.quantity
      })),
      direccion: direccion || 'Retiro en local',
      metodoPago,
      total
    };

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token')?.replace(/"/g, '');
      const { data } = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      alert('¡Compra realizada con éxito!');
      console.log('Orden creada:', data);
      setSuccess(true);
      clearCart();
      setTimeout(() => navigate('/con-resenas'), 2500);
    } catch (err) {
      console.error('Error en checkout:', err);
      setError(err.response?.data?.error || 'Error al procesar la compra');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="checkout-container">
        <h2>Debes iniciar sesión para comprar</h2>
        <button onClick={() => navigate('/login')}>Iniciar sesión</button>
      </div>
    );
  }

  const total = cartItems.reduce((acc, item) => {
  const precio = parseFloat(item.precio) || 0;
  const cantidad = parseInt(item.quantity) || 0;
  return acc + precio * cantidad;
}, 0);


  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">¡Compra realizada con éxito!</p>}

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="user-info">
          <p><strong>Cliente:</strong> {user.nombre}</p>
          <p><strong>Email:</strong> {user.correo}</p>
        </div>

        <label>Dirección de envío:</label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Deja en blanco para retiro en local"
        />

        <label>Método de pago:</label>
        <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
          <option value="paypal">PayPal</option>
        </select>

        <h3>Resumen</h3>
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.nombre} x{item.quantity} — ${item.precio * item.quantity}
            </li>
          ))}
        </ul>
        <p><strong>Total:</strong> ${total.toFixed(2)}</p>

        <button type="submit" disabled={loading || cartItems.length === 0}>
          {loading ? 'Procesando...' : 'Confirmar Compra'}
        </button>
        {loading && <p className="loading-message">Procesando tu compra...</p>}
        <button type="button" onClick={() => navigate('/')} className="cancel-button">
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default Checkout;
