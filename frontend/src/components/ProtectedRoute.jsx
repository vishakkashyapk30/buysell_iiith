import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { 
        replace: true,
        state: { from: location.pathname } 
      });
    }
  }, [loading, user, navigate, location]);

  return loading ? <div>Loading...</div> : user ? children : null;
};

export default ProtectedRoute;