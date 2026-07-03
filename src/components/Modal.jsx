import { useApp } from '../context';
import { useState } from 'react';

export default function Modal() {
  const { modal, closeModal, createRoom, activeRoom, addNotice, showToast } = useApp();
  const [form, setForm] = useState({});

  if (!modal) return null;

  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));

  const modalStyle = {
    position:'fixed', inset:0, background:'rgba(0,0,0,0.65)',
    zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center',
    backdropFilter:'blur(4px)', animation:'fadeIn .2s ease'
  };
  const boxStyle = {
    background:'var(--bg2)', border:'1px solid var(--border2)',
    borderRadius:18, padding:28, width:420, maxWidth:'90vw',
    boxShadow:'var(--shadow)', position:'relative', animation:'fadeUp .25s ease'
  };

  const Label = ({children}) => <label style={{display:'block',fontSize:11,fontWeight:500,color:'var(--text2)',marginBottom:5}}>{children}</label>;
  const Input = (props) => (
    <input {...props} style={{
      width:'100%', padding:'10px 13px', background:'var(--inp)',
      border:'1.5px solid var(--border)', borderRadius:9, color:'var(--text)',
      fontSize:13, fontFamily:'Inter,sans-serif', outline:'none',
      transition:'all .2s', marginBottom:14
    }}
    onFocus={e=>{e.target.style.borderColor='var(--p)';e.target.style.background='var(--inp-f)';}}
    onBlur={e=>{e.target.style.borderColor='var(--border)';e.target.style.background='var(--inp)';}}
    onChange={props.onChange}/>
  );
  const Select = ({children,...props}) => (
    <select {...props} style={{
      width:'100%', padding:'10px 13px', background:'var(--inp)',
      border:'1.5px solid var(--border)', borderRadius:9, color:'var(--text)',
      fontSize:13, fontFamily:'Inter,sans-serif', outline:'none', marginBottom:14,
      cursor:'pointer'
    }} onChange={props.onChange}>{children}</select>
  );

  const BtnP = ({onClick,children}) => (
    <button onClick={onClick} style={{
      padding:'10px 20px', background:'var(--pg)', border:'none', borderRadius:9,
      color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif'
    }}>{children}</button>
  );
  const BtnS = ({onClick,children}) => (
    <button onClick={onClick} style={{
      padding:'10px 20px', background:'var(--bg3)', border:'1px solid var(--border)',
      borderRadius:9, color:'var(--text)', fontSize:13, cursor:'pointer', fontFamily:'Inter,sans-serif'
    }}>{children}</button>
  );

  const Head = ({title, sub}) => (
    <div style={{marginBottom:20}}>
      <button onClick={closeModal} style={{
        position:'absolute', top:16, right:16, background:'var(--bg3)',
        border:'none', borderRadius:8, width:32, height:32, cursor:'pointer',
        fontSize:16, color:'var(--text2)', display:'flex', alignItems:'center', justifyContent:'center'
      }}>✕</button>
      <h3 style={{fontSize:18,fontWeight:800,letterSpacing:'-.5px',marginBottom:6}}>{title}</h3>
      <p style={{fontSize:13,color:'var(--text2)',lineHeight:1.5}}>{sub}</p>
    </div>
  );

  const content = {
    'create-room': (
      <div>
        <Head title="Create a Room" sub="Set up a private workspace for your class or team." />
        <Label>Room name</Label>
        <Input placeholder="e.g. Physics Sem 4 — Batch A" onChange={set('name')} />
        <Label>Type</Label>
        <Select onChange={set('type')}>
          <option value="class">Class / Academic</option>
          <option value="team">Team / Corporate</option>
          <option value="project">Project Group</option>
        </Select>
        <Label>Subject / Department</Label>
        <Input placeholder="e.g. B.Sc Physics · Semester 4" onChange={set('subject')} />
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <BtnS onClick={closeModal}>Cancel</BtnS>
          <BtnP onClick={() => form.name && createRoom(form)}>Create Room →</BtnP>
        </div>
      </div>
    ),
    'invite': activeRoom && (
      <div>
        <Head title={`Invite to ${activeRoom.name}`} sub="Share this code with students. They join with their roll number — no personal numbers needed." />
        <div style={{background:'#fff',borderRadius:12,padding:20,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
          <QRCode code={activeRoom.code||'XK92PL'} />
        </div>
        <div style={{background:'var(--ps)',border:'1px solid var(--pb2)',borderRadius:9,padding:'12px',textAlign:'center',fontSize:20,fontWeight:800,letterSpacing:4,color:'var(--p)',marginBottom:12,fontFamily:'monospace'}}>
          {activeRoom.code||'XK92PL'}
        </div>
        <div style={{fontSize:12,color:'var(--text2)',textAlign:'center',marginBottom:14}}>
          or share: <span style={{color:'var(--p)',fontFamily:'monospace'}}>room.app/join/{activeRoom.code||'XK92PL'}</span>
        </div>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <BtnS onClick={closeModal}>Close</BtnS>
          <BtnP onClick={()=>{showToast('Link copied to clipboard ✓');closeModal();}}>Copy link</BtnP>
        </div>
      </div>
    ),
    'post-notice': activeRoom && (
      <div>
        <Head title="Post a notice" sub="All members will see this. You'll see who has read it." />
        <Label>Title</Label>
        <Input placeholder="e.g. Class rescheduled to Friday" onChange={set('title')} />
        <Label>Message</Label>
        <textarea placeholder="Details of the notice..." onChange={set('body')} style={{
          width:'100%', padding:'10px 13px', background:'var(--inp)',
          border:'1.5px solid var(--border)', borderRadius:9, color:'var(--text)',
          fontSize:13, fontFamily:'Inter,sans-serif', outline:'none',
          marginBottom:14, resize:'none', rows:3, minHeight:80
        }} rows={3}/>
        <Label>Priority</Label>
        <Select onChange={set('priority')}>
          <option value="normal">Normal</option>
          <option value="high">High — show at top</option>
        </Select>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <BtnS onClick={closeModal}>Cancel</BtnS>
          <BtnP onClick={()=>{if(form.title){addNotice(activeRoom.id,{title:form.title,body:form.body||'',priority:form.priority||'normal'});closeModal();}}}>Post notice</BtnP>
        </div>
      </div>
    ),
  }[modal];

  return (
    <div style={modalStyle} onClick={closeModal}>
      <div style={boxStyle} onClick={e=>e.stopPropagation()}>
        {content || <div><Head title="Room" sub=""/><BtnS onClick={closeModal}>Close</BtnS></div>}
      </div>
    </div>
  );
}

function QRCode({ code }) {
  const pattern = [1,1,1,1,1,1,1,0,1,0,1,1,0,0,0,0,0,1,0,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1,0,0,1,1,1,0,1,1,1,0,1,0,1,1,0,1,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,0,1,0,1,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,0,0,1,0,0,1,0,0,0,1,0,0,1,1,1];
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(11,1fr)',gap:2,width:132}}>
      {pattern.map((c,i) => <div key={i} style={{width:10,height:10,borderRadius:1,background:c?'#08080F':'#ffffff'}}/>)}
    </div>
  );
}
