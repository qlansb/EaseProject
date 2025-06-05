import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // ✅ new state for error
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Login form submitted");

  try {
    console.log("Trying login...");
    await login(email.trim(), password);
    console.log("Login succeeded");

    const uid = auth.currentUser.uid;
    console.log("UID:", uid);

    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) throw new Error("User not found in Firestore");

    const { role, homeId } = userSnap.data();
    console.log("User role:", role, "Home ID:", homeId);

    if (!role || !homeId) throw new Error("Missing role or homeId");

    if (['elder', 'staff', 'family'].includes(role)) {
      navigate(`/${role}`);
    } else {
      throw new Error("Invalid role");
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

      {/* ✅ Show error message */}
      {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
    </form>
  );
}
