// src/pages/ReporteVentas.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { CSVLink } from 'react-csv';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';       
import './ReporteVentas.css';

export default function ReporteVentas() {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Obtener token del localStorage
  const token = localStorage.getItem('token')?.replace(/"/g, '');

  // Función para establecer rangos predefinidos
  const setRango = (rango) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  switch (rango) {
    case 'hoy':
      setDesde(hoy.toISOString().split('T')[0]);
      setHasta(hoy.toISOString().split('T')[0]);
      break;
    case 'semana':
      const inicioSemana = new Date(hoy);
      inicioSemana.setDate(hoy.getDate() - hoy.getDay());
      setDesde(inicioSemana.toISOString().split('T')[0]);
      setHasta(hoy.toISOString().split('T')[0]);
      break;
    case 'mes':
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      setDesde(inicioMes.toISOString().split('T')[0]);
      setHasta(hoy.toISOString().split('T')[0]);
      break;
    default:
      setDesde('');
      setHasta('');
  }
  // Activar el filtrado automáticamente
  setTimeout(fetchData, 100);
};
  const fetchData = async () => {
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      setLoading(true);
      const params = {};
      if (desde) params.desde = desde;
      if (hasta) params.hasta = hasta;
      const { data } = await axios.get('http://localhost:5000/api/report/ventas', {
        params: { desde, hasta },
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(data);
    } catch (e) {
       console.error('Error fetching data:', e);
       alert('Error al obtener datos. Verifica las fechas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);     

  const k = data?.kpis ?? {};
  const csvRows = data
    ? data.porProducto.map(p => [p._id, p.unidades, p.ingresos])
    : [];

  return (
    <div className="reporte-container">
      <h2>Reporte de Ventas</h2>

      {/* Filtros mejorados */}
      <div className="filtros">
        <div className="rangos-rapidos">
          <button onClick={() => setRango('hoy')}>Hoy</button>
          <button onClick={() => setRango('semana')}>Esta semana</button>
          <button onClick={() => setRango('mes')}>Este mes</button>
        </div>
        <div className="fechas-personalizadas">
          <label>Desde: <input type="date" value={desde} onChange={e => setDesde(e.target.value)} /></label>
          <label>Hasta: <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} /></label>
          <button onClick={fetchData} disabled={loading}>Filtrar</button>
        </div>
      </div>

      {loading && <p>Cargando...</p>}
      {!loading && data && (
        <>
          <div className="kpi-grid">
            <div className="kpi-card">💰 Total ventas<br/><span>${Number(k.totalVentas).toFixed(2)}</span></div>
            <div className="kpi-card">📦 Pedidos<br/><span>{k.numeroPedidos}</span></div>
            <div className="kpi-card">🛒 Productos<br/><span>{k.totalProductos}</span></div>
            <div className="kpi-card">🏷 Ticket promedio<br/>
              <span>${k.numeroPedidos ? (k.totalVentas / k.numeroPedidos).toFixed(2) : '0.00'}</span>
            </div>
          </div>

          
      <div className="graficos-container">
      {/* Gráfico de barras (productos) */}
      <div className="grafico">
        <h3>Ventas por Producto</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.porProducto}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
            <Bar dataKey="ingresos" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de pastel (métodos de pago) */}
      <div className="grafico">
        <h3>Métodos de Pago</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.metodos}
              dataKey="total"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.metodos.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} 
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

          {/* Nueva tabla de productos */}
          <h3>Detalle de Ventas</h3>
          <div className="tabla-ventas">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Total ($)</th>
                </tr>
              </thead>
              <tbody>
                {data.porProducto.map((producto) => (
                  <tr key={producto._id}>
                    <td>{producto._id}</td>
                    <td>{producto.unidades}</td>
                    <td>${producto.ingresos.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>{k.totalProductos}</strong></td>
                  <td><strong>${k.totalVentas.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Exportar */}
          <div className="export-buttons">
          
            <PDFDownloadLink
              document={<ReportPDF data={data} desde={desde} hasta={hasta} />}
              fileName={`reporte_${desde || 'inicio'}_${hasta || 'hoy'}.pdf`}
            >
              {({ loading }) => loading ? 'Generando PDF...' : 'Descargar PDF'}
            </PDFDownloadLink>
          </div>
        </>
      )}
    </div>
  );
}