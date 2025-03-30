import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, setToken } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Check if there's a token in localStorage but not in the store
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      setToken(token);
    }
  }, [isAuthenticated, setToken]);

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
