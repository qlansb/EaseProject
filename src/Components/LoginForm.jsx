import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      // 🔐 Attempt Firebase Auth login
      await login(email.trim(), password);

      const uid = auth.currentUser.uid;
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User not found in Firestore.");
      }

      const { role, homeId } = userSnap.data();

      // ✅ Normalize role to lowercase
      const normalizedRole = role?.toLowerCase();
      const allowedRoles = ['enhanced', 'regular', 'staff', 'staffadmin'];

      // ✅ Validate and route user by role
      if (!normalizedRole || !allowedRoles.includes(normalizedRole)) {
        throw new Error("Invalid or missing role.");
      }

      if (!homeId) {
        throw new Error("Missing home ID.");
      }

      if (normalizedRole === 'staffadmin') {
        navigate('/staff-admin');
      } else {
        navigate(`/${normalizedRole}`);
      }

    } catch (err) {
      console.error("Login error:", err.message);
      setErrorMessage("Login failed: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>

      {errorMessage && (
        <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
      )}
    </form>
  );
}
