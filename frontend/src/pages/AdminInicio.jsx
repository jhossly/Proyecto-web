import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaBox,
  FaUsers,
  FaDollarSign,
  FaWarehouse,
  FaChartBar,
  FaFileAlt
} from 'react-icons/fa';
import './AdminInicio.css';

const AdminInicio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const isInMainAdmin = location.pathname === '/adminInicio';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const MenuButton = ({ icon, text, path }) => (
    <button 
      onClick={() => {
        navigate(path);
        if (isMobile) setIsSidebarOpen(false);
      }} 
      className="menu-button"
    >
      <span className="menu-icon">{icon}</span>
      <span className="menu-text">{text}</span>
    </button>
  );

  return (
    <div className="admin-layout">
      {/* Botón de menú hamburguesa */}
      <button 
        className={`mobile-menu-toggle ${isMobile ? '' : 'hidden'}`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Panel lateral */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <FaSignOutAlt className="logout-icon" />
          </button>
        </div>

        <div className="menu-section">
          <h3>Gestión de Productos</h3>
          <MenuButton icon={<FaBox />} text="Productos" path="AdminPanel" />
          <MenuButton icon={<FaUsers />} text="Usuarios" path="Usuarios" />
          <MenuButton icon={<FaDollarSign />} text="Ventas" path="Ventas" />
          <MenuButton icon={<FaWarehouse />} text="Inventario" path="Inventario" />
        </div>
        
        <div className="menu-section">
          <h3>Reportes</h3>
          <MenuButton icon={<FaChartBar />} text="Estadísticas" path="Estadisticas" />
          <MenuButton icon={<FaFileAlt />} text="Reporte de Ventas" path="Reporte" />
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="admin-main">
        <header className="admin-header">
          
        </header>

        <section className="admin-content">
  {isInMainAdmin ? (
    <div className="admin-welcome">
      <p>Selecciona una opción del menú para comenzar.</p>
    </div>
  ) : (
    <Outlet /> 
  )}
</section>
      </div>
    </div>
  );
};

export default AdminInicio;