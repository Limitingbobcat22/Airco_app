import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { ActiveSectionProvider } from '@/hooks/use-active-section'
import { scrollToPageSection } from '@/lib/page-scroll'
import { consumeSuppressSectionScroll } from '@/lib/section-nav-sync'
import {
  defaultSectionForTopic,
  getSectionFromPath,
  getTopicFromPath,
} from '@/lib/topics'
import { UnsavedChangesProvider } from '@/providers/unsaved-changes'
import Header from '../shared/header'
import MobileSidebar from '../shared/mobile-sidebar'
import Sidebar from '../shared/sidebar'

export default function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const isFirstLoad = useRef(true)
  const prevPathRef = useRef(pathname)
  const topic = getTopicFromPath(pathname)
  const section = getSectionFromPath(pathname)

  useEffect(() => {
    const prevPath = prevPathRef.current
    prevPathRef.current = pathname

    if (consumeSuppressSectionScroll()) return

    const isDefaultSection =
      topic != null && section === defaultSectionForTopic(topic)

    if (isFirstLoad.current) {
      isFirstLoad.current = false
      if (isDefaultSection) return

      requestAnimationFrame(() => {
        scrollToPageSection(section, 'auto')
      })
      return
    }

    if (!topic) return

    const prevTopic = getTopicFromPath(prevPath)
    if (section === 'home' || (prevTopic != null && prevTopic !== topic && isDefaultSection)) {
      scrollToPageSection(null, 'smooth')
      return
    }

    scrollToPageSection(section, 'smooth')
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
