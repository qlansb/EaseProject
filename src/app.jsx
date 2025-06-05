import { Routes, Route } from "react-router-dom";
import LoginForm from "./Components/LoginForm";
import ElderDashboard from "./Pages/ElderDashboard";
import HomeStaffDashboard from "./Pages/HomeStaffDashboard";
import FamilyDashboard from "./Pages/FamilyDashboard";
import PrivateRoute from "./Routes/PrivateRoute";

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<LoginForm />} />

      {/* Role-based routes */}
      <Route
        path="/elder"
        element={
          <PrivateRoute role="elder">
            <ElderDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <PrivateRoute role="staff">
            <HomeStaffDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/family"
        element={
          <PrivateRoute role="family">
            <FamilyDashboard />
          </PrivateRoute>
        }
      />

      {/* 🆕 Staff Subpages */}
      <Route
        path="/staff/announcements"
        element={
          <PrivateRoute role="staff">
            <h2>Announcements Page</h2>
          </PrivateRoute>
        }
      />
      <Route
        path="/staff/calendar"
        element={
          <PrivateRoute role="staff">
            <h2>Calendar Page</h2>
          </PrivateRoute>
        }
      />
      <Route
        path="/staff/videos"
        element={
          <PrivateRoute role="staff">
            <h2>Videos Page</h2>
          </PrivateRoute>
        }
      />
      <Route
        path="/staff/feedback"
        element={
          <PrivateRoute role="staff">
            <h2>Feedback Page</h2>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
