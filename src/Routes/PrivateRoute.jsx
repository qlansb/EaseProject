// src/routes/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

export default function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user || user.role !== role) return <Navigate to="/" />;
  return children;
}
