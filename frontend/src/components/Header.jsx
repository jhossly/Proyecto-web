import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';


const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="header">
     
      <div className="header-top">
        <div className="logo">
          <h1>El Golosito 🛒</h1>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Buscar productos...🔎" />
           
        </div>

        <div className="user-actions">
          <button 
            className="login-btn" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Iniciar Sesión
          </button>
          

          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/login" className="dropdown-item">Ingresar</Link>
              <Link to="/register" className="dropdown-item">Crear Cuenta</Link>
              <div className="dropdown-divider"></div>
              <Link to="/admin" className="dropdown-item">Administrador</Link>
            </div>
          )}
        </div>
      </div>
      <nav className="category-nav">    
        <ul>
          <li>Grandes Ofertas</li>
          <li>Higiene</li>
          <li>Ferretería</li>
          <li>Comestibles</li>
          <li>Aguas y bebidas</li>
          <li>Snacks y golosinas</li>
          <li>Frutas y verduras</li>

        </ul>
      </nav>
    </header>
  );
};

export default Header;
