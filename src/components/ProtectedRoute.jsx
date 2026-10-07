import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isAuthenticated, authChecking } = useSelector(
    (state) => state.auth
  );

  // Browser refresh par pehle authentication check complete hone do
  if (authChecking) {
    return null;
  }

  // Auth check complete hone ke baad hi login par bhejo
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;