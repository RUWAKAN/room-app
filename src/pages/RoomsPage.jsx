import { useState } from 'react';
import { useApp } from '../context';
import RoomView from './RoomView';

export default function RoomsPage() {
  const { rooms, activeRoom, selectRoom, openModal } = useApp();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const filtered = rooms.filter(r => {
    const matchSearch = r.name?.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab==='all' || r.type===tab;
    return matchSearch && matchTab;
  });

  return (
    <div style={{display:'flex',flex:1,overflow:'hidden'}}>
      <div style={{width:280,borderRight:'1px solid var(--border)',background:'var(--bg2)',display:'flex',flexDirection:'column',flexShrink:0}}>
        <div style={{padding:'18px 14px 12px',borderBottom:'1px solid var(--border)'}}>
          <h2 style={{fontSize:16,fontWeight:700,marginBottom:12,letterSpacing:'-.3px'}}>My Rooms</h2>
          <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--inp)',border:'1px solid var(--border)',borderRadius:9,padding:'8px 12px'}}>
            <span style={{color:'var(--text3)',fontSize:14}}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search rooms…" style={{background:'none',border:'none',outline:'none',fontSize:13,color:'var(--text)',width:'100%',fontFamily:'inherit'}}/>
          </div>
        </div>
        <div style={{display:'flex',gap:4,padding:'10px 12px',borderBottom:'1px solid var(--border)'}}>
          {['all','class','team','project'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'5px 10px',borderRadius:7,fontSize:11,fontWeight:500,cursor:'pointer',border:'none',fontFamily:'inherit',transition:'all .15s',background:tab===t?'var(--ps)':'transparent',color:tab===t?'var(--p)':'var(--text2)'}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
          ))}
        </div>
        <div style={{flex:1,overflowY:'auto',padding:8}}>
          {filtered.length===0 && (
            <div style={{textAlign:'center',padding:'30px 16px',color:'var(--text3)',fontSize:13}}>
              {rooms.length===0 ? 'No rooms yet. Create or join one!' : 'No matching rooms'}
            </div>
          )}
          {filtered.map(r=>(
            <div key={r.id} onClick={()=>selectRoom(r)} style={{display:'flex',alignItems:'center',gap:11,padding:'10px',borderRadius:10,cursor:'pointer',transition:'background .15s',marginBottom:2,background:activeRoom?.id===r.id?'var(--ps)':'transparent'}}
            onMouseEnter={e=>{if(activeRoom?.id!==r.id)e.currentTarget.style.background='var(--bg3)';}}
            onMouseLeave={e=>{if(activeRoom?.id!==r.id)e.currentTarget.style.background='transparent';}}>
              <div style={{width:42,height:42,borderRadius:11,background:r.color||'var(--ps)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{r.icon||'📚'}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',color:activeRoom?.id===r.id?'var(--p)':'var(--text)'}}>{r.name}</div>
                <div style={{fontSize:11,color:'var(--text3)'}}>{r.type} · {r.subject||''}</div>
              </div>
              {r.unread>0 && <span style={{background:'var(--p)',color:'#fff',fontSize:10,fontWeight:600,padding:'2px 6px',borderRadius:10}}>{r.unread}</span>}
            </div>
          ))}
        </div>
        <div style={{padding:'10px 12px',borderTop:'1px solid var(--border)',display:'flex',gap:8}}>
          <button onClick={()=>openModal('create-room')} style={{flex:1,padding:10,borderRadius:10,background:'var(--ps)',border:'1px dashed var(--pb2)',color:'var(--p)',fontSize:12,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>➕ Create</button>
          <button onClick={()=>openModal('join-room')} style={{flex:1,padding:10,borderRadius:10,background:'var(--bg3)',border:'1px solid var(--border)',color:'var(--text2)',fontSize:12,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>🔗 Join</button>
        </div>
      </div>
      {activeRoom ? <RoomView room={activeRoom}/> : (
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
          <div style={{fontSize:40}}>💬</div>
          <div style={{fontSize:14,fontWeight:600,color:'var(--text2)'}}>Select a Room to start</div>
          <div style={{fontSize:12,color:'var(--text3)'}}>Or create / join a new one</div>
        </div>
      )}
    </div>
  );
}
