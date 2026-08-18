import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

const SidebarContext = createContext({
  isMinimized: false,
  toggle: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isMinimized, setIsMinimized] = useState(false)

  const toggle = () => {
    setIsMinimized((current) => !current)
  }

  return (
    <SidebarContext.Provider value={{ isMinimized, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}
