
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaAppleAlt, FaGlassWhiskey, FaCookieBite, FaCheese, FaWineBottle, FaUser } from "react-icons/fa";
import './Header.css';

const Header = ({busqueda, setBusqueda}) => {
  const [showDropdown, setShowDropdown] = useState(false);
   
  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <h1>El Golosito 🛒</h1>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Buscar productos...🔎" 
          value={busqueda}
          onChange={(e)=> setBusqueda(e.target.value)}/>
        </div>
        <div className="user-actions">
          <button className="login-btn" onClick={() => setShowDropdown(!showDropdown)}>
            <FaUser size={24} title="Iniciar Sesión" />
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/login" className="dropdown-item">Ingresar</Link>
              <Link to="/register" className="dropdown-item">Crear Cuenta</Link>
              <div className="dropdown-divider"></div>
              <Link to="/login" className="dropdown-item">Administrador</Link>
            </div>
          )}
        </div>
      </div>
      <nav className="category-nav">
        <ul>
          <li><Link to="/categorias/Fruta"><FaAppleAlt size={24} title="Fruta" /></Link></li>
          <li><Link to="/categorias/Bebidas"><FaGlassWhiskey size={24} title="Bebidas gaseosas" /></Link></li>
          <li><Link to="/categorias/Snacks"><FaCookieBite size={24} title="Snacks" /></Link></li>
          <li><Link to="/categorias/comestibles"><FaCheese size={24} title="Comestibles" /></Link></li>
          <li><Link to="/categorias/Licores"><FaWineBottle size={24} title="Licores" /></Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
