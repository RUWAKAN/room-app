import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ntibsdswcrryplxcubhg.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aWJzZHN3Y3JyeXBseGN1YmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwODMzNTIsImV4cCI6MjEwMTY1OTM1Mn0.srWnb3hOeao4dXrKqBkW65-1345vyLQ25CCM7dPn_Pc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// AUTH
export const signUpWithEmail = async (email, password, name, institution) => {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: name, institution } }
  })
  return { data, error }
}

export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/room-app/' }
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// PROFILE
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles').select('*').eq('id', userId).single()
  return { data, error }
}

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles').update(updates).eq('id', userId).select().single()
  return { data, error }
}

// ROOMS
export const createRoom = async (room, userId) => {
  const { data, error } = await supabase
    .from('rooms').insert({ ...room, created_by: userId }).select().single()
  if (!error && data) {
    await supabase.from('room_members').insert({
      room_id: data.id, user_id: userId, role: 'owner'
    })
  }
  return { data, error }
}

export const getUserRooms = async (userId) => {
  const { data, error } = await supabase
    .from('room_members')
    .select(`role, class_id, rooms(*)`)
    .eq('user_id', userId)
  return { data, error }
}

export const getRoomByCode = async (code) => {
  const { data, error } = await supabase
    .from('rooms').select('*').eq('invite_code', code.toUpperCase()).single()
  return { data, error }
}

export const joinRoom = async (roomId, userId, classId, role = 'student') => {
  const { data, error } = await supabase
    .from('room_members')
    .insert({ room_id: roomId, user_id: userId, class_id: classId, role })
    .select().single()
  return { data, error }
}

export const getRoomMembers = async (roomId) => {
  const { data, error } = await supabase
    .from('room_members')
    .select(`*, profiles(*)`)
    .eq('room_id', roomId)
  return { data, error }
}

// MESSAGES
export const getMessages = async (roomId) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`*, profiles(id, name, avatar_url)`)
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(100)
  return { data, error }
}

export const sendMessage = async (roomId, senderId, text, fileData = null) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({ room_id: roomId, sender_id: senderId, text, ...fileData })
    .select(`*, profiles(id, name, avatar_url)`).single()
  return { data, error }
}

export const subscribeToMessages = (roomId, callback) => {
  return supabase.channel(`messages:${roomId}`)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'messages',
      filter: `room_id=eq.${roomId}`
    }, async (payload) => {
      const { data } = await supabase
        .from('messages')
        .select(`*, profiles(id, name, avatar_url)`)
        .eq('id', payload.new.id).single()
      if (data) callback(data)
    })
    .subscribe()
}

// NOTICES
export const getNotices = async (roomId) => {
  const { data, error } = await supabase
    .from('notices')
    .select(`*, profiles(id, name)`)
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const postNotice = async (roomId, authorId, notice) => {
  const { data, error } = await supabase
    .from('notices')
    .insert({ room_id: roomId, author_id: authorId, ...notice })
    .select(`*, profiles(id, name)`).single()
  return { data, error }
}

export const markNoticeRead = async (noticeId, userId) => {
  const { data: notice } = await supabase
    .from('notices').select('read_by').eq('id', noticeId).single()
  if (notice && !notice.read_by.includes(userId)) {
    await supabase.from('notices')
      .update({ read_by: [...notice.read_by, userId] })
      .eq('id', noticeId)
  }
}

// ATTENDANCE
export const getAttendance = async (roomId, userId) => {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .order('session_date', { ascending: false })
  return { data, error }
}

export const markAttendance = async (roomId, records, markedBy) => {
  const inserts = records.map(r => ({
    room_id: roomId, user_id: r.userId,
    session_date: r.date, topic: r.topic,
    status: r.status, marked_by: markedBy
  }))
  const { data, error } = await supabase
    .from('attendance').upsert(inserts).select()
  return { data, error }
}

// FILE UPLOAD
export const uploadFile = async (file, roomId) => {
  const ext = file.name.split('.').pop()
  const path = `${roomId}/${Date.now()}.${ext}`
  const { data, error } = await supabase.storage
    .from('room-files').upload(path, file)
  if (error) return { error }
  const { data: { publicUrl } } = supabase.storage
    .from('room-files').getPublicUrl(path)
  return { url: publicUrl, name: file.name, type: file.type }
}
