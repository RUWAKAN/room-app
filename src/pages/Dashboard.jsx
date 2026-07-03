import { useApp } from '../context';
import { overallAttendance } from '../data';

export default function Dashboard() {
  const { rooms, setPage, selectRoom, currentUser } = useApp();
  const totalUnread = rooms.reduce((a,r)=>a+(r.unread||0),0);
  const avgAttend = Math.round(overallAttendance.reduce((a,x)=>a+x.percent,0)/overallAttendance.length);

  const Card = ({n,l,sub,color}) => (
    <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:14,padding:16}}>
      <div style={{fontSize:28,fontWeight:800,letterSpacing:'-1px',color:color||'var(--text)',marginBottom:4}}>{n}</div>
      <div style={{fontSize:12,color:'var(--text2)'}}>{l}</div>
      {sub && <div style={{fontSize:11,marginTop:4,color:color||'var(--text3)'}}>{sub}</div>}
    </div>
  );

  return (
    <div style={{flex:1,overflowY:'auto',padding:'28px 32px',animation:'fadeUp .28s ease'}}>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:26,fontWeight:800,letterSpacing:'-.8px',marginBottom:4}}>
          Good morning, {currentUser.name.split(' ')[0]} 👋
        </h1>
        <p style={{fontSize:13,color:'var(--text2)'}}>
          {totalUnread > 0 ? `You have ${totalUnread} unread message${totalUnread>1?'s':''} across your Rooms.` : 'All caught up across your Rooms.'}
        </p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:28}}>
        <Card n={rooms.length} l="Active Rooms" sub="↑ 1 this month" color="var(--text)"/>
        <Card n={`${avgAttend}%`} l="Avg. attendance" sub={avgAttend>=80?"On track":"⚠ Check Chemistry"} color={avgAttend>=80?"var(--green)":"var(--amber)"}/>
        <Card n={rooms.reduce((a,r)=>a+(r.resources?.length||0),0)} l="Resources shared" sub="↑ 4 this week" color="var(--text)"/>
        <Card n={totalUnread} l="Unread messages" sub={totalUnread>0?"Check Rooms":"All read ✓"} color={totalUnread>0?"var(--red)":"var(--green)"}/>
      </div>

      <div style={{fontSize:14,fontWeight:700,letterSpacing:'-.3px',marginBottom:14}}>Your Rooms</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12,marginBottom:28}}>
        {rooms.map(r => (
          <div key={r.id} onClick={()=>selectRoom(r)} style={{
            background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:14,
            padding:16,cursor:'pointer',transition:'all .15s'
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='var(--shadow-sm)';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
              <div style={{width:40,height:40,borderRadius:10,background:r.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{r.icon}</div>
              <div>
                <div style={{fontSize:14,fontWeight:700,letterSpacing:'-.2px'}}>{r.name}</div>
                <div style={{fontSize:11,color:'var(--text3)'}}>{r.faculty} · {r.members} members</div>
              </div>
            </div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              <span style={{fontSize:10,fontWeight:500,padding:'3px 8px',borderRadius:20,background:'var(--bg3)',color:'var(--text2)'}}>{r.type}</span>
              {r.unread>0 && <span style={{fontSize:10,fontWeight:500,padding:'3px 8px',borderRadius:20,background:'var(--reds)',color:'var(--red)'}}>{r.unread} unread</span>}
            </div>
            <div style={{fontSize:11,color:'var(--text3)',marginTop:10,display:'flex',alignItems:'center',gap:4}}>
              🕐 {r.lastTime} ago
            </div>
          </div>
        ))}
      </div>

      <div style={{fontSize:14,fontWeight:700,letterSpacing:'-.3px',marginBottom:14}}>Attendance summary</div>
      <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:14,padding:20,marginBottom:28}}>
        {overallAttendance.map(x => (
          <div key={x.subject} style={{marginBottom:14}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:12}}>
              <span style={{color:'var(--text2)'}}>{x.subject}</span>
              <span style={{fontWeight:600,color:x.percent>=80?'var(--green)':'var(--amber)'}}>{x.percent}%</span>
            </div>
            <div style={{height:6,background:'var(--bg3)',borderRadius:4,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${x.percent}%`,background:x.color,borderRadius:4,transition:'width .5s'}}/>
            </div>
          </div>
        ))}
        {overallAttendance.some(x=>x.percent<80) && (
          <div style={{marginTop:8,padding:'10px 12px',background:'var(--ambers)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:9,fontSize:12,color:'var(--amber)'}}>
            ⚠️ Chemistry attendance is below 80%. Attend the next 2 sessions to stay safe.
          </div>
        )}
      </div>

      <div style={{fontSize:14,fontWeight:700,letterSpacing:'-.3px',marginBottom:14}}>Recent notices</div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {rooms.flatMap(r=>r.notices.slice(0,1).map(n=>({...n,roomName:r.name,roomId:r.id}))).slice(0,3).map(n => (
          <div key={n.id} onClick={()=>{selectRoom(rooms.find(r=>r.id===n.roomId));}} style={{
            background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:12,
            padding:14,display:'flex',gap:12,cursor:'pointer',transition:'border-color .15s'
          }}
          onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border2)'}
          onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
            <div style={{fontSize:20,flexShrink:0}}>{n.priority==='high'?'📌':'📋'}</div>
            <div>
              <div style={{fontSize:13,fontWeight:600,marginBottom:3}}>{n.title}</div>
              <div style={{fontSize:11,color:'var(--text2)',lineHeight:1.45,marginBottom:4}}>{n.body?.slice(0,100)}...</div>
              <div style={{fontSize:10,color:'var(--text3)'}}>{n.roomName} · {n.author} · {n.time} · {n.read}/{n.total} read</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
