import { createContext, useContext, useState, useEffect } from 'react';
import * as db from './supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth listener
  useEffect(() => {
    db.supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data } = await db.getProfile(session.user.id);
        setProfile(data);
        loadRooms(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setRooms([]);
      }
      setLoading(false);
    });
    db.getSession().then(session => {
      if (!session) setLoading(false);
    });
  }, []);

  const loadRooms = async (userId) => {
    const { data } = await db.getUserRooms(userId);
    if (data) {
      const formatted = data.map(m => ({
        ...m.rooms,
        myRole: m.role,
        myClassId: m.class_id,
        unread: 0,
        messages: [],
        notices: [],
        resources: [],
        members: [],
        attendance: { percent: 0, attended: 0, total: 0, sessions: [] }
      }));
      setRooms(formatted);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next === 'light' ? 'light' : '');
  };

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = (id) => setModal(id);
  const closeModal = () => setModal(null);

  const handleCreateRoom = async (formData) => {
    if (!user) return;
    const icons = { class: '📚', team: '💼', project: '🚀', private: '🔒' };
    const colors = { class: 'rgba(99,102,241,0.18)', team: 'rgba(16,185,129,0.18)', project: 'rgba(139,92,246,0.18)' };
    const { data, error } = await db.createRoom({
      name: formData.name,
      type: formData.type || 'class',
      subject: formData.subject,
      icon: icons[formData.type] || '📚',
      color: colors[formData.type] || 'rgba(99,102,241,0.18)',
    }, user.id);
    if (error) { showToast('Failed to create room: ' + error.message, 'error'); return; }
    const newRoom = { ...data, myRole: 'owner', unread: 0, messages: [], notices: [], members: [], attendance: { percent: 0, attended: 0, total: 0, sessions: [] } };
    setRooms(prev => [newRoom, ...prev]);
    setActiveRoom(newRoom);
    setPage('room');
    showToast('Room created! Share the invite code 🎉');
    closeModal();
  };

  const handleJoinRoom = async (code, classId) => {
    if (!user) return;
    const { data: room, error } = await db.getRoomByCode(code);
    if (error || !room) { showToast('Room not found. Check the code.', 'error'); return; }
    const { error: joinError } = await db.joinRoom(room.id, user.id, classId);
    if (joinError) { showToast('Already in this room or error joining.', 'error'); return; }
    await loadRooms(user.id);
    showToast('Joined Room successfully! 🎉');
    closeModal();
  };

  const selectRoom = async (room) => {
    setActiveRoom(room);
    setPage('room');
    setRooms(prev => prev.map(r => r.id === room.id ? { ...r, unread: 0 } : r));
  };

  const handleSendMessage = async (roomId, text, fileData = null) => {
    if (!user) return;
    await db.sendMessage(roomId, user.id, text, fileData);
  };

  const handlePostNotice = async (roomId, notice) => {
    if (!user) return;
    const { data, error } = await db.postNotice(roomId, user.id, notice);
    if (!error && data) {
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, notices: [data, ...(r.notices || [])] } : r));
      if (activeRoom?.id === roomId) setActiveRoom(prev => ({ ...prev, notices: [data, ...(prev.notices || [])] }));
      showToast('Notice posted 📢');
    }
    closeModal();
  };

  const handleSignOut = async () => {
    await db.signOut();
    setUser(null);
    setProfile(null);
    setRooms([]);
    setPage('dashboard');
    showToast('Signed out successfully');
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      user, profile, loading,
      rooms, setRooms, activeRoom, selectRoom,
      page, setPage,
      toast, showToast,
      modal, openModal, closeModal,
      handleCreateRoom, handleJoinRoom,
      handleSendMessage, handlePostNotice,
      handleSignOut,
      loadRooms,
      supabase: db.supabase,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
