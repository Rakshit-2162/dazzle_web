import { useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAuthStore } from '../../../store/authStore'
import { authService } from '../services/authService'

export const useAuth = () => {
  const { setUser, setLoading, clearAuth } = useAuthStore()

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true)
        const result = await supabase.auth.getSession()
        const session = result?.data?.session

        if (session?.user) {
          const { data: profile } = await authService.getUserProfile(session.user.id)
          setUser(profile)
        } else {
          clearAuth()
        }
      } catch {
        clearAuth()
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          authService.getUserProfile(session.user.id).then(({ data: profile }) => {
            setUser(profile)
            setLoading(false)
          })
        } else if (event === 'SIGNED_OUT') {
          clearAuth()
        }
      }
    )

    return () => authListener?.subscription?.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}