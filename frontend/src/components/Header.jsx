import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSearch, FaShoppingCart, FaTimes } from 'react-icons/fa';
import './Header.css';
import logo from '../assets/logo.png'; 
import CategoryNav from './CategoryNav';

const Header = ({ busqueda, setBusqueda, onSearch }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  
  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Cerrar dropdown de usuario
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      
      // Cerrar búsqueda en móvil
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        
        const searchIcon = document.querySelector('.search-icon-btn');
        if (searchIcon && !searchIcon.contains(event.target)) {
          setShowSearch(false);
        }
      }
      
      // Cerrar menú de categorías
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // Verificamos si el clic fue en el botón del menú
        const menuButton = document.querySelector('.menu-toggle');
        if (menuButton && !menuButton.contains(event.target)) {
          setShowMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(busqueda);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    // Cerramos el menú si está abierto para evitar superposiciones
    if (showMenu) setShowMenu(false);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    // Cerramos la búsqueda si está abierta para evitar superposiciones
    if (showSearch) setShowSearch(false);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo-image" />
            <h1 className="logo-text">El Golosito</h1>
          </Link>
        </div>

        <div className="header-right">
          {/* Icono de búsqueda para mobile */}
          <button 
            className="search-icon-btn mobile-only"
            onClick={toggleSearch}
          >
            <FaSearch />
          </button>

          {/* Búsqueda para mobile (full width) */}
          {showSearch && (
            <div className="mobile-search" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <div className="search-bar">
                  
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    autoFocus
                  />
                  <button 
                    type="button" 
                    className="close-search"
                    onClick={() => setShowSearch(false)}
                  >
                   
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="header-actions">
            <div className="user-container" ref={dropdownRef}>
              <button
                className="user-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FaUser size={20} />
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/login" className="dropdown-item">
                    Ingresar
                  </Link>
                  <Link to="/register" className="dropdown-item">
                    Crear Cuenta
                  </Link>
                  <div className="dropdown-divider"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botón hamburguesa solo en móviles */}
<button 
  className="menu-toggle mobile-only" 
  onClick={toggleMenu}
  ref={menuButtonRef}
>
  <span className="menu-icon">☰</span>
  <span className="menu-text">Categorías</span>
</button>

{/* Sidebar de categorías */}
<div className={`mobile-sidebar ${showMenu ? 'show' : ''}`} ref={menuRef}>
  <div className="sidebar-content">
    <CategoryNav />
    <button 
      className="close-sidebar"
      onClick={() => setShowMenu(false)}
    >
      <FaTimes /> Cerrar
    </button>
  </div>
</div>

{/* Categorías para desktop */}
<div className="category-desktop desktop-only">
  <CategoryNav />
</div>
    </header>
  );
};

export default Header;