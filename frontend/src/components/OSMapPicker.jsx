// File: frontend/src/components/OSMapPicker.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuración de iconos (imports modernos)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Solucionar problema con los iconos
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

// Componente para manejar los clicks en el mapa
const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click: onClick,
  });
  return null;
};


const OSMapPicker = ({ onLocationSelected }) => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');

  // Posición inicial (CDMX)
  const defaultPosition = { lat: 19.4326, lng: -99.1332 };

  // Convertir coordenadas a dirección (geocodificación inversa simple)
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      if (data.address) {
        const { road, house_number, suburb, city, country } = data.address;
        return `${road || ''} ${house_number || ''}, ${suburb || ''}, ${city || ''}, ${country || ''}`.trim();
      }
      return `Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error("Error al obtener dirección:", error);
      return `Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  // Manejar selección de ubicación
  const handleMapClick = async (e) => {
    const clickedPosition = e.latlng;
    setPosition(clickedPosition);
    
    // Obtener dirección aproximada
    const addressText = await getAddressFromCoords(clickedPosition.lat, clickedPosition.lng);
    setAddress(addressText);
  };

  // Confirmar la ubicación seleccionada
  const handleConfirm = () => {
    if (position) {
      onLocationSelected({
        formatted_address: address || 'Ubicación seleccionada',
        name: address,
        geometry: {
          location: {
            lat: () => position.lat,
            lng: () => position.lng
          }
        }
      });
    } else {
      alert('Por favor selecciona una ubicación en el mapa');
    }
  };

  return (
    <div style={{ 
      height: '500px', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden' }}>
        <MapContainer
          center={position || defaultPosition}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onClick={handleMapClick} />

          {position && (
            <Marker position={position}>
              <Popup>Ubicación seleccionada</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Dirección seleccionada:
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Haz clic en el mapa para seleccionar una ubicación"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            {position && (
              <span>
                Coordenadas: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleConfirm}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Confirmar Ubicación
          </button>
        </div>
      </div>
    </div>
  );
};

export default OSMapPicker;