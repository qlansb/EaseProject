import { Routes, Route } from "react-router-dom";

// 🔓 Public
import LoginForm from "./Components/LoginForm";

// 🏠 Dashboards
import EnhanceDashboard from "./Pages/EnhanceDashboard";
import RegularDashboard from "./Pages/RegularDashboard";
import StaffDashboard from "./Pages/StaffDashboard";
import StaffAdminDashboard from "./StaffAdminPages/AdminDashboard/StaffAdminDashboard";

// 🔒 Route protection
import PrivateRoute from "./Routes/PrivateRoute";

// 👥 Staff-Only Pages
import AnnouncementsPage from "./StaffPages/Announcements/AnnouncementsPage";
import CalendarPage from "./StaffPages/Calendar/Calendar";
import VideosPage from "./StaffPages/Videos/Videos";
import ContactPage from "./StaffPages/Contact/Contact";

// 👑 Staff Admin Pages
import AdminAnnouncementsPage from "./StaffAdminPages/AdminAnnouncements/AnnouncementsPage";
import AdminCalendarPage from "./StaffAdminPages/AdminCalendar/CalendarPage";
import AdminVideosPage from "./StaffAdminPages/AdminVideo/VideosPage";
import AdminContactPage from "./StaffAdminPages/AdminContact/ContactPage";
import CreateUser from "./StaffAdminPages/CreateUser/CreateUser";
import AdminManagement from "./StaffAdminPages/AdminManagement/AdminManagement";

export default function App() {
  return (
    <Routes>
      {/* 🔓 Public Login */}
      <Route path="/" element={<LoginForm />} />

      {/* 🏠 Dashboards */}
      <Route
  path="/enhanced"
  element={
    <PrivateRoute role="enhanced">
      <EnhanceDashboard />
    </PrivateRoute>
  }
/>
      <Route
        path="/regular"
        element={
          <PrivateRoute role="regular">
            <RegularDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <PrivateRoute role="staff">
            <StaffDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/staff-admin"
        element={
          <PrivateRoute role="staffadmin">
            <StaffAdminDashboard />
          </PrivateRoute>
        }
      />

      {/* 👥 Staff Pages */}
      <Route
        path="/staff/announcements"
        element={
          <PrivateRoute role="staff">
            <AnnouncementsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/staff/calendar"
        element={
          <PrivateRoute role="staff">
            <CalendarPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/staff/videos"
        element={
          <PrivateRoute role="staff">
            <VideosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/staff/contact"
        element={
          <PrivateRoute role="staff">
            <ContactPage />
          </PrivateRoute>
        }
      />

      {/* 👑 Staff Admin Pages */}
      <Route
        path="/staff-admin/announcements"
        element={
          <PrivateRoute role="staffadmin">
            <AdminAnnouncementsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/staff-admin/calendar"
        element={
          <PrivateRoute role="staffadmin">
            <AdminCalendarPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/staff-admin/create-user"
        element={
          <PrivateRoute role="staffadmin">
            <CreateUser />
          </PrivateRoute>
        }
      />
      <Route
        path="/staff-admin/videos"
        element={
          <PrivateRoute role="staffadmin">
            <AdminVideosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/staff-admin/contact"
        element={
          <PrivateRoute role="staffadmin">
            <AdminContactPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/staff-admin/manage-users"
        element={
          <PrivateRoute role="staffadmin">
            <AdminManagement />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
