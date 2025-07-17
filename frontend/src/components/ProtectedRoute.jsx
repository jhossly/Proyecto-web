import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  let user = null;
  const token = localStorage.getItem('token');

  try {
    const datosGuardados = localStorage.getItem('user'); 
    if (datosGuardados) {
      user = JSON.parse(datosGuardados);
    }
  } catch (error) {
    console.error('Error al leer el usuario:', error);
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
