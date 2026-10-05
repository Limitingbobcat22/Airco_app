import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, type ReactNode } from 'react'
import { BrowserRouter } from 'react-router'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { LoginModalProvider, useLoginModal } from '@/hooks/use-login-modal'
import { SidebarProvider } from '@/hooks/use-sidebar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function SessionReauth() {
  const { mustReauthenticate, acknowledgeReauth } = useAuth()
  const { open } = useLoginModal()

  useEffect(() => {
    if (!mustReauthenticate) return
    open('Je sessie is verlopen. Log opnieuw in.')
    acknowledgeReauth()
  }, [mustReauthenticate, acknowledgeReauth, open])

  return null
}

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LoginModalProvider>
            <SessionReauth />
            <SidebarProvider>{children}</SidebarProvider>
          </LoginModalProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}
