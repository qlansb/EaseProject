// src/StaffPages/Calendar/CalendarPage.jsx
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarPage.css';

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
  getDoc,
} from 'firebase/firestore';

import { db } from '../../firebase';
import { useAuth } from '../../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CalendarPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState('');
  const [homeId, setHomeId] = useState('');
  const [role, setRole] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const isStaffRole = role === 'staff' || role === 'staffadmin';

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHomeId(data.homeId);
        setRole(data.role.toLowerCase()); // Normalize role to lowercase
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (!homeId) return;
    const q = query(collection(db, 'events'), where('homeId', '==', homeId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(data);
    });
    return () => unsubscribe();
  }, [homeId]);

  const handleAddEvent = async () => {
    if (!newEvent.trim()) return;

    await addDoc(collection(db, 'events'), {
      title: newEvent,
      date: Timestamp.fromDate(selectedDate),
      homeId,
      createdBy: user.uid,
      createdAt: Timestamp.now(),
    });

    setNewEvent('');
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'events', id));
  };

  const handleEdit = async (id) => {
    await updateDoc(doc(db, 'events', id), {
      title: editingText,
    });
    setEditingEventId(null);
    setEditingText('');
  };

  const selectedDateEvents = events.filter(
    (event) =>
      event.date?.toDate().toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="calendar-page">
      <button className="back-button" onClick={() => navigate('/staff')}>← Back</button>

      <div className="calendar-left">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={({ date }) => {
            const hasEvent = events.some(
              (e) => e.date?.toDate().toDateString() === date.toDateString()
            );
            return hasEvent ? 'event-day' : null;
          }}
        />
      </div>

      <div className="calendar-right">
        <h3>Events on {selectedDate.toDateString()}</h3>

        <ul>
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event) => (
              <li key={event.id} className="event-item">
                {editingEventId === event.id ? (
                  <>
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="event-edit"
                      rows={2}
                    />
                    <div className="event-actions">
                      <button onClick={() => handleEdit(event.id)}>Save</button>
                      <button onClick={() => setEditingEventId(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>{event.title}</span>
                    {isStaffRole && (
                      <div className="event-actions">
                        <button
                          onClick={() => {
                            setEditingEventId(event.id);
                            setEditingText(event.title);
                          }}
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDelete(event.id)}>Delete</button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))
          ) : (
            <li>No events</li>
          )}
        </ul>

        {isStaffRole && (
          <div className="event-form">
            <textarea
              className="event-textarea"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              placeholder="New event"
              rows={2}
            />
            <button onClick={handleAddEvent}>Add</button>
          </div>
        )}
      </div>
    </div>
  );
}
