// src/pages/MisCompras.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './MisCompras.css';
import HeaderUser from '../components/HeaderUser'; 
const MisCompras = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const token = localStorage.getItem('token')?.replace(/"/g, '');
        const { data } = await axios.get(
          'http://localhost:5000/api/orders/mis-ordenes',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (Array.isArray(data)) setOrdenes(data);
        else {
          console.error('Respuesta inesperada:', data);
          setError('No se pudo leer tus órdenes');
        }
      } catch (err) {
        console.error('Error al obtener tus órdenes:', err);
        setError('Error al obtener tus órdenes');
      }
    };

    fetchOrdenes();
  }, []);

  if (error) return <p style={{ padding: 40 }}>{error}</p>;

  return (
    <div className="mis-compras-container">
      <h2>Mis Compras</h2>
        <HeaderUser /> 
      {ordenes.length === 0 ? (
        <p>No has realizado ninguna compra todavía.</p>
      ) : (
        <table className="compras-tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Método</th>
              <th>Dirección</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden._id}>
                <td>{new Date(orden.fecha).toLocaleDateString()}</td>

                <td>
                  {orden.productos?.length ? (
                    <ul>
                      {orden.productos.map((p, i) => (
                        <li key={i}>
                          {p?.productoId?.nombre
                            ? `${p.productoId.nombre} x${p.cantidad}`
                            : <i>Producto eliminado</i>}
                        </li>
                      ))}
                    </ul>
                  ) : <i>Sin productos</i>}
                </td>

                <td>{orden.metodoPago || '—'}</td>
                <td>{orden.direccion || '—'}</td>

                <td>
                  $
                  {(
                    typeof orden.total === 'number'
                      ? orden.total
                      : Number(orden.total) || 0
                  ).toFixed(2)}
                </td>

                <td>
                  <span className={`estado ${orden.estado}`}>
                    {orden.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MisCompras;
