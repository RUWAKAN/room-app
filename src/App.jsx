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

function LoadingScreen() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: 'var(--bg)' }}>
      <div style={{ width: 48, height: 48, borderRadius: 13, background: 'var(--pg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-5l-4 3v-3H6a3 3 0 0 1-3-3V6z" /></svg>
      </div>
      <div style={{ fontSize: 14, color: 'var(--text2)' }}>Loading Room...</div>
    </div>
  );
}

function AppShell() {
  const { page, user, loading } = useApp();
  if (loading) return <LoadingScreen />;
  if (!user) return <Onboarding />;

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
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
