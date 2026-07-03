import { useApp } from '../context';

export default function AllNotices() {
  const { rooms, selectRoom } = useApp();
  const allNotices = rooms.flatMap(r => r.notices.map(n=>({...n, roomName:r.name, room:r})));

  return (
    <div style={{flex:1,overflowY:'auto',padding:'28px 32px',animation:'fadeUp .28s ease'}}>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:24,fontWeight:800,letterSpacing:'-.8px',marginBottom:4}}>All Notices</h1>
        <p style={{fontSize:13,color:'var(--text2)'}}>Notices from all your Rooms in one place.</p>
      </div>
      {allNotices.length===0 && (
        <div style={{textAlign:'center',padding:'60px 20px'}}>
          <div style={{fontSize:40,marginBottom:12}}>🔔</div>
          <div style={{fontSize:14,fontWeight:600,marginBottom:6}}>No notices yet</div>
          <div style={{fontSize:12,color:'var(--text3)'}}>Notices from your Rooms will appear here.</div>
        </div>
      )}
      {allNotices.map((n,i)=>(
        <div key={i} onClick={()=>selectRoom(n.room)} style={{
          background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:13,
          padding:16,marginBottom:12,cursor:'pointer',transition:'border-color .15s'
        }}
        onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border2)'}
        onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
          <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:10}}>
            <span style={{fontSize:20}}>{n.priority==='high'?'📌':'📋'}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,letterSpacing:'-.2px',marginBottom:3}}>{n.title}</div>
              <div style={{fontSize:11,color:'var(--text3)'}}>{n.roomName} · {n.author} · {n.time}</div>
            </div>
            <span style={{fontSize:10,fontWeight:500,padding:'3px 8px',borderRadius:20,background:n.priority==='high'?'var(--reds)':'var(--ps)',color:n.priority==='high'?'var(--red)':'var(--p)'}}>{n.priority}</span>
          </div>
          <div style={{fontSize:13,color:'var(--text2)',lineHeight:1.6,marginBottom:10}}>{n.body}</div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{fontSize:11,color:'var(--text3)'}}>👁️ {n.read} of {n.total} read</div>
            <div style={{fontSize:11,color:n.read===n.total?'var(--green)':'var(--amber)'}}>{n.read===n.total?'✓ All read':`${n.total-n.read} haven't read — send reminder`}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
