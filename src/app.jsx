// src/App.jsx
import { Routes, Route } from "react-router-dom";

// Pages
import LoginForm from "./Components/LoginForm";
import ElderDashboard from "./Pages/ElderDashboard";
import HomeStaffDashboard from "./Pages/HomeStaffDashboard";
import FamilyDashboard from "./Pages/FamilyDashboard";

// Staff Feature Pages (✅ fixed folder name)
import AnnouncementsPage from "./StaffPages/Announcements/AnnouncementsPage";
import CalendarPage from "./StaffPages/Calendar/Calendar";
import VideosPage from "./StaffPages/Videos/Videos";
import FeedbackPage from "./StaffPages/Feedback/Feedback";

// Route protection
import PrivateRoute from "./Routes/PrivateRoute";

export default function App() {
  return (
    <Routes>
      {/* Public Login Page */}
      <Route path="/" element={<LoginForm />} />

      {/* Role-Specific Dashboards */}
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

      {/* Staff Feature Subroutes */}
      <Route
        path="/staff/Announcements"
        element={
          <PrivateRoute role="staff">
            <AnnouncementsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/staff/Calendar"
        element={
          <PrivateRoute role="staff">
            <CalendarPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/staff/Videos"
        element={
          <PrivateRoute role="staff">
            <VideosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/staff/Feedback"
        element={
          <PrivateRoute role="staff">
            <FeedbackPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
