// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./Components/LoginForm";
import ElderDashboard from "./Pages/ElderDashboard";
import HomeStaffDashboard from "./Pages/HomeStaffDashboard";
import FamilyDashboard from "./Pages/FamilyDashboard";
import PrivateRoute from "./Routes/PrivateRoute";
import { useAuth } from "./Auth/AuthContext";

export default function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/elder" element={<PrivateRoute role="elder"><ElderDashboard /></PrivateRoute>} />
        <Route path="/staff" element={<PrivateRoute role="staff"><HomeStaffDashboard /></PrivateRoute>} />
        <Route path="/family" element={<PrivateRoute role="family"><FamilyDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}
