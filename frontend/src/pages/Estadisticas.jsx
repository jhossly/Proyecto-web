// src/pages/Estadisticas.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './Estadisticas.css';

const Estadisticas = () => {
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [productosMejorCalificados, setProductosMejorCalificados] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchMasVendidos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const conteo = {};
        res.data.forEach(orden => {
          orden.productos.forEach(p => {
            const nombre = p.productoId?.nombre || 'Eliminado';
            conteo[nombre] = (conteo[nombre] || 0) + p.cantidad;
          });
        });

        const datos = Object.entries(conteo).map(([nombre, cantidad]) => ({ nombre, cantidad }));
        setProductosMasVendidos(datos);
      } catch (err) {
        console.error('Error al cargar más vendidos:', err);
      }
    };

    const fetchPromedios = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reviews/promedios', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProductosMejorCalificados(res.data);
      } catch (err) {
        console.error('Error al cargar promedios:', err);
      }
    };

    fetchMasVendidos();
    fetchPromedios();
  }, []);

  return (
    <div className="estadisticas-container">
      <h2>Productos más vendidos</h2>
      {productosMasVendidos.length === 0 ? (
        <p>No hay datos disponibles</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productosMasVendidos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}

      <h2> Productos mejor calificados</h2>
      {productosMejorCalificados.length === 0 ? (
        <p>No hay calificaciones aún</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productosMejorCalificados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="promedio" fill="#ffc107" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Estadisticas;
