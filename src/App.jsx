import { useState } from 'react';
import { AppProvider, useApp } from './context';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Modal from './components/Modal';
import Dashboard from './pages/Dashboard';
import RoomsPage from './pages/RoomsPage';
import AttendanceOverview from './pages/AttendanceOverview';
import AllNotices from './pages/AllNotices';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';

function AppShell() {
  const { page } = useApp();
  const pages = {
    dashboard: <Dashboard />,
    rooms: <RoomsPage />,
    room: <RoomsPage />,
    'attendance-overview': <AttendanceOverview />,
    'notices-all': <AllNotices />,
    settings: <Settings />,
  };
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {pages[page] || <Dashboard />}
      </div>
      <Toast />
      <Modal />
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  if (!authed) return (
    <AppProvider>
      <Onboarding onComplete={() => setAuthed(true)} />
      <Toast />
    </AppProvider>
  );
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
