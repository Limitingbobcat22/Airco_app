import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  fetchSession,
  SessionUnauthorizedError,
  type AuthUser,
} from '@/lib/api/auth'

const TOKEN_KEY = 'airco_access_token'
const USER_KEY = 'airco_user'

type AuthContextValue = {
  isLoggedIn: boolean
  user: AuthUser | null
  token: string | null
  /** Tijdstip van de laatste login in deze tab; null bij sessieherstel. */
  lastLoginAt: number | null
  /** False zolang een opgeslagen token nog gecontroleerd wordt. */
  isReady: boolean
  /** True als de opgeslagen token bij het opstarten ongeldig bleek. */
  mustReauthenticate: boolean
  acknowledgeReauth: () => void
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  )
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())
  const [lastLoginAt, setLastLoginAt] = useState<number | null>(null)
  const [isReady, setIsReady] = useState(
    () => !localStorage.getItem(TOKEN_KEY),
  )
  const [mustReauthenticate, setMustReauthenticate] = useState(false)
  const sessionCheck = useRef(0)

  const login = useCallback((nextToken: string, nextUser: AuthUser) => {
    sessionCheck.current += 1
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
    setLastLoginAt(Date.now())
    setMustReauthenticate(false)
    setIsReady(true)
  }, [])

  const logout = useCallback(() => {
    sessionCheck.current += 1
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
    setLastLoginAt(null)
    setMustReauthenticate(false)
    setIsReady(true)
  }, [])

  const acknowledgeReauth = useCallback(() => {
    setMustReauthenticate(false)
  }, [])

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (!storedToken) return

    const checkId = sessionCheck.current
    let cancelled = false

    void fetchSession(storedToken)
      .then((nextUser) => {
        if (cancelled || sessionCheck.current !== checkId) return
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
        setToken(storedToken)
        setUser(nextUser)
      })
      .catch((error: unknown) => {
        if (cancelled || sessionCheck.current !== checkId) return
        if (!(error instanceof SessionUnauthorizedError)) return
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setToken(null)
        setUser(null)
        setLastLoginAt(null)
        setMustReauthenticate(true)
      })
      .finally(() => {
        if (cancelled || sessionCheck.current !== checkId) return
        setIsReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({
      isLoggedIn: Boolean(token && user),
      user,
      token,
      lastLoginAt,
      isReady,
      mustReauthenticate,
      acknowledgeReauth,
      login,
      logout,
    }),
    [
      token,
      user,
      lastLoginAt,
      isReady,
      mustReauthenticate,
      acknowledgeReauth,
      login,
      logout,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth moet binnen AuthProvider gebruikt worden')
  }
  return ctx
}
