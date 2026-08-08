import { useApp } from '../context';

export default function AttendanceOverview() {
  const { rooms } = useApp();
  const roomsWithData = rooms.filter(r => r.attendance?.total > 0);
  const avg = roomsWithData.length > 0 ? Math.round(roomsWithData.reduce((a,r)=>a+r.attendance.percent,0)/roomsWithData.length) : 0;

  return (
    <div style={{flex:1,overflowY:'auto',padding:'28px 32px',animation:'fadeUp .28s ease'}}>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:24,fontWeight:800,letterSpacing:'-.8px',marginBottom:4}}>Attendance</h1>
        <p style={{fontSize:13,color:'var(--text2)'}}>Your attendance record across all Rooms.</p>
      </div>
      {rooms.length===0 ? (
        <div style={{textAlign:'center',padding:'60px 20px'}}>
          <div style={{fontSize:40,marginBottom:12}}>📊</div>
          <div style={{fontSize:14,fontWeight:600,marginBottom:6}}>No rooms yet</div>
          <div style={{fontSize:12,color:'var(--text3)'}}>Join a class Room to see your attendance here.</div>
        </div>
      ) : (
        <>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:28}}>
            {rooms.slice(0,4).map(r=>(
              <div key={r.id} style={{background:'var(--bg2)',border:`1px solid ${r.attendance?.percent<75?'rgba(245,158,11,0.3)':'var(--border)'}`,borderRadius:14,padding:16,textAlign:'center'}}>
                <div style={{fontSize:28,fontWeight:800,letterSpacing:'-1px',color:r.attendance?.percent>=75?'var(--green)':'var(--amber)',marginBottom:4}}>{r.attendance?.percent||0}%</div>
                <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.3}}>{r.name}</div>
                {r.attendance?.percent<75 && r.attendance?.total>0 && <div style={{fontSize:10,color:'var(--amber)',marginTop:4}}>⚠ Below minimum</div>}
              </div>
            ))}
          </div>
          <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:14,padding:20}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>Overall progress</div>
            {rooms.map(r=>(
              <div key={r.id} style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:12}}>
                  <span style={{color:'var(--text2)'}}>{r.name}</span>
                  <span style={{fontWeight:600,color:r.attendance?.percent>=75?'var(--green)':'var(--amber)'}}>{r.attendance?.percent||0}%</span>
                </div>
                <div style={{height:6,background:'var(--bg3)',borderRadius:4,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${r.attendance?.percent||0}%`,background:'var(--pg)',borderRadius:4,transition:'width .6s'}}/>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
