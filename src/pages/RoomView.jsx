import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context';
import * as db from '../supabase';

const TABS = ['chat', 'notices', 'resources', 'members', 'attendance'];

export default function RoomView({ room }) {
  const { openModal, handleSendMessage, showToast, user, profile } = useApp();
  const [tab, setTab] = useState('chat');
  const [showInfo, setShowInfo] = useState(false);
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [notices, setNotices] = useState([]);
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [uploading, setUploading] = useState(false);
  const chatRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => { setTab('chat'); loadData(); }, [room.id]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const loadData = async () => {
    const [msgs, ntcs, mems, att] = await Promise.all([
      db.getMessages(room.id),
      db.getNotices(room.id),
      db.getRoomMembers(room.id),
      db.getAttendance(room.id, user.id),
    ]);
    if (msgs.data) setMessages(msgs.data);
    if (ntcs.data) setNotices(ntcs.data);
    if (mems.data) setMembers(mems.data);
    if (att.data) setAttendance(att.data);
  };

  // Real-time messages
  useEffect(() => {
    const sub = db.subscribeToMessages(room.id, (newMsg) => {
      setMessages(prev => [...prev, newMsg]);
    });
    return () => sub.unsubscribe();
  }, [room.id]);

  const send = async () => {
    if (!msg.trim()) return;
    const text = msg.trim();
    setMsg('');
    await handleSendMessage(room.id, text);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const result = await db.uploadFile(file, room.id);
    if (result.error) { showToast('Upload failed: ' + result.error.message, 'error'); }
    else { await handleSendMessage(room.id, null, { file_url: result.url, file_name: result.name, file_type: result.type }); showToast('File shared ✓'); }
    setUploading(false);
  };

  const tabLabel = { chat: '💬 Chat', notices: '📢 Notices', resources: '📁 Resources', members: '👥 Members', attendance: '📊 Attendance' };
  const attended = attendance.filter(a => a.status === 'present').length;
  const total = attendance.length;
  const percent = total > 0 ? Math.round((attended / total) * 100) : 0;

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';
  const getColor = (id) => { const colors = ['#6366F1','#10B981','#F59E0B','#EC4899','#8B5CF6','#14B8A6']; return colors[id?.charCodeAt(0) % colors.length] || '#6366F1'; };

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{ padding: '0 20px', height: 58, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, background: 'var(--bg2)' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: room.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{room.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.3px' }}>{room.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{room.subject} · {room.type} · {members.length} members</div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {room.myRole !== 'student' && <TbBtn icon="🔗" tip="Invite" onClick={() => openModal('invite')} />}
            {room.myRole !== 'student' && <TbBtn icon="📢" tip="Post notice" onClick={() => openModal('post-notice')} />}
            <TbBtn icon="ℹ️" tip="Info" active={showInfo} onClick={() => setShowInfo(v => !v)} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', padding: '0 20px', flexShrink: 0 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '11px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              border: 'none', borderBottom: `2px solid ${tab === t ? 'var(--p)' : 'transparent'}`,
              background: 'transparent', color: tab === t ? 'var(--p)' : 'var(--text2)',
              transition: 'all .15s', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5
            }}>{tabLabel[t]}{t === 'notices' && notices.length > 0 && <span style={{ background: 'var(--red)', color: '#fff', fontSize: 10, padding: '1px 5px', borderRadius: 8 }}>{notices.length}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {/* CHAT */}
          {tab === 'chat' && (
            <>
              <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {messages.length === 0 && <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text3)', fontSize: 13 }}>No messages yet. Say hello! 👋</div>}
                {messages.map(m => {
                  const isMe = m.sender_id === user.id;
                  const senderName = m.profiles?.name || 'Unknown';
                  const initials = getInitials(senderName);
                  const color = getColor(m.sender_id);
                  return (
                    <div key={m.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff', flexShrink: 0 }}>{initials}</div>
                      <div style={{ maxWidth: '65%' }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 3, textAlign: isMe ? 'right' : 'left' }}>{isMe ? 'You' : senderName}</div>
                        {m.text && <div style={{ padding: '10px 13px', borderRadius: 14, fontSize: 13, lineHeight: 1.5, background: isMe ? 'var(--pg)' : 'var(--bg3)', color: isMe ? '#fff' : 'var(--text)', borderBottomRightRadius: isMe ? 4 : 14, borderBottomLeftRadius: isMe ? 14 : 4 }}>{m.text}</div>}
                        {m.file_url && (
                          <a href={m.file_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 10, marginTop: m.text ? 4 : 0, cursor: 'pointer', border: '1px solid var(--border)' }}>
                              <span style={{ fontSize: 22 }}>{m.file_type?.includes('image') ? '🖼️' : m.file_type?.includes('pdf') ? '📄' : '📎'}</span>
                              <div>
                                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{m.file_name}</div>
                                <div style={{ fontSize: 10, color: 'var(--text3)' }}>Tap to open</div>
                              </div>
                            </div>
                          </a>
                        )}
                        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4, textAlign: isMe ? 'right' : 'left' }}>
                          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{isMe ? ' ✓✓' : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleFileUpload} />
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg2)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--inp)', border: '1px solid var(--border2)', borderRadius: 13, padding: '10px 14px' }}>
                  <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ background: 'none', border: 'none', fontSize: 17, cursor: 'pointer', color: 'var(--text2)' }}>{uploading ? '⏳' : '📎'}</button>
                  <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                    placeholder={`Message ${room.name}…`}
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)', fontFamily: 'inherit' }} />
                  <button onClick={send} style={{ width: 34, height: 34, borderRadius: 9, border: 'none', background: 'var(--pg)', cursor: 'pointer', fontSize: 15, color: '#fff', boxShadow: '0 2px 10px rgba(99,102,241,0.4)' }}>➤</button>
                </div>
              </div>
            </>
          )}

          {/* NOTICES */}
          {tab === 'notices' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              {room.myRole !== 'student' && (
                <button onClick={() => openModal('post-notice')} style={{ marginBottom: 16, padding: '9px 16px', background: 'var(--ps)', border: '1px solid var(--pb2)', borderRadius: 9, color: 'var(--p)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>📢 Post a new notice</button>
              )}
              {notices.length === 0 && <EmptyState icon="📢" title="No notices yet" sub="Notices from faculty will appear here." />}
              {notices.map(n => (
                <div key={n.id} onClick={() => db.markNoticeRead(n.id, user.id)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 13, padding: 16, marginBottom: 12, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}>{n.priority === 'high' ? '📌' : '📋'}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.2px', marginBottom: 3 }}>{n.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{n.profiles?.name} · {new Date(n.created_at).toLocaleDateString()}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 20, background: n.priority === 'high' ? 'var(--reds)' : 'var(--ps)', color: n.priority === 'high' ? 'var(--red)' : 'var(--p)' }}>{n.priority}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 12 }}>{n.body}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>👁️ {n.read_by?.length || 0} of {members.length} read</div>
                    <div style={{ fontSize: 11, color: n.read_by?.length === members.length ? 'var(--green)' : 'var(--amber)' }}>
                      {n.read_by?.includes(user.id) ? '✓ You read this' : 'Tap to mark read'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MEMBERS */}
          {tab === 'members' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>{members.length} members · Privacy: phone numbers hidden from everyone</div>
              <SectionHead>Faculty & Owners</SectionHead>
              {members.filter(m => ['owner', 'faculty'].includes(m.role)).map(m => (
                <MemberRow key={m.id} m={m} isYou={m.user_id === user.id} />
              ))}
              <SectionHead>Students</SectionHead>
              {members.filter(m => m.role === 'student').map(m => (
                <MemberRow key={m.id} m={m} isYou={m.user_id === user.id} />
              ))}
            </div>
          )}

          {/* ATTENDANCE */}
          {tab === 'attendance' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
                <ACard n={`${percent}%`} l="Your attendance" color={percent >= 75 ? 'var(--green)' : 'var(--amber)'} />
                <ACard n={`${attended}/${total}`} l="Sessions attended" />
                <ACard n={total - attended} l="Missed" color="var(--amber)" />
              </div>
              {attendance.length === 0 && <EmptyState icon="📊" title="No sessions recorded" sub="Attendance will appear here once faculty marks sessions." />}
              {attendance.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 10px', borderRadius: 9, marginBottom: 2, transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ fontSize: 12, color: 'var(--text2)', width: 80, flexShrink: 0 }}>{new Date(s.session_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  <span style={{ fontSize: 12, color: 'var(--text)', flex: 1 }}>{s.topic || 'Session'}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 20, background: s.status === 'present' ? 'var(--greens)' : 'var(--reds)', color: s.status === 'present' ? 'var(--green)' : 'var(--red)' }}>{s.status}</span>
                </div>
              ))}
              {percent < 75 && total > 0 && (
                <div style={{ marginTop: 16, padding: 12, background: 'var(--ambers)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 9, fontSize: 12, color: 'var(--amber)' }}>
                  ⚠️ Your attendance is below 75%. Please attend upcoming sessions.
                </div>
              )}
            </div>
          )}

          {/* RESOURCES */}
          {tab === 'resources' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              <EmptyState icon="📁" title="Resources coming soon" sub="File sharing is available in chat. Dedicated resource library coming in next update." />
            </div>
          )}
        </div>
      </div>

      {/* Info panel */}
      {showInfo && (
        <div style={{ width: 248, borderLeft: '1px solid var(--border)', background: 'var(--bg2)', flexShrink: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <InfoSection title="Room info">
            <InfoRow icon="🏫" label="Type" val={room.type} />
            <InfoRow icon="📚" label="Subject" val={room.subject || '—'} />
            <InfoRow icon="👥" label="Members" val={members.length} />
            <InfoRow icon="🔑" label="Code" val={room.invite_code} valColor="var(--p)" />
          </InfoSection>
          <InfoSection title="Your identity">
            <InfoRow icon="🪪" label="Role" val={room.myRole} valColor="var(--p)" />
            <InfoRow icon="🔒" label="Phone" val="Hidden" valColor="var(--green)" />
          </InfoSection>
          <InfoSection title="Quick actions">
            {room.myRole !== 'student' && <ActionBtn onClick={() => openModal('invite')}>🔗 Invite members</ActionBtn>}
            {room.myRole !== 'student' && <ActionBtn onClick={() => openModal('post-notice')}>📢 Post notice</ActionBtn>}
            <ActionBtn onClick={() => showToast('Opening Meet…')} color="var(--greens)" textColor="var(--green)">🎥 Join via Google Meet</ActionBtn>
          </InfoSection>
        </div>
      )}
    </div>
  );
}

const TbBtn = ({ icon, tip, active, onClick }) => (
  <button onClick={onClick} title={tip} style={{ width: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', background: active ? 'var(--ps)' : 'transparent', color: active ? 'var(--p)' : 'var(--text2)', fontFamily: 'inherit' }}
  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text)'; } }}
  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)'; } }}
  >{icon}</button>
);
const SectionHead = ({ children }) => <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.06em', margin: '14px 0 8px' }}>{children}</div>;
const MemberRow = ({ m, isYou }) => {
  const name = m.profiles?.name || 'Unknown';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];
  const color = colors[m.user_id?.charCodeAt(0) % colors.length] || '#6366F1';
  const badges = { owner: { bg: 'var(--ambers)', color: 'var(--amber)', label: 'Owner' }, faculty: { bg: 'var(--ps)', color: 'var(--p)', label: 'Faculty' }, student: { bg: 'var(--greens)', color: 'var(--green)', label: isYou ? 'You' : 'Student' } };
  const badge = badges[m.role] || badges.student;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, marginBottom: 2, transition: 'background .15s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#fff', flexShrink: 0 }}>{initials}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{name}{isYou ? ' (you)' : ''}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{m.class_id || m.role}</div>
      </div>
      <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 20, background: badge.bg, color: badge.color }}>{badge.label}</span>
    </div>
  );
};
const ACard = ({ n, l, color }) => (
  <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, textAlign: 'center' }}>
    <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.5px', marginBottom: 3, color: color || 'var(--text)' }}>{n}</div>
    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{l}</div>
  </div>
);
const InfoSection = ({ title, children }) => (
  <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text3)', marginBottom: 12 }}>{title}</div>
    {children}
  </div>
);
const InfoRow = ({ icon, label, val, valColor }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
    <span style={{ fontSize: 14, color: 'var(--text3)' }}>{icon}</span>
    <span style={{ fontSize: 11, color: 'var(--text2)', flex: 1 }}>{label}</span>
    <span style={{ fontSize: 12, fontWeight: 500, color: valColor || 'var(--text)' }}>{val}</span>
  </div>
);
const ActionBtn = ({ onClick, children, color, textColor }) => (
  <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, background: color || 'var(--ps)', border: `1px solid ${color ? 'rgba(16,185,129,0.25)' : 'var(--pb2)'}`, borderRadius: 9, padding: '10px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: textColor || 'var(--p)', marginBottom: 8 }}>{children}</div>
);
const EmptyState = ({ icon, title, sub }) => (
  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
    <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{sub}</div>
  </div>
);
