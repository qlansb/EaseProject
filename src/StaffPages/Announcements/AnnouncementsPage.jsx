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
  getDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
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

  // Get user's homeId and role
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

  // Load announcements from last 48 hours
  useEffect(() => {
    if (!homeId) return;

    const now = Date.now();
    const cutoff = Timestamp.fromMillis(now - 48 * 60 * 60 * 1000);

    const q = query(
      collection(db, 'announcements'),
      where('homeId', '==', homeId),
      orderBy('createdAt', 'desc'), // MUST orderBy before where on same field
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

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'announcements', id));
  };

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
      <h2>Announcements</h2>

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
                <button onClick={() => handleEdit(a.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
                <small>{a.createdAt?.toDate().toLocaleString()}</small>
                {role === 'staff' && (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(a.id);
                        setEditingData({ title: a.title, body: a.body });
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(a.id)}>Delete</button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
