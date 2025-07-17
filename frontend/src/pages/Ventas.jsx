
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Ventas.css';

const AdminVentas = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No autenticado');
        }

        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token.replace(/"/g, '')}`,
            'Content-Type': 'application/json'
          }
        });

        setOrdenes(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Error al cargar órdenes'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
    const handleEstadoChange = async (ordenId, nuevoEstado) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');

    const response = await axios.patch(
      `http://localhost:5000/api/orders/${ordenId}/estado`,
      { nuevoEstado },
      {
        headers: {
          'Authorization': `Bearer ${token.replace(/"/g, '')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Actualiza solo la orden modificada
    setOrdenes(prevOrdenes =>
      prevOrdenes.map(orden =>
        orden._id === ordenId ? { ...orden, estado: nuevoEstado } : orden
      )
    );

  } catch (err) {
    console.error('Error al cambiar el estado:', err);
    setError('No se pudo actualizar el estado');
  }
};

  if (loading) return <div className="loading">Cargando órdenes...</div>;

  return (
    <div className="admin-ventas-container">
      <h2>Administrar ventas</h2>

      {error && <div className="error-alert">{error}</div>}

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.length > 0 ? (
              ordenes.map((orden) => (
                <tr key={orden._id}>
                  <td>{orden._id.slice(-6)}</td>
                  <td>{new Date(orden.createdAt).toLocaleDateString()}</td>
                  <td>{orden.usuario?.nombre || 'N/A'}</td>
                  <td>
                    <ul className="product-list">
                      {orden.productos.map((item, idx) => (
                        <li key={idx}>
                          {item.productoId?.nombre || 'Producto eliminado'} 
                          (x{item.cantidad}) - ${
                            item.productoId?.precio
                              ? (item.productoId.precio * item.cantidad).toFixed(2)
                              : 'N/A'
                          }
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    ${typeof orden.total === 'number' ? orden.total.toFixed(2) : 'N/A'}
                  </td>
                  <td>
                  <select
                    value={orden.estado}
                    onChange={(e) => handleEstadoChange(orden._id, e.target.value)}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="procesando">Procesando</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-orders">No hay órdenes registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVentas;
