import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/db'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        try { setProfile(await getProfile(session.user.id)) } catch {}
      }
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        try { setProfile(await getProfile(session.user.id)) } catch {}
      } else { setProfile(null) }
    })
    return () => subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, profile, loading, setProfile }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
