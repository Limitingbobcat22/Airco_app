import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type LoginModalContextValue = {
  isOpen: boolean
  notice: string | null
  open: (notice?: string) => void
  close: () => void
}

const LoginModalContext = createContext<LoginModalContextValue | null>(null)

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const open = useCallback((nextNotice?: string) => {
    setNotice(nextNotice ?? null)
    setIsOpen(true)
  }, [])
  const close = useCallback(() => {
    setIsOpen(false)
    setNotice(null)
  }, [])

  const value = useMemo(
    () => ({ isOpen, notice, open, close }),
    [isOpen, notice, open, close],
  )

  return (
    <LoginModalContext.Provider value={value}>
      {children}
    </LoginModalContext.Provider>
  )
}

export function useLoginModal() {
  const ctx = useContext(LoginModalContext)
  if (!ctx) {
    throw new Error('useLoginModal moet binnen LoginModalProvider gebruikt worden')
  }
  return ctx
}
