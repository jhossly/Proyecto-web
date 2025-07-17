import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { toast } from 'react-toastify';
import OSMapPicker from '../components/OSMapPicker';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: ''
  });

  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    alias: '',
    direccion: '',
    detalles: '',
    esPrincipal: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        correo: user.correo || '',
        telefono: user.telefono || ''
      });
      setAddresses(user.direcciones || []);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put('/auth/profile', {
        ...formData,
        direcciones: addresses
      });

      const res = await api.get('/auth/me');
      setUser(res.data.usuario);
      localStorage.setItem('user', JSON.stringify(res.data.usuario));
      toast.success('Perfil actualizado');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = () => {
    if (!newAddress.alias || !newAddress.direccion) {
      toast.error('Alias y dirección son requeridos');
      return;
    }

    setAddresses((prev) => [...prev, newAddress]);
    setNewAddress({
      alias: '',
      direccion: '',
      detalles: '',
      esPrincipal: false
    });
    setShowMap(false);
    toast.success('Dirección agregada');
  };

  const togglePrimary = (index) => {
    setAddresses((prev) =>
      prev.map((addr, i) => ({
        ...addr,
        esPrincipal: i === index
      }))
    );
  };

  const removeAddress = (index) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
    toast.success('Dirección eliminada');
  };

  const handlePlaceSelected = (place) => {
    setNewAddress((prev) => ({
      ...prev,
      direccion: place.formatted_address,
      detalles: place.name || ''
    }));
    setShowMap(false);
  };

  if (!user) return <div className="loading">Cargando perfil...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Mi Perfil</h1>
          <p className="role-badge">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
        </div>

        {!isEditing ? (
          <div className="profile-view">
            <section className="personal-info">
              <h2>Información Personal</h2>
              <div className="info-item">
                <span className="info-label">Nombre:</span> {user.nombre}
              </div>
              <div className="info-item">
                <span className="info-label">Correo:</span> {user.correo}
              </div>
              <div className="info-item">
                <span className="info-label">Teléfono:</span> {user.telefono || 'No especificado'}
              </div>
            </section>

            <section className="address-section">
              <h2>Direcciones de Envío</h2>
              {addresses.length > 0 ? (
                <div className="address-list">
                  {addresses.map((addr, index) => (
                    <div key={index} className={`address-card ${addr.esPrincipal ? 'primary' : ''}`}>
                      <div className="address-header">
                        <span className="address-alias">{addr.alias}</span>
                        {addr.esPrincipal && <span className="primary-badge">Principal</span>}
                      </div>
                      <p className="address-text">{addr.direccion}</p>
                      {addr.detalles && <p className="address-details">{addr.detalles}</p>}
                      <div className="address-actions">
                        <button onClick={() => togglePrimary(index)} className="action-btn">
                          {addr.esPrincipal ? '★' : '☆'}
                        </button>
                        
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-address">No hay direcciones guardadas</p>
              )}
            </section>

            <button onClick={() => setIsEditing(true)} className="edit-btn">Editar Perfil</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-edit">
            <section className="form-section">
              <h2>Información Personal</h2>
              <div className="form-group">
                <label>Nombre:</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Correo:</label>
                <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Teléfono:</label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} />
              </div>
            </section>

            <section className="form-section">
              <h2>Agregar Dirección</h2>
              <div className="form-group">
                <label>Alias (Ej: Casa, Trabajo):</label>
                <input type="text" name="alias" value={newAddress.alias} onChange={handleAddressChange} />
              </div>
              <div className="form-group">
                <label>Dirección:</label>
                <input type="text" name="direccion" value={newAddress.direccion} onClick={() => setShowMap(true)} readOnly placeholder="Selecciona en el mapa" />
                <button type="button" className="map-btn" onClick={() => setShowMap(true)}>Buscar en Mapa</button>
              </div>

              {showMap && (
                <div className="map-modal">
                  <div className="map-container">
                    <OSMapPicker onLocationSelected={handlePlaceSelected} />
                    <button className="close-map" onClick={() => setShowMap(false)}>Cerrar</button>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Detalles adicionales:</label>
                <input type="text" name="detalles" value={newAddress.detalles} onChange={handleAddressChange} />
              </div>
              <div className="form-group checkbox-group">
                <input type="checkbox" id="esPrincipal" checked={newAddress.esPrincipal} onChange={(e) => setNewAddress((prev) => ({ ...prev, esPrincipal: e.target.checked }))} />
                <label htmlFor="esPrincipal">Establecer como dirección principal</label>
              </div>
              <button type="button" className="add-address-btn" onClick={addAddress}>Agregar Dirección</button>
            </section>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancelar</button>
              <button type="submit" className="save-btn" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
