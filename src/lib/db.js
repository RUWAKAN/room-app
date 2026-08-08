import { supabase } from './supabase'

// AUTH
export const signUp = async ({ email, password, fullName, institutionId, institution, role }) => {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName, institution_id: institutionId, institution, role } }
  })
  if (error) throw error
  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id, email, full_name: fullName,
      institution_id: institutionId, institution, role,
      created_at: new Date().toISOString()
    })
  }
  return data
}

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/dashboard` }
  })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export const getProfile = async (userId) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data
}

// ROOMS
export const createRoom = async ({ name, type, subject, description, ownerId, code }) => {
  const { data, error } = await supabase.from('rooms').insert({
    name, type, subject, description, owner_id: ownerId,
    code, created_at: new Date().toISOString()
  }).select().single()
  if (error) throw error
  await supabase.from('room_members').insert({
    room_id: data.id, user_id: ownerId, role: 'owner', joined_at: new Date().toISOString()
  })
  return data
}

export const getRooms = async (userId) => {
  const { data, error } = await supabase
    .from('room_members')
    .select('room_id, role, rooms(*)')
    .eq('user_id', userId)
  if (error) throw error
  return data.map(m => ({ ...m.rooms, member_role: m.role }))
}

export const getRoomById = async (roomId) => {
  const { data, error } = await supabase.from('rooms').select('*').eq('id', roomId).single()
  if (error) throw error
  return data
}

export const joinRoomByCode = async (code, userId, institutionId) => {
  const { data: room, error: rErr } = await supabase.from('rooms').select('*').eq('code', code).single()
  if (rErr) throw new Error('Room not found. Check the code and try again.')
  const { data: existing } = await supabase.from('room_members')
    .select('id').eq('room_id', room.id).eq('user_id', userId).single()
  if (existing) throw new Error('You are already a member of this Room.')
  await supabase.from('room_members').insert({
    room_id: room.id, user_id: userId, role: 'student',
    institution_id: institutionId, joined_at: new Date().toISOString()
  })
  return room
}

export const getRoomMembers = async (roomId) => {
  const { data, error } = await supabase
    .from('room_members')
    .select('*, profiles(*)')
    .eq('room_id', roomId)
  if (error) throw error
  return data
}

// MESSAGES
export const getMessages = async (roomId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*, profiles(full_name, institution_id, role)')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export const sendMessage = async ({ roomId, userId, content, fileUrl, fileName, fileType }) => {
  const { data, error } = await supabase.from('messages').insert({
    room_id: roomId, user_id: userId, content,
    file_url: fileUrl, file_name: fileName, file_type: fileType,
    created_at: new Date().toISOString()
  }).select('*, profiles(full_name, institution_id, role)').single()
  if (error) throw error
  return data
}

export const subscribeToMessages = (roomId, callback) => {
  return supabase.channel(`room-${roomId}`)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'messages',
      filter: `room_id=eq.${roomId}`
    }, payload => callback(payload.new))
    .subscribe()
}

// NOTICES
export const getNotices = async (roomId) => {
  const { data, error } = await supabase
    .from('notices')
    .select('*, profiles(full_name)')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const createNotice = async ({ roomId, userId, title, body, priority }) => {
  const { data, error } = await supabase.from('notices').insert({
    room_id: roomId, user_id: userId, title, body, priority,
    created_at: new Date().toISOString()
  }).select('*, profiles(full_name)').single()
  if (error) throw error
  return data
}

export const markNoticeRead = async (noticeId, userId) => {
  await supabase.from('notice_reads').upsert({
    notice_id: noticeId, user_id: userId, read_at: new Date().toISOString()
  })
  const { count } = await supabase.from('notice_reads')
    .select('*', { count: 'exact' }).eq('notice_id', noticeId)
  return count
}

// RESOURCES
export const getResources = async (roomId) => {
  const { data, error } = await supabase
    .from('resources')
    .select('*, profiles(full_name)')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const uploadResource = async ({ roomId, userId, file }) => {
  const path = `${roomId}/${Date.now()}-${file.name}`
  const { error: upErr } = await supabase.storage.from('resources').upload(path, file)
  if (upErr) throw upErr
  const { data: { publicUrl } } = supabase.storage.from('resources').getPublicUrl(path)
  const { data, error } = await supabase.from('resources').insert({
    room_id: roomId, user_id: userId, name: file.name,
    url: publicUrl, size: file.size, type: file.type,
    created_at: new Date().toISOString()
  }).select('*, profiles(full_name)').single()
  if (error) throw error
  return data
}

// ATTENDANCE
export const getAttendance = async (roomId, userId) => {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .order('session_date', { ascending: false })
  if (error) throw error
  return data
}

export const markAttendance = async ({ roomId, userId, sessionDate, topic, status }) => {
  const { data, error } = await supabase.from('attendance').upsert({
    room_id: roomId, user_id: userId,
    session_date: sessionDate, topic, status,
    marked_at: new Date().toISOString()
  }).select().single()
  if (error) throw error
  return data
}

export const getAttendanceSummary = async (roomId, userId) => {
  const { data, error } = await supabase
    .from('attendance')
    .select('status')
    .eq('room_id', roomId)
    .eq('user_id', userId)
  if (error) throw error
  const total = data.length
  const attended = data.filter(r => r.status === 'present').length
  return { total, attended, percent: total > 0 ? Math.round((attended / total) * 100) : 0 }
}

// GENERATE ROOM CODE
export const generateCode = () => Math.random().toString(36).substr(2, 6).toUpperCase()
