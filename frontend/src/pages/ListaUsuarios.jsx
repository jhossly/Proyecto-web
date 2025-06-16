// src/pages/ListaUsuarios.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListaUsuarios.css';

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUsuarios = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/usuarios/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsuarios(res.data);
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div className="usuarios-container">
      <h2>Usuarios Registrados</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user._id}>
              <td>{user.nombre}</td>
              <td>{user.correo}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaUsuarios;
