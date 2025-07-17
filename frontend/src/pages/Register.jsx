import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
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
   const esContrasenaSegura = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  if (!esContrasenaSegura(formData.contraseña)) {
    alert('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
    return;
  }
    try {
      const respuesta = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        alert('Registro exitoso 🎉');
        navigate('/login');
      } else {
        alert(data.mensaje || 'Error al registrar');
      }
    } catch (error) {
      alert('Error en la conexión al servidor');
      console.error(error);
    }
   
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2 className="welcome-title">Crear cuenta</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="nombre"
                className="form-input"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="correo"
                className="form-input"
                placeholder="ejemplo@email.com"
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            
            <div className="input-wrapper">
              <input
                type="password"
                name="contraseña"
                className="form-input"
                placeholder="••••••"
                value={formData.contraseña}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="register-button">
            Registrarme
          </button>

          <div className="login-redirect">
            ¿Ya tienes una cuenta? <a href="/login" className="login-link">Inicia sesión</a>
          </div>
        </form>
      </div>

      <div className="illustration">
        <div className="illustration-circle">
          <img
            src="https://academic.skj.ac.th/uploads/usericon.png"
            alt="Registro ilustración"
            className="illustration-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
