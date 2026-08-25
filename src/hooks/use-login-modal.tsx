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
  open: () => void
  close: () => void
}

const LoginModalContext = createContext<LoginModalContextValue | null>(null)

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo(
    () => ({ isOpen, open, close }),
    [isOpen, open, close],
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
