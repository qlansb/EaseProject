import React, { useEffect, useState } from 'react';
import './AnnouncementsPage.css';
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
  serverTimestamp
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { useAuth } from '../../Auth/AuthContext';

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [homeId, setHomeId] = useState('');
  const [role, setRole] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({ title: '', body: '' });

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/staff');
  };

  // Fetch user's homeId and role
  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHomeId(data.homeId);
        setRole(data.role);
      }
    };

    if (user) fetchUserData();
  }, [user]);

  // Load real-time announcements from the last 48 hours
  useEffect(() => {
    if (!homeId) return;

    const now = Timestamp.now();
    const cutoff = Timestamp.fromMillis(now.toMillis() - 48 * 60 * 60 * 1000);

    const q = query(
      collection(db, 'announcements'),
      where('homeId', '==', homeId),
      orderBy('createdAt', 'desc'),
      where('createdAt', '>=', cutoff)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(data);
    });

    return () => unsubscribe();
  }, [homeId]);

  // Create new announcement
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    await addDoc(collection(db, 'announcements'), {
      title,
      body,
      createdAt: serverTimestamp(),
      homeId,
      uid: user.uid,
    });

    setTitle('');
    setBody('');
  };

  // Delete
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'announcements', id));
  };

  // Save edit
  const handleEdit = async (id) => {
    await updateDoc(doc(db, 'announcements', id), {
      title: editingData.title,
      body: editingData.body,
    });
    setEditingId(null);
    setEditingData({ title: '', body: '' });
  };

  return (
    <div className="announcements-page">
      {/* Back Button */}
      <button className="back-button" onClick={handleBack}>← Back</button>

      <h2>Announcements</h2>

      {/* Staff-only form */}
      {role === 'staff' && (
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
          <button type="submit">Post</button>
        </form>
      )}

      {/* Announcement list */}
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
                  <small>{a.createdAt ? a.createdAt.toDate().toLocaleString() : '...'}</small>
                </div>
                {role === 'staff' && (
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
