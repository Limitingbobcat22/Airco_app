import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { ActiveSectionProvider } from '@/hooks/use-active-section'
import {
  getSectionFromPath,
  getTopicFromPath,
} from '@/lib/topics'
import { consumeSuppressSectionScroll } from '@/lib/section-nav-sync'
import { UnsavedChangesProvider } from '@/providers/unsaved-changes'
import Header from '../shared/header'
import MobileSidebar from '../shared/mobile-sidebar'
import Sidebar from '../shared/sidebar'

function scrollToSection(sectionId: string | null, behavior: ScrollBehavior) {
  const root = document.getElementById('page-scroll')
  if (!root) return

  if (!sectionId) {
    root.scrollTo({ top: 0, behavior })
    return
  }

  const target = document.getElementById(sectionId)
  if (!target) return
  target.scrollIntoView({ behavior })
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const isFirstLoad = useRef(true)
  const topic = getTopicFromPath(pathname)
  const section = getSectionFromPath(pathname)

  useEffect(() => {
    if (consumeSuppressSectionScroll()) return

    if (isFirstLoad.current) {
      isFirstLoad.current = false
      requestAnimationFrame(() => {
        scrollToSection(section, 'auto')
      })
      return
    }

    if (!topic) return
    scrollToSection(section, 'smooth')
  }, [pathname, section, topic])

  return (
    <UnsavedChangesProvider>
      <ActiveSectionProvider>
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
      </ActiveSectionProvider>
    </UnsavedChangesProvider>
  )
}
