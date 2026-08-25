import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from '@/hooks/use-auth'
import { LoginModalProvider } from '@/hooks/use-login-modal'
import { SidebarProvider } from '@/hooks/use-sidebar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LoginModalProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </LoginModalProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}
