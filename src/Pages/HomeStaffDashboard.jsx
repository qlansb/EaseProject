// src/Pages/HomeStaffDashboard.jsx
import './HomeStaffDashboard.css';
import { FaBullhorn, FaCalendarAlt, FaVideo, FaCommentDots } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function HomeStaffDashboard() {
  const navigate = useNavigate();

  const tiles = [
    { icon: <FaBullhorn />, label: 'Announcements', path: '/staff/announcements' },
    { icon: <FaCalendarAlt />, label: 'Calendar', path: '/staff/calendar' },
    { icon: <FaVideo />, label: 'Videos', path: '/staff/videos' },
    { icon: <FaCommentDots />, label: 'Contact', path: '/staff/Contact' }
  ];

  return (
    <div className="staff-container">
      <h2 className="staff-title">Welcome, Staff</h2>
      <div className="staff-grid">
        {tiles.map(({ icon, label, path }) => (
          <div key={label} className="staff-card" onClick={() => navigate(path)}>
            <div className="staff-icon">{icon}</div>
            <div>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
