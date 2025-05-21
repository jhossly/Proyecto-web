/*Login.jsx*/ 
import React, { useState } from 'react';
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

      if (res.ok) {
         localStorage.setItem('user', JSON.stringify(data.user)); // o data si no viene así
          localStorage.setItem('token', data.token);
        if (data.role === 'admin') {
          navigate('/adminInicio');
        } else {
          navigate('/');
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error al iniciar sesión', error);
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
