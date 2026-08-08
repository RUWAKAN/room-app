import { useApp } from '../context';

export default function Dashboard() {
  const { rooms, selectRoom, profile, openModal } = useApp();
  const totalUnread = rooms.reduce((a,r)=>a+(r.unread||0),0);

  return (
    <div style={{flex:1,overflowY:'auto',padding:'28px 32px',animation:'fadeUp .28s ease'}}>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:26,fontWeight:800,letterSpacing:'-.8px',marginBottom:4}}>
          Good morning, {profile?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p style={{fontSize:13,color:'var(--text2)'}}>
          {totalUnread > 0 ? `You have ${totalUnread} unread message${totalUnread>1?'s':''}.` : rooms.length > 0 ? 'All caught up across your Rooms.' : 'Welcome to Room! Create or join a Room to get started.'}
        </p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:28}}>
        {[
          {n:rooms.length, l:'Active Rooms', color:'var(--text)'},
          {n:`${rooms.reduce((a,r)=>a+(r.attendance?.percent||0),0)/Math.max(rooms.length,1)|0}%`, l:'Avg attendance', color:'var(--green)'},
          {n:rooms.reduce((a,r)=>a+(r.notices?.length||0),0), l:'Total notices', color:'var(--text)'},
          {n:totalUnread, l:'Unread messages', color:totalUnread>0?'var(--red)':'var(--green)'},
        ].map((s,i)=>(
          <div key={i} style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:14,padding:16}}>
            <div style={{fontSize:28,fontWeight:800,letterSpacing:'-1px',color:s.color,marginBottom:4}}>{s.n}</div>
            <div style={{fontSize:12,color:'var(--text2)'}}>{s.l}</div>
          </div>
        ))}
      </div>

      {rooms.length === 0 ? (
        <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:16,padding:40,textAlign:'center'}}>
          <div style={{fontSize:48,marginBottom:16}}>🏫</div>
          <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>No Rooms yet</div>
          <div style={{fontSize:13,color:'var(--text2)',marginBottom:24}}>Create a class or team Room, or join one with an invite code</div>
          <div style={{display:'flex',gap:12,justifyContent:'center'}}>
            <button onClick={()=>openModal('create-room')} style={{padding:'12px 24px',background:'var(--pg)',border:'none',borderRadius:10,color:'#fff',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>➕ Create Room</button>
            <button onClick={()=>openModal('join-room')} style={{padding:'12px 24px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:10,color:'var(--text)',fontSize:14,cursor:'pointer',fontFamily:'inherit'}}>🔗 Join with code</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Your Rooms</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
            {rooms.map(r=>(
              <div key={r.id} onClick={()=>selectRoom(r)} style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:14,padding:16,cursor:'pointer',transition:'all .15s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='var(--shadow-sm)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                  <div style={{width:40,height:40,borderRadius:10,background:r.color||'var(--ps)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{r.icon||'📚'}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,letterSpacing:'-.2px'}}>{r.name}</div>
                    <div style={{fontSize:11,color:'var(--text3)'}}>{r.subject||r.type}</div>
                  </div>
                </div>
                <div style={{display:'flex',gap:6}}>
                  <span style={{fontSize:10,fontWeight:500,padding:'3px 8px',borderRadius:20,background:'var(--bg3)',color:'var(--text2)'}}>{r.type}</span>
                  <span style={{fontSize:10,fontWeight:500,padding:'3px 8px',borderRadius:20,background:'var(--bg3)',color:'var(--text2)'}}>{r.myRole}</span>
                  {r.unread>0 && <span style={{fontSize:10,fontWeight:500,padding:'3px 8px',borderRadius:20,background:'var(--reds)',color:'var(--red)'}}>{r.unread} new</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
