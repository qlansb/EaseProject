// src/StaffAdminPages/CreateUser/CreateUser.jsx
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./CreateUser.css";

export default function CreateUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [adminHomeId, setAdminHomeId] = useState("");

  // 🔍 Step 1: Fetch current admin's homeId when component mounts
  useEffect(() => {
    const fetchHomeId = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const { homeId } = userSnap.data();
        setAdminHomeId(homeId);
      }
    };

    fetchHomeId();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });

    try {
      // ✅ Create new Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const newUser = userCredential.user;

      // ✅ Save user to Firestore with same homeId as admin + capitalized role
      await setDoc(doc(db, "users", newUser.uid), {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: "enhanced", // ✅ Capitalized role
        homeId: adminHomeId || "default-home" // ✅ Pull from admin if available
      });

      setStatus({ message: "User created successfully!", type: "success" });
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
    } catch (err) {
      console.error("Error creating user:", err);
      setStatus({ message: `Error: ${err.message}`, type: "error" });
    }
  };

  return (
    <div className="create-user-container">
      <h2>Create Enhanced User</h2>

      <form onSubmit={handleCreate} className="create-user-form">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Temporary Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit">Create User</button>
      </form>

      {/* Success/Error message */}
      {status.message && (
        <p
          className="create-user-message"
          style={{ color: status.type === "error" ? "red" : "green" }}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
