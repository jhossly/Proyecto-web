// frontend/src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import{useAuth} from'../context/AuthContext';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    contraseña: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const API_URL = import.meta.env.VITE_API_URL;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/usuarios/login', {
        correo: formData.correo,
        contraseña: formData.contraseña
      });

      const { token, user } = response.data;

      if (!user || !user.role || !user._id) {
        throw new Error('Datos de usuario inválidos recibidos del servidor');
      }

      login({
  role: user.role,
  nombre: user.nombre,
  id: user._id
}, token);


      navigate(user.role === 'admin' ? '/adminInicio' : '/con-resenas');

    } catch (error) {
      console.error('Error en login:', error);
      setError(error.response?.data?.msg || error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="correo">Correo electrónico:</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="ejemplo@email.com"
                value={formData.correo}
                onChange={handleChange}
                disabled={loading}
                required
                className="login-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contraseña">Contraseña:</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="contraseña"
                name="contraseña"
                placeholder="••••••"
                value={formData.contraseña}
                onChange={handleChange}
                disabled={loading}
                required
                className="login-input"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`login-button ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>

          <div className="login-redirect">
            ¿No tienes cuenta? <a href="/register" className="login-link">Regístrate</a>
          </div>
        </form>
      </div>

      <div className="illustration">
        <div className="illustration-circle">
          <img
            src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
            alt="Ilustración login"
            className="illustration-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;