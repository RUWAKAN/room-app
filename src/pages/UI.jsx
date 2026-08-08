export const Btn = ({ children, onClick, variant='primary', loading, disabled, style={}, ...p }) => {
  const styles = {
    primary: { background:'var(--pg)', color:'#fff', border:'none', boxShadow:'0 4px 16px rgba(99,102,241,0.35)' },
    secondary: { background:'var(--inp)', color:'var(--text)', border:'1.5px solid var(--border)' },
    ghost: { background:'none', color:'var(--p)', border:'none', padding:'0' },
    danger: { background:'var(--reds)', color:'var(--red)', border:'1px solid rgba(248,113,113,0.2)' },
  }
  return (
    <button onClick={onClick} disabled={disabled||loading} {...p}
      style={{ padding:'10px 18px', borderRadius:10, fontSize:13, fontWeight:600,
        cursor: (disabled||loading)?'not-allowed':'pointer', opacity:(disabled||loading)?0.6:1,
        transition:'all .15s', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        ...styles[variant], ...style }}>
      {loading ? <div className="spinner"/> : children}
    </button>
  )
}

export const Input = ({ label, hint, error, ...p }) => (
  <div style={{ marginBottom:14 }}>
    {label && <label style={{ display:'block', fontSize:11, fontWeight:500, color:'var(--text2)', marginBottom:5 }}>{label}</label>}
    <input {...p} style={{ width:'100%', padding:'11px 14px', background:'var(--inp)',
      border:`1.5px solid ${error?'var(--red)':'var(--border)'}`, borderRadius:10,
      color:'var(--text)', fontSize:13, outline:'none', transition:'all .2s' }}
      onFocus={e=>{e.target.style.borderColor='var(--p)';e.target.style.background='var(--inp-f)';}}
      onBlur={e=>{e.target.style.borderColor=error?'var(--red)':'var(--border)';e.target.style.background='var(--inp)';}}
    />
    {hint && <div style={{ fontSize:10, color:'var(--text3)', marginTop:4 }}>{hint}</div>}
    {error && <div style={{ fontSize:10, color:'var(--red)', marginTop:4 }}>{error}</div>}
  </div>
)

export const Select = ({ label, children, ...p }) => (
  <div style={{ marginBottom:14 }}>
    {label && <label style={{ display:'block', fontSize:11, fontWeight:500, color:'var(--text2)', marginBottom:5 }}>{label}</label>}
    <select {...p} style={{ width:'100%', padding:'11px 14px', background:'var(--inp)',
      border:'1.5px solid var(--border)', borderRadius:10, color:'var(--text)', fontSize:13,
      outline:'none', cursor:'pointer' }}>{children}</select>
  </div>
)

export const Card = ({ children, style={}, ...p }) => (
  <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:14, ...style }} {...p}>
    {children}
  </div>
)

export const Badge = ({ children, color='blue' }) => {
  const colors = {
    blue: { bg:'var(--ps)', color:'var(--p)' },
    green: { bg:'var(--greens)', color:'var(--green)' },
    amber: { bg:'var(--ambers)', color:'var(--amber)' },
    red: { bg:'var(--reds)', color:'var(--red)' },
  }
  return <span style={{ fontSize:10, fontWeight:500, padding:'3px 8px', borderRadius:20, ...colors[color] }}>{children}</span>
}

export const Avatar = ({ name='?', color='#6366F1', size=36 }) => (
  <div style={{ width:size, height:size, borderRadius:'50%', background:color,
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:size*0.35, fontWeight:700, color:'#fff', flexShrink:0 }}>
    {name?.charAt(0)?.toUpperCase() || '?'}
  </div>
)

export const Empty = ({ icon, title, sub }) => (
  <div style={{ textAlign:'center', padding:'50px 20px' }}>
    <div style={{ fontSize:36, marginBottom:12 }}>{icon}</div>
    <div style={{ fontSize:14, fontWeight:600, marginBottom:6 }}>{title}</div>
    <div style={{ fontSize:12, color:'var(--text3)' }}>{sub}</div>
  </div>
)

export const Toast = ({ msg, type='info' }) => {
  if (!msg) return null
  const colors = { info:'var(--bg3)', success:'var(--greens)', error:'var(--reds)' }
  return (
    <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)',
      background:colors[type]||colors.info, border:'1px solid var(--border2)',
      borderRadius:10, padding:'11px 18px', fontSize:13, fontWeight:500,
      zIndex:9999, whiteSpace:'nowrap', boxShadow:'var(--shadow-sm)',
      animation:'fadeUp .3s ease', pointerEvents:'none' }}>
      {type==='success'?'✓ ':type==='error'?'✕ ':''}{msg}
    </div>
  )
}

export const Modal = ({ show, onClose, title, sub, children, width=420 }) => {
  if (!show) return null
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)',
      zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center',
      backdropFilter:'blur(4px)' }} onClick={onClose}>
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border2)',
        borderRadius:18, padding:28, width, maxWidth:'90vw', position:'relative',
        boxShadow:'var(--shadow)', animation:'fadeUp .25s ease' }}
        onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16,
          background:'var(--bg3)', border:'none', borderRadius:8, width:32, height:32,
          cursor:'pointer', fontSize:16, color:'var(--text2)' }}>✕</button>
        {title && <h3 style={{ fontSize:18, fontWeight:800, letterSpacing:'-.5px', marginBottom:6 }}>{title}</h3>}
        {sub && <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.5, marginBottom:20 }}>{sub}</p>}
        {children}
      </div>
    </div>
  )
}
