// src/StaffAdminPages/AdminDashboard/StaffAdminDashboard.jsx
import '../AdminDashboard/StaffAdminDashboard.css';
import { FaBullhorn, FaCalendarAlt, FaVideo, FaCommentDots, FaUserPlus, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function StaffAdminDashboard() {
  const navigate = useNavigate();

  // Define all dashboard tiles with icons and labels
  const tiles = [
  { icon: <FaBullhorn />, label: 'Announcements', path: '/staff/announcements' },
  { icon: <FaCalendarAlt />, label: 'Calendar', path: '/staff/calendar' },
  { icon: <FaVideo />, label: 'Videos', path: '/staff/videos' },
  { icon: <FaCommentDots />, label: 'Contact', path: '/staff/contact' },
  { icon: <FaUserPlus />, label: 'Create User', path: '/staff-admin/create-user' },
  { icon: <FaUsers />, label: 'Manage Users', path: '/staff-admin/manage-users' }, // ✅ NEW
];

  return (
    <div className="staff-container">
      <h2 className="staff-title">Welcome, Staff Admin</h2>

      <div className="staff-grid">
        {tiles.map(({ icon, label, path }) => (
          <div
            key={label}
            className="staff-card"
            onClick={() => navigate(path)}
          >
            <div className="staff-icon">{icon}</div>
            <div>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
