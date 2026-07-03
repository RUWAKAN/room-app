import { useApp } from '../context';

export default function Settings() {
  const { currentUser, toggleTheme, theme, showToast } = useApp();
  const Row = ({icon,label,right,onClick,danger}) => (
    <div onClick={onClick} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 14px',borderRadius:10,cursor:onClick?'pointer':'default',transition:'background .15s'}}
      onMouseEnter={e=>{if(onClick)e.currentTarget.style.background='var(--bg3)';}}
      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
      <span style={{fontSize:17,color:'var(--text2)'}}>{icon}</span>
      <span style={{fontSize:13,color:danger?'var(--red)':'var(--text)',flex:1}}>{label}</span>
      {right && <span style={{fontSize:12,color:'var(--text3)'}}>{right}</span>}
    </div>
  );
  const Toggle = ({on}) => (
    <div onClick={toggleTheme} style={{width:40,height:22,borderRadius:11,background:on?'var(--p)':'var(--bg4)',position:'relative',cursor:'pointer',transition:'background .2s',flexShrink:0}}>
      <div style={{position:'absolute',top:3,left:on?'calc(100% - 19px)':3,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left .2s'}}/>
    </div>
  );
  const Section = ({children}) => <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:14,padding:4,marginBottom:14}}>{children}</div>;

  return (
    <div style={{flex:1,overflowY:'auto',padding:'28px 32px',animation:'fadeUp .28s ease'}}>
      <h1 style={{fontSize:24,fontWeight:800,letterSpacing:'-.8px',marginBottom:24}}>Settings</h1>
      <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:16,padding:24,marginBottom:16,display:'flex',alignItems:'center',gap:20}}>
        <div style={{width:68,height:68,borderRadius:'50%',background:'var(--pg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:700,color:'#fff',boxShadow:'0 4px 18px rgba(99,102,241,0.4)'}}>
          {currentUser.initials}
        </div>
        <div>
          <div style={{fontSize:22,fontWeight:800,letterSpacing:'-.5px',marginBottom:4}}>{currentUser.name}</div>
          <div style={{fontSize:13,color:'var(--p)',fontWeight:600,marginBottom:2}}>{currentUser.id}</div>
          <div style={{fontSize:12,color:'var(--text3)',marginBottom:10}}>{currentUser.institution} · {currentUser.course}</div>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'var(--greens)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:20,padding:'4px 10px',fontSize:11,fontWeight:500,color:'var(--green)'}}>
            🔒 Phone number hidden from everyone
          </div>
        </div>
      </div>

      <Section>
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'13px 14px',borderRadius:10}}>
          <span style={{fontSize:17,color:'var(--text2)'}}>🌙</span>
          <span style={{fontSize:13,color:'var(--text)',flex:1}}>Dark mode</span>
          <Toggle on={theme==='dark'}/>
        </div>
        <Row icon="🔔" label="Notifications" right="On" onClick={()=>showToast('Notifications updated')}/>
        <Row icon="🌐" label="Language" right="English" onClick={()=>showToast('Language settings coming soon')}/>
      </Section>

      <Section>
        <Row icon="✏️" label="Edit profile" onClick={()=>showToast('Edit profile — coming in full build')}/>
        <Row icon="🔒" label="Privacy settings" right="Protected" onClick={()=>showToast('Your number is never shared — guaranteed')}/>
        <Row icon="📊" label="Download attendance report" onClick={()=>showToast('Generating PDF report…')}/>
        <Row icon="📱" label="Download Room app" onClick={()=>showToast('Mobile app coming soon!')}/>
      </Section>

      <Section>
        <Row icon="❓" label="Help & support" onClick={()=>showToast('Opening help center…')}/>
        <Row icon="📄" label="Terms of service" onClick={()=>showToast('Opening terms…')}/>
        <Row icon="🔐" label="Privacy policy" onClick={()=>showToast('Opening privacy policy…')}/>
      </Section>

      <Section>
        <Row icon="🚪" label="Sign out" danger onClick={()=>showToast('Signed out — see you soon!')}/>
      </Section>
    </div>
  );
}
