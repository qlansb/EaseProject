// src/Routes/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

export default function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  // 🔒 Optional: Add role checking here if your AuthContext tracks roles

  return children;
}
