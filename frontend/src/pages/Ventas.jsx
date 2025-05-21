import React, { useState } from 'react';
import './Ventas.css';

const Ventas = () => {
  const [venta, setVenta] = useState({
    usuarioId: '', //  poner un ID válido de usuario
    productos: [
      {
        productoId: '', // ID válido 
        cantidad: 1,
        precioUnitario: 0
      }
    ],
    totalVenta: 0,
    metodoPago: 'efectivo'
  });

  const handleChange = (e) => {
    setVenta({
      ...venta,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch('http://localhost:5000/api/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(venta)
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        alert('Venta registrada exitosamente');
        console.log(data);
      } else {
        alert(data.mensaje || 'Error al registrar venta');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('Error en la conexión al servidor');
    }
  };

  return (
    <div>
      <h2>Registrar Venta</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="usuarioId"
          placeholder="ID del Usuario"
          value={venta.usuarioId}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="productoId"
          placeholder="ID del Producto"
          value={venta.productos[0].productoId}
          onChange={(e) => {
            const nuevosProductos = [...venta.productos];
            nuevosProductos[0].productoId = e.target.value;
            setVenta({ ...venta, productos: nuevosProductos });
          }}
          required
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={venta.productos[0].cantidad}
          onChange={(e) => {
            const nuevosProductos = [...venta.productos];
            nuevosProductos[0].cantidad = Number(e.target.value);
            setVenta({ ...venta, productos: nuevosProductos });
          }}
        />
        <input
          type="number"
          placeholder="Precio unitario"
          value={venta.productos[0].precioUnitario}
          onChange={(e) => {
            const nuevosProductos = [...venta.productos];
            nuevosProductos[0].precioUnitario = Number(e.target.value);
            setVenta({ ...venta, productos: nuevosProductos });
          }}
        />
        <input
          type="number"
          name="totalVenta"
          placeholder="Total"
          value={venta.totalVenta}
          onChange={handleChange}
          required
        />
        <select
          name="metodoPago"
          value={venta.metodoPago}
          onChange={handleChange}
        >
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
        </select>
        <button type="submit">Guardar Venta</button>
      </form>
    </div>
  );
};

export default Ventas;
