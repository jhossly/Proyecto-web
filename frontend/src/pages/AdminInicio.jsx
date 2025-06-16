// src/pages/AdminInicio.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminInicio.css';

const AdminInicio = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-inicio">
      <h1>Bienvenido al Panel de Administración </h1>
      <p>Aquí podrás gestionar toda la tienda Golosito:</p>
      <ul>
        <li> Agregar productos</li>
        <li> Ver usuarios</li>
        <li> Revisar estadísticas</li>
      </ul>

      <div className="admin-botones">
        <button onClick={() => navigate('/adminPanel')}>Ir a gestión de productos</button>
        <button onClick={() => navigate('/usuarios')}>Ver usuarios</button>
        <button onClick={() => navigate('/ventas')}>Ver ventas</button>
        <button onClick={() => navigate('/inventario')}>Ver inventario</button>
        <button onClick={() => navigate('/estadisticas')}>Ver estadísticas</button>
      </div>
    </div>
  );
};

export default AdminInicio;
