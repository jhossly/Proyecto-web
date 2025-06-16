// src/components/ProductCardWithReviews.jsx
import './ProductCartWhithReviews.css';
import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProductCardWithReviews = ({ id, nombre, descripcion, precio, imagen }) => {
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); //  para mostrar mensaje de éxito

  //  función para obtener reseñas 
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/producto/${id}`);
      setReviews(res.data);

      const avg = res.data.reduce((acc, r) => acc + r.calificacion, 0) / res.data.length;
      setAverageRating(avg.toFixed(1));
    } catch (err) {
      console.error('Error al obtener reseñas:', err);
    }
  };

  useEffect(() => {
    if (!id || !user) return;
    fetchReviews();
  }, [id, user]);

  const handleAgregar = () => {
    addToCart({ id, nombre, descripcion, precio: parseFloat(precio), imagen, quantity: 1 });
    setIsCartOpen(true);
  };

  const handleGuardar = async () => {
    if (rating === 0) {
      setError('Selecciona una calificación primero');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/reviews',
        {
          producto: id,
          calificacion: rating
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setRating(0);
      setError(null);
      setSuccess('Reseña guardada correctamente '); //  Mensaje temporal

      await fetchReviews(); //  

      setTimeout(() => setSuccess(null), 3000); //  Ocultar mensaje de éxito después de 3 segundos
    } catch (err) {
      console.error('Error al guardar calificación:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'No se pudo guardar la calificación');
    }
  };

  return (
    <div className="product-card">
      <img src={imagen} alt={nombre} className="product-image" />
      <h3>{nombre}</h3>
      <p>{descripcion}</p>
      <p className="price">${parseFloat(precio).toFixed(2)}</p>

      {user && (
        <div className="rating-section">
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={star <= rating ? 'selected' : ''}
                style={{ cursor: 'pointer' }}
              >
                ★
              </span>
            ))}
          </div>
          <button onClick={handleGuardar}>Guardar calificación</button>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </div>
      )}

      {averageRating > 0 && (
        <div className="average-rating">
          <strong>Promedio: {averageRating} ★</strong>
          <small> ({reviews.length} reseñas)</small>
        </div>
      )}

      <button className="add-to-cart-btn" onClick={handleAgregar}>
        🛒 Añadir al carrito
      </button>
    </div>
  );
};

export default ProductCardWithReviews;
