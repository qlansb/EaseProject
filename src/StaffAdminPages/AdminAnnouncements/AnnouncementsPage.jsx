// src/StaffPages/Announcements/AdminAnnouncementsPage.jsx
import React, { useEffect, useState } from 'react';
import './AnnouncementsPage.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  getDoc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { useAuth } from '../../Auth/AuthContext';

export default function AdminAnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [homeId, setHomeId] = useState('');
  const [role, setRole] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [expirationDate, setExpirationDate] = useState(null);
  const [expirationTime, setExpirationTime] = useState('17:00');
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({ title: '', body: '' });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [showCalendar, setShowCalendar] = useState(false);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/staff-admin');
  };

  const isStaffAdmin = role === 'staffadmin';

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHomeId(data.homeId);
        setRole(data.role?.toLowerCase());
      }
    };

    if (user) {
      fetchUserData().finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
  if (!homeId) return;

  const q = query(
    collection(db, 'announcements'),
    where('homeId', '==', homeId),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const now = new Date();
    const data = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((doc) => {
        // show only if no expiresAt or not expired yet
        const expires = doc.expiresAt?.toDate?.();
        return !expires || expires >= now;
      });

    setAnnouncements(data);
  });

  return () => unsubscribe();
}, [homeId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    if (!homeId || !user?.uid) {
      setStatus({ message: "Missing user or home ID.", type: "error" });
      return;
    }

    const expiresAt = expirationDate
      ? (() => {
          const [hour, minute] = expirationTime.split(':').map(Number);
          return new Date(
            expirationDate.getFullYear(),
            expirationDate.getMonth(),
            expirationDate.getDate(),
            hour,
            minute,
            0
          );
        })()
      : new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours default

    try {
      await addDoc(collection(db, 'announcements'), {
        title,
        body,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expiresAt),
        homeId,
        uid: user.uid,
      });

      setTitle('');
      setBody('');
      setExpirationDate(null);
      setExpirationTime('17:00');
      setStatus({ message: "Announcement posted!", type: "success" });
    } catch (err) {
      console.error(err);
      setStatus({ message: "Failed to post announcement.", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'announcements', id));
  };

  const handleEdit = async (id) => {
    const original = announcements.find((a) => a.id === id);
    if (
      original.title === editingData.title.trim() &&
      original.body === editingData.body.trim()
    ) {
      setEditingId(null);
      return;
    }

    try {
      await updateDoc(doc(db, 'announcements', id), {
        title: editingData.title,
        body: editingData.body,
      });
      setEditingId(null);
      setEditingData({ title: '', body: '' });
    } catch (err) {
      console.error(err);
      setStatus({ message: "Failed to update announcement.", type: "error" });
    }
  };

  return (
    <div className="announcements-page">
      <button className="back-button" onClick={handleBack}>← Back to Dashboard</button>
      <h2>Staff Admin: Announcements</h2>

      {!loading && isStaffAdmin && homeId && (
        <form onSubmit={handleSubmit} className="announcement-form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <div className="calendar-dropdown-wrapper">
            <label>Set Expiration Date:</label>
            <button
              type="button"
              className="dropdown-toggle"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {expirationDate ? expirationDate.toLocaleDateString() : 'Select a date'}
            </button>
            {showCalendar && (
              <DatePicker
                selected={expirationDate}
                onChange={(date) => {
                  setExpirationDate(date);
                  setShowCalendar(false);
                }}
                minDate={new Date()}
                inline
              />
            )}

            <label htmlFor="expiration-time" className="time-label">Time:</label>
            <select
              id="expiration-time"
              value={expirationTime}
              onChange={(e) => setExpirationTime(e.target.value)}
              className="time-select"
            >
              <option value="08:00">8:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="17:00">5:00 PM</option>
              <option value="20:00">8:00 PM</option>
            </select>
          </div>

          <button type="submit">Post</button>

          {status.message && (
            <p style={{ color: status.type === "error" ? "red" : "green" }}>
              {status.message}
            </p>
          )}
        </form>
      )}

      <ul className="announcement-list">
        {announcements.map((a) => (
          <li key={a.id} className="announcement-item">
            {editingId === a.id ? (
              <>
                <input
                  value={editingData.title}
                  onChange={(e) =>
                    setEditingData({ ...editingData, title: e.target.value })
                  }
                />
                <textarea
                  value={editingData.body}
                  onChange={(e) =>
                    setEditingData({ ...editingData, body: e.target.value })
                  }
                />
                <div className="announcement-actions">
                  <button onClick={() => handleEdit(a.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
                <div className="announcement-meta">
                  <small>
                    {a.expiresAt
                      ? `Expires: ${a.expiresAt.toDate().toLocaleDateString()} at ${a.expiresAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : ''}
                  </small>
                </div>
                {isStaffAdmin && (
                  <div className="announcement-actions">
                    <button
                      onClick={() => {
                        setEditingId(a.id);
                        setEditingData({ title: a.title, body: a.body });
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(a.id)}>Delete</button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
