import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

export default function PrivateRoute({ children, role }) {
  const { user, userData, loading } = useAuth();

  // ⏳ Wait until auth state is fully loaded
  if (loading) return null; // or a loading spinner

  // 🚫 Not authenticated
  if (!user || !userData) {
    return <Navigate to="/" />;
  }

  // ✅ No role restriction
  if (!role) return children;

  // 🔐 Normalize and check role
  const userRole = userData.role?.toLowerCase();
  const allowedRoles = Array.isArray(role)
    ? role.map(r => r.toLowerCase())
    : [role.toLowerCase()];

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
}
