import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';
import './HeaderUser.css';
import CategoryNav from './CategoryNav';
import { FaSearch, FaUser, FaShoppingBag, FaSignOutAlt, FaTimes } from 'react-icons/fa';

const Header = ({ busqueda, setBusqueda }) => {
  const { cartItems, setIsCartOpen } = useContext(CartContext);
  const { user, setUser } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Estado para el menú móvil
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Función para alternar el menú móvil
  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (showSearch) setShowSearch(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Para el dropdown de usuario
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (profileRef.current && !profileRef.current.contains(event.target)) {
          setShowDropdown(false);
        }
      }
      
      // Para el menú móvil
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        const menuButton = document.querySelector('.menu-toggle');
        if (menuButton && !menuButton.contains(event.target)) {
          setShowMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="app-header">
      <div className="header-main">
        <div className="header-left">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-image" />
            <Link to="/" className="logo-text">El Golosito</Link>
          </div>
        </div>

        <div className="header-right">
          {showSearch ? (
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                autoFocus
              />
              <button 
                className="search-close"
                onClick={() => setShowSearch(false)}
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <button 
              className="search-icon-btn"
              onClick={() => setShowSearch(true)}
            >
              <FaSearch />
            </button>
          )}

          <button 
            className="cart-icon" 
            onClick={() => setIsCartOpen(true)}
          >
            <FaShoppingBag />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>

          {user ? (
            <div className="user-profile-container" ref={profileRef}>
              <button
                className="user-profile"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="user-avatar">{user.nombre?.charAt(0)}</span>
                <span className="user-name">{user.nombre}</span>
              </button>

              {showDropdown && (
                <div className="dropdown-menu" ref={dropdownRef}>
                  <button 
                    className="dropdown-item" 
                    onClick={() => navigate('/profile')}
                  >
                    <FaUser className="dropdown-icon" />
                    <span>Mi perfil</span>
                  </button>
                  <button 
                    className="dropdown-item" 
                    onClick={() => navigate('/Mis-compras')}
                  >
                    <FaShoppingBag className="dropdown-icon" />
                    <span>Mis compras</span>
                  </button>
                  <button 
                    className="dropdown-item logout" 
                    onClick={logout}
                  >
                    <FaSignOutAlt className="dropdown-icon" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="login-btn" 
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>

      {/* Menú móvil */}
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