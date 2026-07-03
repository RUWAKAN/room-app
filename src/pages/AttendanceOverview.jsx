import { useApp } from '../context';
import { overallAttendance } from '../data';

export default function AttendanceOverview() {
  const { rooms } = useApp();
  return (
    <div style={{flex:1,overflowY:'auto',padding:'28px 32px',animation:'fadeUp .28s ease'}}>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:24,fontWeight:800,letterSpacing:'-.8px',marginBottom:4}}>Attendance</h1>
        <p style={{fontSize:13,color:'var(--text2)'}}>Your attendance record across all Rooms this semester.</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:28}}>
        {overallAttendance.map(x=>(
          <div key={x.subject} style={{background:'var(--bg2)',border:`2px solid ${x.percent<80?'rgba(245,158,11,0.3)':'var(--border)'}`,borderRadius:14,padding:16,textAlign:'center'}}>
            <div style={{fontSize:28,fontWeight:800,letterSpacing:'-1px',color:x.percent>=80?'var(--green)':'var(--amber)',marginBottom:4}}>{x.percent}%</div>
            <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.3}}>{x.subject}</div>
            {x.percent<80 && <div style={{fontSize:10,color:'var(--amber)',marginTop:6}}>⚠ Below minimum</div>}
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:28}}>
        <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:14,padding:20}}>
          <div style={{fontSize:14,fontWeight:700,letterSpacing:'-.2px',marginBottom:16}}>Monthly overview — January</div>
          {overallAttendance.map(x=>(
            <div key={x.subject} style={{marginBottom:14}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:12}}>
                <span style={{color:'var(--text2)'}}>{x.subject}</span>
                <span style={{fontWeight:600,color:x.percent>=80?'var(--green)':'var(--amber)'}}>{x.percent}%</span>
              </div>
              <div style={{height:6,background:'var(--bg3)',borderRadius:4,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${x.percent}%`,background:x.color,borderRadius:4,transition:'width .6s'}}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:14,padding:20}}>
          <div style={{fontSize:14,fontWeight:700,letterSpacing:'-.2px',marginBottom:16}}>Semester summary</div>
          {rooms.filter(r=>r.attendance.total>0).map(r=>(
            <div key={r.id} style={{display:'flex',alignItems:'center',gap:12,padding:'9px 10px',borderRadius:9,marginBottom:2,transition:'background .15s'}}
              onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <span style={{fontSize:13,color:'var(--text2)',flex:1}}>{r.name}</span>
              <span style={{fontSize:12,color:'var(--text3)'}}>{r.attendance.attended}/{r.attendance.total} sessions</span>
              <span style={{fontSize:11,fontWeight:500,padding:'3px 8px',borderRadius:20,background:r.attendance.percent>=80?'var(--greens)':'var(--ambers)',color:r.attendance.percent>=80?'var(--green)':'var(--amber)'}}>{r.attendance.percent}%</span>
            </div>
          ))}
          <div style={{marginTop:12,padding:'10px 12px',background:'var(--ambers)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:9,fontSize:12,color:'var(--amber)'}}>
            ⚠️ Chemistry attendance is at 76%. Attend next 2 sessions to stay above minimum.
          </div>
        </div>
      </div>
    </div>
  );
}
