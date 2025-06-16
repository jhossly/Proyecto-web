/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    contraseña: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading (true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: formData.correo,
          contraseña: formData.contraseña
        })
      });

      const data = await res.json();
      console.log('Respuesta completa:', res);
      console.log('Datos recibidos:', data);


      if (res.ok) {
        const { token, user } = data;

        if (user && user.role && user._id) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify({
            role: user.role,
            nombre: user.nombre,
            id: user._id,
          }));

          // Redirección según el rol
          if (user.role === 'admin') {
            navigate('/adminInicio');
          } else {
            navigate('/con-resenas');
          }
        } else {
          alert("Datos de usuario inválidos.");
        }
      } else {
        alert(data.msg || "Credenciales inválidas.");
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert("Error del servidor.");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Correo electrónico:</label>
        <input
          type="email"
          name="correo"
          placeholder="ejemplo@email.com"
          value={formData.correo}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          name="contraseña"
          placeholder="••••••"
          value={formData.contraseña}
          onChange={handleChange}
          required
        />

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;

*/
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Ahora setLoading está definido
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

      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        role: user.role,
        nombre: user.nombre,
        id: user._id
      }));

      // Redirección basada en rol
      navigate(user.role === 'admin' ? '/adminInicio' : '/con-resenas');

    } catch (error) {
      console.error('Error en login:', error);
      setError(error.response?.data?.msg || 
              error.message || 
              'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="correo">Correo electrónico:</label>
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

        <div className="form-group">
          <label htmlFor="contraseña">Contraseña:</label>
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

        <button 
          type="submit" 
          disabled={loading}
          className={`login-button ${loading ? 'loading' : ''}`}
        >
          {loading ? 'Cargando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login;