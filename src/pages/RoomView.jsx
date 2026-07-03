import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context';

const TABS = ['chat','notices','resources','members','attendance'];

export default function RoomView({ room }) {
  const { openModal, sendMessage, showToast, currentUser } = useApp();
  const [tab, setTab] = useState('chat');
  const [showInfo, setShowInfo] = useState(false);
  const [msg, setMsg] = useState('');
  const chatRef = useRef(null);

  useEffect(() => { setTab('chat'); }, [room.id]);
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [room.messages, tab]);

  const send = () => {
    if (!msg.trim()) return;
    sendMessage(room.id, msg.trim());
    setMsg('');
  };

  const tabLabel = { chat:'💬 Chat', notices:'📢 Notices', resources:'📁 Resources', members:'👥 Members', attendance:'📊 Attendance' };

  return (
    <div style={{flex:1,display:'flex',overflow:'hidden'}}>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        {/* Topbar */}
        <div style={{padding:'0 20px',height:58,borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:14,flexShrink:0,background:'var(--bg2)'}}>
          <div style={{width:34,height:34,borderRadius:9,background:room.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>{room.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:700,letterSpacing:'-.3px'}}>{room.name}</div>
            <div style={{fontSize:11,color:'var(--text3)'}}>{room.faculty} · {room.members} members · {room.type}</div>
          </div>
          <div style={{display:'flex',gap:4}}>
            {room.type!=='private' && <TbBtn icon="🔗" tip="Invite" onClick={()=>openModal('invite')}/>}
            {room.type!=='private' && <TbBtn icon="📢" tip="Post notice" onClick={()=>openModal('post-notice')}/>}
            <TbBtn icon="ℹ️" tip="Room info" active={showInfo} onClick={()=>setShowInfo(v=>!v)}/>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:0,borderBottom:'1px solid var(--border)',background:'var(--bg2)',padding:'0 20px',flexShrink:0}}>
          {TABS.map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{
              padding:'11px 14px',fontSize:12,fontWeight:500,cursor:'pointer',
              border:'none',borderBottom:`2px solid ${tab===t?'var(--p)':'transparent'}`,
              background:'transparent',color:tab===t?'var(--p)':'var(--text2)',
              transition:'all .15s',fontFamily:'inherit',display:'flex',alignItems:'center',gap:5
            }}>{tabLabel[t]}
              {t==='notices' && room.notices.length>0 && <span style={{background:'var(--red)',color:'#fff',fontSize:10,padding:'1px 5px',borderRadius:8}}>{room.notices.length}</span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
          {tab==='chat' && (
            <>
              <div ref={chatRef} style={{flex:1,overflowY:'auto',padding:20,display:'flex',flexDirection:'column',gap:14}}>
                <div style={{textAlign:'center',fontSize:11,color:'var(--text3)',margin:'4px 0'}}>Today</div>
                {room.messages.map(m => (
                  <div key={m.id} style={{display:'flex',gap:10,alignItems:'flex-end',flexDirection:m.me?'row-reverse':'row'}}>
                    <div style={{width:30,height:30,borderRadius:'50%',background:m.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:600,color:'#fff',flexShrink:0,marginBottom:2}}>{m.initials}</div>
                    <div style={{maxWidth:'65%'}}>
                      <div style={{fontSize:10,color:'var(--text3)',marginBottom:3,padding:m.me?'0 2px 0 0':'0 0 0 2px',textAlign:m.me?'right':'left'}}>{m.me?'You':m.sender} · {m.sid}</div>
                      {m.text && <div style={{padding:'10px 13px',borderRadius:14,fontSize:13,lineHeight:1.5,background:m.me?'var(--pg)':'var(--bg3)',color:m.me?'#fff':'var(--text)',borderBottomRightRadius:m.me?4:14,borderBottomLeftRadius:m.me?14:4}}>{m.text}</div>}
                      {(m.file||m.link) && (
                        <div style={{background:m.me?'rgba(99,102,241,0.2)':'var(--bg3)',borderRadius:12,padding:12,display:'flex',alignItems:'center',gap:10,marginTop:m.text?4:0,cursor:'pointer'}}
                          onClick={()=>showToast('Opening file...')}>
                          <span style={{fontSize:22}}>{(m.file||m.link).icon}</span>
                          <div>
                            <div style={{fontSize:12,fontWeight:500,color:'var(--text)'}}>{(m.file||m.link).name}</div>
                            <div style={{fontSize:10,color:'var(--text3)'}}>{(m.file||m.link).size||(m.file||m.link).sub}</div>
                          </div>
                        </div>
                      )}
                      <div style={{fontSize:10,color:'var(--text3)',marginTop:4,padding:'0 3px',textAlign:m.me?'right':'left'}}>{m.time}{m.me?' ✓✓':''}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:'12px 16px',borderTop:'1px solid var(--border)',background:'var(--bg2)',flexShrink:0}}>
                <div style={{display:'flex',alignItems:'center',gap:10,background:'var(--inp)',border:'1px solid var(--border2)',borderRadius:13,padding:'10px 14px'}}>
                  <button onClick={()=>showToast('Attach file — coming in full build')} style={{background:'none',border:'none',fontSize:17,cursor:'pointer',color:'var(--text2)'}}>📎</button>
                  <button onClick={()=>showToast('Image share — coming in full build')} style={{background:'none',border:'none',fontSize:17,cursor:'pointer',color:'var(--text2)'}}>🖼️</button>
                  <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
                    placeholder={`Message ${room.name}…`}
                    style={{flex:1,background:'none',border:'none',outline:'none',fontSize:13,color:'var(--text)',fontFamily:'inherit'}}/>
                  <button onClick={()=>showToast('😊 Emoji picker coming soon')} style={{background:'none',border:'none',fontSize:17,cursor:'pointer',color:'var(--text2)'}}>😊</button>
                  <button onClick={send} style={{
                    width:34,height:34,borderRadius:9,border:'none',background:'var(--pg)',
                    cursor:'pointer',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center',
                    color:'#fff',boxShadow:'0 2px 10px rgba(99,102,241,0.4)'
                  }}>➤</button>
                </div>
              </div>
            </>
          )}

          {tab==='notices' && (
            <div style={{flex:1,overflowY:'auto',padding:20}}>
              <button onClick={()=>openModal('post-notice')} style={{marginBottom:16,padding:'9px 16px',background:'var(--ps)',border:'1px solid var(--pb2)',borderRadius:9,color:'var(--p)',fontSize:12,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>📢 Post a new notice</button>
              {room.notices.length===0 && <EmptyState icon="📢" title="No notices yet" sub="Post a notice to inform all members."/>}
              {room.notices.map(n => (
                <div key={n.id} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:13,padding:16,marginBottom:12}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:10}}>
                    <span style={{fontSize:20}}>{n.priority==='high'?'📌':'📋'}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:700,letterSpacing:'-.2px',marginBottom:3}}>{n.title}</div>
                      <div style={{fontSize:11,color:'var(--text3)'}}>{n.author} · {n.time}</div>
                    </div>
                    <span style={{fontSize:10,fontWeight:500,padding:'3px 8px',borderRadius:20,background:n.priority==='high'?'var(--reds)':'var(--ps)',color:n.priority==='high'?'var(--red)':'var(--p)'}}>{n.priority}</span>
                  </div>
                  <div style={{fontSize:13,color:'var(--text2)',lineHeight:1.6,marginBottom:12}}>{n.body}</div>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div style={{fontSize:11,color:'var(--text3)',display:'flex',alignItems:'center',gap:5}}>👁️ {n.read} of {n.total} read</div>
                    <div style={{fontSize:11,color:n.read===n.total?'var(--green)':'var(--text3)'}}>{n.read===n.total?'✓ All read':`${n.total-n.read} haven't read`}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==='resources' && (
            <div style={{flex:1,overflowY:'auto',padding:20}}>
              <div onClick={()=>showToast('Upload — drag & drop or click to select')} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'var(--ps)',border:'1px dashed var(--pb2)',borderRadius:12,padding:14,color:'var(--p)',fontSize:13,fontWeight:500,cursor:'pointer',marginBottom:20}}>
                ⬆️ Upload notes, PDFs, images or any file
              </div>
              {['pinned','other'].map(section => {
                const items = section==='pinned' ? room.resources.filter(r=>r.pinned) : room.resources.filter(r=>!r.pinned);
                if (!items.length) return null;
                return (
                  <div key={section} style={{marginBottom:24}}>
                    <div style={{fontSize:12,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:10}}>
                      {section==='pinned'?'📌 Pinned':'📂 All files'}
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(175px,1fr))',gap:10}}>
                      {items.map(r => (
                        <div key={r.id} onClick={()=>showToast(`Opening ${r.name}…`)} style={{
                          background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:12,
                          padding:14,cursor:'pointer',transition:'all .15s'
                        }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.transform='translateY(-1px)';}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='none';}}>
                          <div style={{fontSize:26,marginBottom:8}}>{r.icon}</div>
                          <div style={{fontSize:12,fontWeight:600,marginBottom:3,lineHeight:1.3}}>{r.name}</div>
                          <div style={{fontSize:10,color:'var(--text3)'}}>{r.meta}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {room.resources.length===0 && <EmptyState icon="📁" title="No files yet" sub="Upload notes, PDFs, or images to share with the Room."/>}
            </div>
          )}

          {tab==='members' && (
            <div style={{flex:1,overflowY:'auto',padding:20}}>
              <div style={{fontSize:12,color:'var(--text3)',marginBottom:14}}>{room.members} members · Privacy: phone numbers hidden from everyone</div>
              <SectionHead>Faculty</SectionHead>
              {room.facultyList.map(m => <MemberRow key={m.id} m={m} badge={m.role==='owner'?{label:'Owner',bg:'var(--ambers)',color:'var(--amber)'}:{label:'Faculty',bg:'var(--ps)',color:'var(--p)'}}/>)}
              <SectionHead>Students</SectionHead>
              {room.studentList.map(m => <MemberRow key={m.id} m={m} badge={{label:m.you?'You':'Student',bg:'var(--greens)',color:'var(--green)'}}/>)}
              {room.members > room.studentList.length + room.facultyList.length && (
                <div style={{textAlign:'center',marginTop:14,fontSize:12,color:'var(--text3)'}}>+ {room.members - room.studentList.length - room.facultyList.length} more members</div>
              )}
            </div>
          )}

          {tab==='attendance' && (
            <div style={{flex:1,overflowY:'auto',padding:20}}>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}}>
                <ACard n={`${room.attendance.percent}%`} l="Your attendance" color={room.attendance.percent>=80?'var(--green)':'var(--amber)'}/>
                <ACard n={`${room.attendance.attended}/${room.attendance.total}`} l="Sessions attended"/>
                <ACard n={room.attendance.total-room.attendance.attended} l="Missed" color="var(--amber)"/>
              </div>
              {room.attendance.calendar.length > 0 && (
                <>
                  <SectionHead>January 2025</SectionHead>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:5,marginBottom:12}}>
                    {room.attendance.calendar.map((d,i)=>(
                      <div key={i} style={{
                        aspectRatio:1,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:10,fontWeight:500,cursor:d?'pointer':'default',
                        background:d==='T'?'var(--pg)':d==='P'?'rgba(16,185,129,0.22)':d==='A'?'rgba(248,113,113,0.15)':'var(--border)',
                        color:d==='T'?'#fff':d==='P'?'var(--green)':d==='A'?'var(--red)':'var(--text3)'
                      }}>{d==='T'?i+1:d?i+1:'—'}</div>
                    ))}
                  </div>
                  <div style={{display:'flex',gap:16,marginBottom:16,fontSize:11,color:'var(--text3)'}}>
                    <span><span style={{color:'var(--green)'}}>■</span> Present</span>
                    <span><span style={{color:'var(--red)'}}>■</span> Absent</span>
                    <span><span style={{color:'var(--p)'}}>■</span> Today</span>
                  </div>
                  <SectionHead>Session log</SectionHead>
                  {room.attendance.sessions.map((s,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'9px 10px',borderRadius:9,marginBottom:2,transition:'background .15s'}}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <span style={{fontSize:12,color:'var(--text2)',width:64,flexShrink:0}}>{s.date}</span>
                      <span style={{fontSize:12,color:'var(--text)',flex:1}}>{s.topic}</span>
                      <span style={{fontSize:11,fontWeight:500,padding:'3px 8px',borderRadius:20,background:s.status==='present'?'var(--greens)':'var(--reds)',color:s.status==='present'?'var(--green)':'var(--red)'}}>{s.status}</span>
                    </div>
                  ))}
                  {room.attendance.percent < 80 && (
                    <div style={{marginTop:16,padding:'12px',background:'var(--ambers)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:9,fontSize:12,color:'var(--amber)'}}>
                      ⚠️ Your attendance is below 80%. Minimum required is 75%. Attend the next 2 sessions to stay safe.
                    </div>
                  )}
                </>
              )}
              {room.attendance.calendar.length===0 && <EmptyState icon="📊" title="No sessions recorded yet" sub="Attendance will be logged here once sessions begin."/>}
            </div>
          )}
        </div>
      </div>

      {/* Info panel */}
      {showInfo && (
        <div style={{width:248,borderLeft:'1px solid var(--border)',background:'var(--bg2)',flexShrink:0,display:'flex',flexDirection:'column',overflowY:'auto',animation:'slideIn .2s ease'}}>
          <InfoSection title="Room info">
            <InfoRow icon="🏫" label="Type" val={room.type}/>
            <InfoRow icon="📚" label="Subject" val={room.subject}/>
            <InfoRow icon="👥" label="Members" val={room.members}/>
          </InfoSection>
          <InfoSection title="Your identity">
            <InfoRow icon="🪪" label="Room ID" val={currentUser.id} valColor="var(--p)"/>
            <InfoRow icon="🔒" label="Phone" val="Hidden" valColor="var(--green)"/>
          </InfoSection>
          <InfoSection title="Quick actions">
            <ActionBtn onClick={()=>openModal('invite')}>🔗 Invite members</ActionBtn>
            <ActionBtn onClick={()=>openModal('post-notice')}>📢 Post notice</ActionBtn>
            <ActionBtn onClick={()=>showToast('Opening Meet link…')} color="var(--greens)" textColor="var(--green)">🎥 Join session — Google Meet</ActionBtn>
          </InfoSection>
        </div>
      )}
    </div>
  );
}

