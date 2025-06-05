// src/components/LoginForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext'; // ✅ check correct case
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email.trim(), password);

      const uid = auth.currentUser.uid;
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User record not found in Firestore');
      }

      const role = userSnap.data().role;
      if (!role) throw new Error('No role defined for this user');

      // ✅ Redirect based on role
      if (['elder', 'staff', 'admin'].includes(role)) {
        navigate(`/${role}`);
      } else {
        throw new Error('Invalid role');
      }

    } catch (err) {
      alert(`Login failed: ${err.message}`);
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
    </form>
  );
}
