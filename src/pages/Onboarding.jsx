import { useState } from 'react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const Input = ({label,placeholder,type='text',onChange}) => (
    <div style={{marginBottom:14}}>
      <label style={{display:'block',fontSize:11,fontWeight:500,color:'var(--text2)',marginBottom:5}}>{label}</label>
      <input type={type} placeholder={placeholder} onChange={onChange}
        style={{width:'100%',padding:'11px 14px',background:'var(--inp)',border:'1.5px solid var(--border)',borderRadius:10,color:'var(--text)',fontSize:14,fontFamily:'Inter,sans-serif',outline:'none',transition:'all .2s'}}
        onFocus={e=>{e.target.style.borderColor='var(--p)';e.target.style.background='var(--inp-f)';}}
        onBlur={e=>{e.target.style.borderColor='var(--border)';e.target.style.background='var(--inp)';}}
      />
    </div>
  );
  const BtnP = ({children,onClick}) => (
    <button onClick={onClick} style={{width:'100%',padding:'13px',background:'var(--pg)',border:'none',borderRadius:11,color:'#fff',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif',marginBottom:10,boxShadow:'0 4px 18px rgba(99,102,241,0.35)',transition:'all .2s'}}
      onMouseEnter={e=>e.currentTarget.style.opacity='.9'}
      onMouseLeave={e=>e.currentTarget.style.opacity='1'}
    >{children}</button>
  );
  const BtnS = ({children,onClick}) => (
    <button onClick={onClick} style={{width:'100%',padding:'12px',background:'var(--inp)',border:'1.5px solid var(--border)',borderRadius:11,color:'var(--text)',fontSize:14,cursor:'pointer',fontFamily:'Inter,sans-serif',marginBottom:10,transition:'all .2s'}}>{children}</button>
  );
  const Dots = ({total,active}) => (
    <div style={{display:'flex',gap:5,marginBottom:20}}>
      {Array(total).fill(0).map((_,i)=>(
        <div key={i} style={{height:5,borderRadius:3,transition:'all .3s',background:i<active?'var(--green)':i===active?'var(--p)':'var(--border2)',width:i===active?26:18}}/>
      ))}
    </div>
  );

  const ROLES = [
    { id:'student', icon:'🎓', title:'Student', sub:'Join class Rooms, ask doubts, access resources' },
    { id:'faculty', icon:'🧑‍🏫', title:'Faculty', sub:'Create Rooms, manage students, share materials' },
    { id:'institution', icon:'🏫', title:'Institution', sub:'Manage all Rooms and faculty campus-wide' },
    { id:'corporate', icon:'💼', title:'Team / Corp', sub:'Project Rooms, meetings, company workspaces' },
  ];

  const steps = [
    // 0: Welcome
    <div key={0} style={{animation:'fadeUp .28s ease'}}>
      <h2 style={{fontSize:26,fontWeight:800,letterSpacing:'-1px',marginBottom:6}}>Get started</h2>
      <p style={{fontSize:13,color:'var(--text2)',marginBottom:24,lineHeight:1.55}}>Create your Room account. No personal number ever shown to anyone.</p>
      <BtnS onClick={()=>{}}>
        <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
          <GoogleIcon/> Continue with Google
        </span>
      </BtnS>
      <div style={{display:'flex',alignItems:'center',gap:10,margin:'16px 0',color:'var(--text3)',fontSize:11}}>
        <div style={{flex:1,height:1,background:'var(--border)'}}/>or<div style={{flex:1,height:1,background:'var(--border)'}}/>
      </div>
      <BtnP onClick={()=>setStep(1)}>Create an account</BtnP>
      <BtnS onClick={()=>setStep(4)}>Sign in to existing account</BtnS>
      <div style={{fontSize:10,color:'var(--text3)',textAlign:'center',marginTop:14,lineHeight:1.5}}>
        By continuing you agree to Room's <span style={{color:'var(--p)'}}>Terms</span> and <span style={{color:'var(--p)'}}>Privacy Policy</span>
      </div>
    </div>,

    // 1: Role
    <div key={1} style={{animation:'fadeUp .28s ease'}}>
      <Back onClick={()=>setStep(0)}/>
      <Dots total={4} active={1}/>
      <h2 style={{fontSize:24,fontWeight:800,letterSpacing:'-1px',marginBottom:6}}>I am a —</h2>
      <p style={{fontSize:13,color:'var(--text2)',marginBottom:20,lineHeight:1.5}}>Pick your role. This sets up your workspace permissions.</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:20}}>
        {ROLES.map(r=>(
          <div key={r.id} onClick={()=>setRole(r.id)} style={{
            border:`1.5px solid ${role===r.id?'var(--p)':'var(--border)'}`,borderRadius:13,
            padding:'15px 12px',cursor:'pointer',transition:'all .2s',
            background:role===r.id?'var(--ps)':'var(--inp)',textAlign:'center'
          }}>
            <div style={{fontSize:24,marginBottom:7}}>{r.icon}</div>
            <div style={{fontSize:12,fontWeight:600,color:role===r.id?'var(--p)':'var(--text)',marginBottom:2}}>{r.title}</div>
            <div style={{fontSize:10,color:'var(--text2)',lineHeight:1.3}}>{r.sub}</div>
          </div>
        ))}
      </div>
      <BtnP onClick={()=>setStep(2)}>Continue →</BtnP>
    </div>,

    // 2: Register
    <div key={2} style={{animation:'fadeUp .28s ease'}}>
      <Back onClick={()=>setStep(1)}/>
      <Dots total={4} active={2}/>
      <h2 style={{fontSize:24,fontWeight:800,letterSpacing:'-1px',marginBottom:6}}>Create account</h2>
      <p style={{fontSize:13,color:'var(--text2)',marginBottom:20,lineHeight:1.5}}>Your phone number is only for login — never shown to anyone in your Rooms.</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <Input label="First name" placeholder="Rahul" onChange={set('firstName')}/>
        <Input label="Last name" placeholder="Sharma" onChange={set('lastName')}/>
      </div>
      <Input label="Email address" placeholder="rahul@college.edu" type="email" onChange={set('email')}/>
      <Input label="Institution / Organisation" placeholder="Delhi University · Acme Corp" onChange={set('institution')}/>
      <Input label="Your ID (roll number / employee ID)" placeholder="e.g. 2024CS047" onChange={set('id')}/>
      <Input label="Password" placeholder="Min. 8 characters" type="password" onChange={set('password')}/>
      <BtnP onClick={()=>setStep(3)}>Create account →</BtnP>
      <div style={{textAlign:'center',fontSize:12,color:'var(--text2)'}}>
        Already have an account? <button onClick={()=>setStep(4)} style={{background:'none',border:'none',color:'var(--p)',fontSize:12,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>Sign in</button>
      </div>
    </div>,

    // 3: Join
    <div key={3} style={{animation:'fadeUp .28s ease'}}>
      <Dots total={4} active={3}/>
      <div style={{fontSize:11,fontWeight:500,color:'var(--green)',marginBottom:12}}>✓ Account created</div>
      <h2 style={{fontSize:24,fontWeight:800,letterSpacing:'-1px',marginBottom:6}}>Enter a Room</h2>
      <p style={{fontSize:13,color:'var(--text2)',marginBottom:20,lineHeight:1.5}}>Every class and team is a private Room. How would you like to start?</p>
      {[
        { icon:'🔗', title:'Join with invite link or QR', sub:"Your faculty or manager shared an invite — paste it below" },
        { icon:'➕', title:'Create a new Room', sub:'For faculty, managers, and institutions' },
        { icon:'🏫', title:'Browse institution Rooms', sub:'Find your class if your college is on Room' },
      ].map((o,i)=>(
        <div key={i} style={{border:'1.5px solid var(--border)',borderRadius:13,padding:14,marginBottom:9,cursor:'pointer',display:'flex',alignItems:'center',gap:13,background:'var(--inp)',transition:'all .2s'}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--p)';e.currentTarget.style.background='var(--ps)';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--inp)';}}>
          <div style={{width:38,height:38,borderRadius:9,background:'var(--ps)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0}}>{o.icon}</div>
          <div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{o.title}</div>
            <div style={{fontSize:11,color:'var(--text2)'}}>{o.sub}</div>
          </div>
        </div>
      ))}
      <div style={{marginTop:14,marginBottom:14}}>
        <Input label="Paste invite link or Room code" placeholder="room.app/join/XK92PL" onChange={set('code')}/>
      </div>
      <BtnP onClick={onComplete}>Enter Room →</BtnP>
    </div>,

    // 4: Login
    <div key={4} style={{animation:'fadeUp .28s ease'}}>
      <Back onClick={()=>setStep(0)}/>
      <h2 style={{fontSize:24,fontWeight:800,letterSpacing:'-1px',marginBottom:6}}>Welcome back</h2>
      <p style={{fontSize:13,color:'var(--text2)',marginBottom:20,lineHeight:1.5}}>Sign in to access your Rooms.</p>
      <BtnS onClick={()=>{}}>
        <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
          <GoogleIcon/> Continue with Google
        </span>
      </BtnS>
      <div style={{display:'flex',alignItems:'center',gap:10,margin:'14px 0',color:'var(--text3)',fontSize:11}}>
        <div style={{flex:1,height:1,background:'var(--border)'}}/>or sign in with email<div style={{flex:1,height:1,background:'var(--border)'}}/>
      </div>
      <Input label="Email address" placeholder="rahul@college.edu" type="email" onChange={set('email')}/>
      <Input label="Password" placeholder="Your password" type="password" onChange={set('password')}/>
      <div style={{textAlign:'right',marginBottom:14,marginTop:-6}}>
        <button style={{background:'none',border:'none',color:'var(--p)',fontSize:11,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>Forgot password?</button>
      </div>
      <BtnP onClick={onComplete}>Sign in →</BtnP>
      <div style={{textAlign:'center',fontSize:12,color:'var(--text2)'}}>
        New to Room? <button onClick={()=>setStep(1)} style={{background:'none',border:'none',color:'var(--p)',fontSize:12,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>Create account</button>
      </div>
    </div>
  ];

  return (
    <div style={{minHeight:'100vh',display:'grid',gridTemplateColumns:'1fr 460px',overflow:'auto'}}>
      {/* Left */}
      <div style={{background:'var(--bg)',padding:'44px 52px',display:'flex',flexDirection:'column',justifyContent:'space-between',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 55% 45% at 25% 35%, rgba(99,102,241,0.18) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 75% 70%, rgba(139,92,246,0.13) 0%, transparent 65%)',pointerEvents:'none'}}/>
        <div style={{display:'flex',alignItems:'center',gap:11,position:'relative'}}>
          <div style={{width:38,height:38,borderRadius:10,background:'var(--pg)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 18px rgba(99,102,241,0.45)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-5l-4 3v-3H6a3 3 0 0 1-3-3V6z"/></svg>
          </div>
          <span style={{fontSize:20,fontWeight:800,letterSpacing:'-.5px'}}>Room</span>
        </div>
        <div style={{position:'relative'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'var(--ps)',border:'1px solid var(--pb2)',borderRadius:30,padding:'5px 13px',marginBottom:22,fontSize:12,fontWeight:500,color:'var(--p)'}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:'var(--p)',animation:'pulse 2s infinite',display:'inline-block'}}/>
            Now in early access
          </div>
          <h1 style={{fontSize:48,fontWeight:900,lineHeight:1.05,letterSpacing:'-2.5px',marginBottom:16}}>Every class<br/>needs a<br/><span style={{background:'var(--pg)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Room.</span></h1>
          <p style={{fontSize:15,color:'var(--text2)',lineHeight:1.7,marginBottom:38,maxWidth:420}}>
            Replaces WhatsApp groups, missed emails, and paper attendance — for classrooms and corporate teams. Your phone number stays private. Always.
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[
              { icon:'🔒', title:'Your number stays private', sub:'No classmate, faculty, or institution ever sees your personal number' },
              { icon:'🏫', title:'One Room per class or team', sub:'Clean, separate workspaces — no cross-subject mix-up' },
              { icon:'📊', title:'Attendance auto-tracked', sub:'Session records, monthly reports, yearly summaries — automatic' },
              { icon:'💬', title:'Private doubt threads', sub:'1-on-1 with faculty — invisible to classmates, professional always' },
            ].map((f,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:13,background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:13,padding:'13px 16px',transition:'border-color .2s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border2)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                <div style={{width:38,height:38,borderRadius:9,background:'var(--ps)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0}}>{f.icon}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{f.title}</div>
                  <div style={{fontSize:11,color:'var(--text2)',lineHeight:1.35}}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{fontSize:11,color:'var(--text3)',position:'relative'}}>© 2025 Room · room.app</div>
      </div>

      {/* Right */}
      <div style={{background:'var(--bg2)',borderLeft:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 44px'}}>
        <div style={{width:'100%',maxWidth:350}}>
          {steps[step]}
        </div>
      </div>
    </div>
  );
}

const Back = ({onClick}) => (
  <button onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:5,background:'none',border:'none',color:'var(--text3)',fontSize:12,cursor:'pointer',padding:0,fontFamily:'inherit',marginBottom:18,transition:'color .15s'}}
    onMouseEnter={e=>e.currentTarget.style.color='var(--text2)'}
    onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}>
    ← Back
  </button>
);

const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);
