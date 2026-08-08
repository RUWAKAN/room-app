import { useApp } from '../context';

export default function Settings() {
  const { profile, toggleTheme, theme, showToast, handleSignOut } = useApp();
  const initials = profile?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || 'ME';

  const Row = ({icon,label,right,onClick,danger}) => (
    <div onClick={onClick} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 14px',borderRadius:10,cursor:onClick?'pointer':'default',transition:'background .15s'}}
      onMouseEnter={e=>{if(onClick)e.currentTarget.style.background='var(--bg3)';}}
      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
      <span style={{fontSize:17,color:'var(--text2)'}}>{icon}</span>
      <span style={{fontSize:13,color:danger?'var(--red)':'var(--text)',flex:1}}>{label}</span>
      {right && <span style={{fontSize:12,color:'var(--text3)'}}>{right}</span>}
    </div>
  );
  const Toggle = ({on,onClick}) => (
    <div onClick={onClick} style={{width:40,height:22,borderRadius:11,background:on?'var(--p)':'var(--bg4)',position:'relative',cursor:'pointer',transition:'background .2s',flexShrink:0}}>
      <div style={{position:'absolute',top:3,left:on?'calc(100% - 19px)':3,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left .2s'}}/>
    </div>
  );
  const Section = ({children}) => <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:14,padding:4,marginBottom:14}}>{children}</div>;

  return (
    <div style={{flex:1,overflowY:'auto',padding:'28px 32px',animation:'fadeUp .28s ease'}}>
      <h1 style={{fontSize:24,fontWeight:800,letterSpacing:'-.8px',marginBottom:24}}>Settings</h1>
      <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:16,padding:24,marginBottom:16,display:'flex',alignItems:'center',gap:20}}>
        <div style={{width:68,height:68,borderRadius:'50%',background:'var(--pg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:700,color:'#fff',boxShadow:'0 4px 18px rgba(99,102,241,0.4)'}}>{initials}</div>
        <div>
          <div style={{fontSize:22,fontWeight:800,letterSpacing:'-.5px',marginBottom:4}}>{profile?.name || 'User'}</div>
          <div style={{fontSize:13,color:'var(--text3)',marginBottom:8}}>{profile?.email}</div>
          <div style={{fontSize:12,color:'var(--text3)',marginBottom:10}}>{profile?.institution || 'No institution set'}</div>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'var(--greens)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:20,padding:'4px 10px',fontSize:11,fontWeight:500,color:'var(--green)'}}>
            🔒 Phone number hidden from everyone
          </div>
        </div>
      </div>
      <Section>
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'13px 14px',borderRadius:10}}>
          <span style={{fontSize:17,color:'var(--text2)'}}>🌙</span>
          <span style={{fontSize:13,color:'var(--text)',flex:1}}>Dark mode</span>
          <Toggle on={theme==='dark'} onClick={toggleTheme}/>
        </div>
        <Row icon="🔔" label="Notifications" right="On" onClick={()=>showToast('Notification settings updated')}/>
      </Section>
      <Section>
        <Row icon="✏️" label="Edit profile" onClick={()=>showToast('Profile editing coming soon')}/>
        <Row icon="🔒" label="Privacy — your number is never shared" right="Protected"/>
        <Row icon="📊" label="Download attendance report" onClick={()=>showToast('Generating report…')}/>
      </Section>
      <Section>
        <Row icon="🚪" label="Sign out" danger onClick={handleSignOut}/>
      </Section>
    </div>
  );
}
