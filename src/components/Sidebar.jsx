import { useApp } from '../context';

const NAV = [
  { id:'dashboard', icon:'🏠', label:'Home' },
  { id:'rooms', icon:'💬', label:'My Rooms' },
  { id:'attendance-overview', icon:'📊', label:'Attendance' },
  { id:'notices-all', icon:'🔔', label:'All Notices' },
];

export default function Sidebar() {
  const { page, setPage, openModal, toggleTheme, theme, rooms, currentUser } = useApp();
  const totalUnread = rooms.reduce((a, r) => a + (r.unread||0), 0);
  const isRoomPage = page === 'room';

  return (
    <aside style={{
      width:68, background:'var(--bg2)', borderRight:'1px solid var(--border)',
      display:'flex', flexDirection:'column', alignItems:'center',
      padding:'14px 0', gap:4, flexShrink:0, zIndex:10
    }}>
      <div style={{
        width:40, height:40, borderRadius:11, background:'var(--pg)',
        display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', flexShrink:0, marginBottom:12,
        boxShadow:'0 4px 16px rgba(99,102,241,0.4)'
      }} onClick={() => setPage('dashboard')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-5l-4 3v-3H6a3 3 0 0 1-3-3V6z"/>
        </svg>
      </div>
      {NAV.map(n => (
        <SbBtn key={n.id} icon={n.icon} label={n.label}
          active={page===n.id || (n.id==='rooms' && isRoomPage)}
          badge={n.id==='rooms' && totalUnread>0 ? totalUnread : null}
          onClick={() => setPage(n.id)} />
      ))}
      <div style={{width:32, height:1, background:'var(--border)', margin:'6px 0'}}/>
      <SbBtn icon="➕" label="Create Room" onClick={() => openModal('create-room')} />
      <div style={{flex:1}}/>
      <SbBtn icon={theme==='dark'?'☀️':'🌙'} label="Toggle theme" onClick={toggleTheme} />
      <SbBtn icon="⚙️" label="Settings" active={page==='settings'} onClick={() => setPage('settings')} />
      <div style={{
        width:36, height:36, borderRadius:'50%', background:'var(--pg)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:13, fontWeight:700, color:'#fff', cursor:'pointer',
        marginTop:8, flexShrink:0, border:'2px solid var(--border3)'
      }} onClick={() => setPage('settings')} title={currentUser.name}>
        {currentUser.initials}
      </div>
    </aside>
  );
}

function SbBtn({ icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick} title={label} style={{
      width:44, height:44, borderRadius:11, border:'none', flexShrink:0,
      background: active ? 'var(--ps)' : 'transparent',
      color: active ? 'var(--p)' : 'var(--text2)',
      cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:18, transition:'all .15s', position:'relative',
      fontFamily: 'inherit'
    }}
    onMouseEnter={e => { if(!active){e.currentTarget.style.background='var(--bg3)';e.currentTarget.style.color='var(--text)';}}}
    onMouseLeave={e => { if(!active){e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--text2)';}}}
    >
      {icon}
      {badge && <span style={{
        position:'absolute', top:6, right:6, background:'var(--red)',
        color:'#fff', fontSize:9, fontWeight:700, padding:'1px 4px',
        borderRadius:8, minWidth:14, textAlign:'center', lineHeight:'14px'
      }}>{badge}</span>}
    </button>
  );
}
