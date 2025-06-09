// src/StaffPages/Contact/ContactPage.jsx
import React, { useState, useEffect } from 'react';
import './Contact.css';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../Auth/AuthContext';

export default function ContactPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [homeId, setHomeId] = useState('');
  const [receiverId, setReceiverId] = useState(''); // Should be set dynamically

  // Fetch user's homeId
  useEffect(() => {
    if (!user) return;

    const fetchUserInfo = async () => {
      const userSnapshot = await onSnapshot(
        query(collection(db, 'users'), where('uid', '==', user.uid)),
        (snap) => {
          snap.forEach((doc) => {
            setHomeId(doc.data().homeId);
            // Optionally assign receiverId based on your logic
          });
        }
      );
    };

    fetchUserInfo();
  }, [user]);

  // Listen to messages for this user
  useEffect(() => {
    if (!homeId || !receiverId) return;

    const q = query(
      collection(db, 'messages'),
      where('homeId', '==', homeId),
      where('senderId', 'in', [user.uid, receiverId]),
      where('receiverId', 'in', [user.uid, receiverId]),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [homeId, receiverId, user.uid]);

  // Handle sending message
  const handleSend = async () => {
    if (!messageText.trim()) return;

    await addDoc(collection(db, 'messages'), {
      senderId: user.uid,
      receiverId,
      homeId,
      text: messageText,
      timestamp: Timestamp.now(),
    });

    setMessageText('');
  };

  return (
    <div className="contact-page">
      <h2>Secure Messaging</h2>

      <div className="message-box">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.senderId === user.uid ? 'my-message' : 'their-message'}
          >
            <p>{msg.text}</p>
            <small>{msg.timestamp?.toDate().toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <div className="message-input">
        <textarea
          rows="2"
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
