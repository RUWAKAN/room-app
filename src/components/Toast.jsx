import { useApp } from '../context';
import { useEffect, useState } from 'react';

export default function Toast() {
  const { toast } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) { setTimeout(() => setVisible(true), 10); }
    else { setVisible(false); }
  }, [toast]);

  if (!toast) return null;
  return (
    <div style={{
      position:'fixed', bottom:24, left:'50%',
      transform:`translateX(-50%) translateY(${visible?0:80}px)`,
      background:'var(--bg3)', border:'1px solid var(--border2)',
      borderRadius:10, padding:'11px 18px', fontSize:13, fontWeight:500,
      color:'var(--text)', zIndex:9999, transition:'transform .3s',
      whiteSpace:'nowrap', boxShadow:'var(--shadow-sm)', pointerEvents:'none'
    }}>
      {toast.msg}
    </div>
  );
}
