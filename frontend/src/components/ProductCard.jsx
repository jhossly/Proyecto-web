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
      quantity: 1, // Asignar una cantidad inicial de 1
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


////////////////////////////////////////////////
/*import { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

const ProductCard = ({ id, nombre, descripcion, precio, imagen }) => {
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const { isAuthenticated } = useAuth();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState(null);

  // Obtener reseñas del producto
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const response = await axios.get(`http://localhost:5000/api/reviews/producto/${id}`);
        setReviews(response.data);

        if (response.data.length > 0) {
          const avg = response.data.reduce((sum, review) => sum + review.calificacion, 0) / response.data.length;
          setAverageRating(avg.toFixed(1));
        } else {
          setAverageRating(0);
        }
      } catch (err) {
        setError('Error al cargar reseñas');
        console.error('Error al obtener reseñas:', err);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (isAuthenticated) { // Solo cargar reseñas si el usuario está autenticado
      fetchReviews();
    } else {
      // Si no está autenticado, limpia reseñas y rating
      setReviews([]);
      setAverageRating(0);
    }
  }, [id, isAuthenticated]);

  // Función para agregar producto al carrito
  const handleAgregar = () => {
    addToCart({
      id,
      nombre,
      descripcion,
      precio: parseFloat(precio),
      imagen,
      quantity: 1,
    });
    setIsCartOpen(true);
  };

  // Enviar reseña
  const handleSubmitReview = async () => {
    if (!rating || !comment) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        {
          producto: id,
          comentario: comment,
          calificacion: rating
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Añade la nueva reseña a la lista y actualiza promedio
      const nuevaReseña = response.data.reseña;
      const nuevasReseñas = [...reviews, nuevaReseña];
      setReviews(nuevasReseñas);

      const avg = nuevasReseñas.reduce((sum, review) => sum + review.calificacion, 0) / nuevasReseñas.length;
      setAverageRating(avg.toFixed(1));

      setComment('');
      setRating(0);
      setShowReviewForm(false);
      setError(null);
    } catch (err) {
      console.error('Error al enviar reseña:', err);
      setError('Error al enviar reseña');
    }
  };

  return (
    <div className="product-card">
      <img src={imagen} alt={nombre} className="product-image" />
      <h3>{nombre}</h3>
      <p>{descripcion}</p>
      <p className="price">${parseFloat(precio).toFixed(2)}</p>

      {averageRating > 0 && (
        <div className="rating-section">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= averageRating ? 'filled' : ''}
              >
                ★
              </span>
            ))}
          </div>
          <span>({averageRating})</span>
        </div>
      )}

      <button className="add-to-cart-btn" onClick={handleAgregar}>
        🛒 Añadir al carrito
      </button>

      {isAuthenticated && (
        <>
          <button
            className="review-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancelar' : 'Dejar reseña'}
          </button>

          {showReviewForm && (
            <div className="review-form">
              <h4>Tu opinión</h4>
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
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe tu reseña..."
              />
              <button
                onClick={handleSubmitReview}
                disabled={!rating || !comment}
              >
                Enviar reseña
              </button>
              {error && <p className="error-message">{error}</p>}
            </div>
          )}
        </>
      )}

      {reviews.length > 0 && (
        <div className="reviews-preview">
          <h4>Últimas reseñas</h4>
          {reviews.slice(0, 2).map((review) => (
            <div key={review._id} className="review">
              <p><strong>{review.usuario?.nombre || 'Anónimo'}</strong>: {review.comentario}</p>
              <div className="review-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= review.calificacion ? 'filled' : ''}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

//export default ProductCard;


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