const TbBtn = ({icon,tip,active,onClick}) => (
  <button onClick={onClick} title={tip} style={{
    width:34,height:34,borderRadius:8,border:'none',cursor:'pointer',fontSize:16,
    display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s',
    background:active?'var(--ps)':'transparent',color:active?'var(--p)':'var(--text2)',fontFamily:'inherit'
  }}
  onMouseEnter={e=>{if(!active){e.currentTarget.style.background='var(--bg3)';e.currentTarget.style.color='var(--text)';}}}
  onMouseLeave={e=>{if(!active){e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--text2)';}}}
  >{icon}</button>
);
const SectionHead = ({children}) => <div style={{fontSize:12,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'.06em',margin:'14px 0 8px'}}>{children}</div>;
const MemberRow = ({m,badge}) => (
  <div style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',borderRadius:10,transition:'background .15s',marginBottom:2}}
    onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'}
    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
    <div style={{width:38,height:38,borderRadius:'50%',background:m.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:600,color:'#fff',flexShrink:0,position:'relative'}}>
      {m.initials}
      {m.online && <span style={{position:'absolute',bottom:0,right:0,width:10,height:10,borderRadius:'50%',background:'var(--green)',border:'2px solid var(--bg2)'}}/>}
    </div>
    <div>
      <div style={{fontSize:13,fontWeight:600}}>{m.name}{m.you?' (you)':''}</div>
      <div style={{fontSize:11,color:'var(--text3)'}}>{m.id}</div>
    </div>
    {badge && <span style={{marginLeft:'auto',fontSize:10,fontWeight:500,padding:'3px 8px',borderRadius:20,background:badge.bg,color:badge.color}}>{badge.label}</span>}
  </div>
);
const ACard = ({n,l,color}) => (
  <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:12,padding:14,textAlign:'center'}}>
    <div style={{fontSize:24,fontWeight:800,letterSpacing:'-.5px',marginBottom:3,color:color||'var(--text)'}}>{n}</div>
    <div style={{fontSize:11,color:'var(--text3)'}}>{l}</div>
  </div>
);
const InfoSection = ({title,children}) => (
  <div style={{padding:16,borderBottom:'1px solid var(--border)'}}>
    <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.07em',color:'var(--text3)',marginBottom:12}}>{title}</div>
    {children}
  </div>
);
const InfoRow = ({icon,label,val,valColor}) => (
  <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:9}}>
    <span style={{fontSize:14,color:'var(--text3)'}}>{icon}</span>
    <span style={{fontSize:11,color:'var(--text2)',flex:1}}>{label}</span>
    <span style={{fontSize:12,fontWeight:500,color:valColor||'var(--text)'}}>{val}</span>
  </div>
);
const ActionBtn = ({onClick,children,color,textColor}) => (
  <div onClick={onClick} style={{
    display:'flex',alignItems:'center',gap:8,background:color||'var(--ps)',
    border:`1px solid ${color?'rgba(16,185,129,0.25)':'var(--pb2)'}`,
    borderRadius:9,padding:'10px 12px',cursor:'pointer',fontSize:12,fontWeight:500,
    color:textColor||'var(--p)',transition:'all .15s',marginBottom:8
  }}
  onMouseEnter={e=>e.currentTarget.style.opacity='.8'}
  onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
    {children}
  </div>
);
const EmptyState = ({icon,title,sub}) => (
  <div style={{textAlign:'center',padding:'40px 20px'}}>
    <div style={{fontSize:36,marginBottom:12}}>{icon}</div>
    <div style={{fontSize:14,fontWeight:600,marginBottom:6}}>{title}</div>
    <div style={{fontSize:12,color:'var(--text3)'}}>{sub}</div>
  </div>
);
