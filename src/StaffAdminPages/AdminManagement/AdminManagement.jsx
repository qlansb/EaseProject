// src/StaffAdminPages/AdminManagement/AdminManagement.jsx
import React, { useEffect, useState } from 'react';
import './AdminManagement.css';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminManagement() {
  const { user } = useAuth();
  const [homeId, setHomeId] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeIdAndUsers = async () => {
      try {
        const currentUserRef = doc(db, 'users', user.uid);
        const currentUserSnap = await getDoc(currentUserRef);

        if (currentUserSnap.exists()) {
          const currentUserData = currentUserSnap.data();
          const fetchedHomeId = currentUserData.homeId;
          setHomeId(fetchedHomeId);

          const usersRef = collection(db, 'users');
          const q = query(
            usersRef,
            where('homeId', '==', fetchedHomeId),
            where('role', 'in', ['staff', 'enhanced'])
          );
          const snapshot = await getDocs(q);
          const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUsers(userList);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchHomeIdAndUsers();
    }
  }, [user]);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div className="admin-management-page">
      <button className="back-button" onClick={() => navigate('/staff-admin')}>← Back to Dashboard</button>
      <h2>Manage Staff and Enhanced Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="user-list">
          {users.map((u) => (
            <li key={u.id} className="user-item">
              <span>{u.email} ({u.role})</span>
              <button onClick={() => handleDelete(u.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
