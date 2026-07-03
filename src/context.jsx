import { createContext, useContext, useState } from 'react';
import { rooms as initialRooms, currentUser } from './data';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [rooms, setRooms] = useState(initialRooms);
  const [activeRoom, setActiveRoom] = useState(initialRooms[0]);
  const [page, setPage] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next === 'light' ? 'light' : '');
  };

  const showToast = (msg, type='info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = (id) => setModal(id);
  const closeModal = () => setModal(null);

  const sendMessage = (roomId, text, extra={}) => {
    setRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      const newMsg = {
        id: Date.now(), sender:'You', sid: currentUser.id,
        initials: currentUser.initials, color: currentUser.color,
        text, time:'Just now', me:true, ...extra
      };
      return { ...r, messages:[...r.messages, newMsg], unread:0, lastMsg:`You: ${text||'Sent a file'}`, lastTime:'now' };
    }));
  };

  const addNotice = (roomId, notice) => {
    setRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      const n = { id: Date.now(), ...notice, author:'Dr. S. Mehta', time:'Just now', read:0, total:r.members };
      return { ...r, notices:[n, ...r.notices] };
    }));
    showToast('Notice posted — tracking reads 📢');
  };

  const createRoom = (data) => {
    const icons = { 'class':'📚', 'team':'💼', 'project':'🚀' };
    const colors = { 'class':'rgba(99,102,241,0.18)', 'team':'rgba(16,185,129,0.18)', 'project':'rgba(139,92,246,0.18)' };
    const newRoom = {
      id: 'room-' + Date.now(),
      name: data.name, icon: icons[data.type] || '📚',
      color: colors[data.type] || 'rgba(99,102,241,0.18)',
      type: data.type, subject: data.subject, faculty: currentUser.name,
      members:1, unread:0, lastMsg:'Room created', lastTime:'now',
      code: Math.random().toString(36).substr(2,6).toUpperCase(),
      facultyList:[], studentList:[{ ...currentUser, online:true, you:true }],
      messages:[], notices:[], resources:[],
      attendance:{ percent:0, attended:0, total:0, calendar:[], sessions:[] }
    };
    setRooms(prev => [newRoom, ...prev]);
    setActiveRoom(newRoom);
    setPage('room');
    showToast('Room created! Share the invite code 🎉');
    closeModal();
  };

  const selectRoom = (room) => {
    setActiveRoom(room);
    setPage('room');
    setRooms(prev => prev.map(r => r.id === room.id ? { ...r, unread:0 } : r));
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, rooms, activeRoom, selectRoom,
      page, setPage, toast, showToast, modal, openModal, closeModal,
      sendMessage, addNotice, createRoom, currentUser
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
