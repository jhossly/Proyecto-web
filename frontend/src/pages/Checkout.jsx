// src/pages/Checkout.jsx
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiUser, FiMail, FiMapPin, FiCreditCard, FiShoppingBag, FiArrowLeft, FiCheck } from 'react-icons/fi';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [direccionSeleccionada, setDireccionSeleccionada] = useState('');
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const total = cartItems.reduce((acc, item) => {
    const precio = parseFloat(item.precio) || 0;
    const cantidad = parseInt(item.quantity) || 0;
    return acc + precio * cantidad;
  }, 0);

 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')?.replace(/"/g, '')}`
          }
        });
        setUser(res.data.usuario);
        localStorage.setItem('user', JSON.stringify(res.data.usuario));
      } catch (err) {
        console.error('No se pudo actualizar el usuario:', err);
      }
    };

    if (!user?.nombre || !user?.correo) {
      fetchUser();
    }
  }, [setUser, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Debes iniciar sesión para comprar');
      return;
    }

    if (cartItems.length === 0) {
      setError('Tu carrito está vacío');
      return;
    }

    const orderData = {
      productos: cartItems.map(item => ({
        productId: item.id,
        cantidad: item.quantity
      })),
      direccion: direccionSeleccionada || 'Retiro en local',
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

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <h2>Tu carrito está vacío</h2>
        <button onClick={() => navigate('/')} className="primary-button">
          <FiShoppingBag className="icon" /> Ir a productos
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>

      {error && <div className="message error-message">{error}</div>}
      {success && <div className="message success-message">¡Compra realizada con éxito!</div>}

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="user-info">
          <p><strong><FiUser className="icon" /> Cliente:</strong> {user.nombre}</p>
          <p><strong><FiMail className="icon" /> Email:</strong> {user.correo}</p>
        </div>

        <div className="form-group">
          <label><FiMapPin className="icon" /> Dirección de envío:</label>
          {user?.direcciones?.length > 0 ? (
            <select 
              value={direccionSeleccionada} 
              onChange={(e) => setDireccionSeleccionada(e.target.value)}
              required
            >
              <option value="">Selecciona una dirección</option>
              {user.direcciones.map((dir, i) => (
                <option key={i} value={dir.direccion}>
                  {dir.alias} - {dir.direccion}
                </option>
              ))}
            </select>
          ) : (
            <input 
              type="text"
              value={direccionSeleccionada}
              onChange={(e) => setDireccionSeleccionada(e.target.value)}
              placeholder="Dirección de envío"
              required
            />
          )}
        </div>

        <div className="form-group">
          <label><FiCreditCard className="icon" /> Método de pago:</label>
          <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
            <option value="tarjeta">Tarjeta de crédito/débito</option>
            <option value="transferencia">Transferencia bancaria</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        <div className="order-summary">
          <h3 className="section-title"><FiShoppingBag className="icon" /> Resumen del Pedido</h3>
          <ul className="order-items">
            {cartItems.map(item => (
              <li key={item.id} className="order-item">
                <span>{item.nombre} x{item.quantity}</span>
                <span>${(item.precio * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="order-total">Total: ${total.toFixed(2)}</p>
        </div>

        <div className="button-group">
          <button 
            type="submit" 
            disabled={loading || cartItems.length === 0}
            className="buy-button"
          >
            {loading ? 'Procesando...' : (
              <>
                <FiCheck className="icon" /> Confirmar Compra
              </>
            )}
          </button>

          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="cancel-button"
          >
            <FiArrowLeft className="icon" /> Cancelar
          </button>
        </div>

        {loading && <div className="message loading-message">Procesando tu compra...</div>}
      </form>
    </div>
  );
};

export default Checkout;
