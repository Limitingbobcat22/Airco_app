import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import Header from '../shared/header'
import MobileSidebar from '../shared/mobile-sidebar'
import Sidebar from '../shared/sidebar'

export default function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { hash } = useLocation()
  const isFirstHash = useRef(true)

  useEffect(() => {
    if (isFirstHash.current) {
      isFirstHash.current = false
      document.getElementById('page-scroll')?.scrollTo({ top: 0 })
      return
    }

    if (!hash) {
      document.getElementById('page-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  return (
    <div className="bg-secondary flex h-svh overflow-hidden">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="relative z-10 flex h-16 shrink-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
        </div>
        <main className="bg-background relative mx-2 mb-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl focus:outline-none md:mx-0 md:mb-4 md:mr-4">
          {children}
        </main>
      </div>
    </div>
  )
}
