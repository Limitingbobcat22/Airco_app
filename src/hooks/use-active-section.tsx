import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router'
import {
  getSectionFromPath,
  getTopicFromPath,
  TOPIC_SECTIONS,
  topicSectionPath,
} from '@/lib/topics'
import { markPathUpdatedFromScroll } from '@/lib/section-nav-sync'

const ActiveSectionContext = createContext('')

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const topic = getTopicFromPath(pathname)
  const sectionIds = topic ? TOPIC_SECTIONS[topic] : []
  const pathSection = getSectionFromPath(pathname)
  const lockUntilRef = useRef(0)
  const activeIdRef = useRef(pathSection ?? '')
  const [activeId, setActiveId] = useState(() => pathSection ?? '')

  useEffect(() => {
    if (!topic) {
      activeIdRef.current = ''
      setActiveId('')
      return
    }

    if (!pathSection) return
    activeIdRef.current = pathSection
    setActiveId(pathSection)
    lockUntilRef.current = Date.now() + 700
  }, [pathSection, topic])

  useEffect(() => {
    // Geen sectie-scroll-spy buiten topic-pagina's (bijv. /admin/aircos).
    if (!topic) return

    const root = document.getElementById('page-scroll')
    if (!root) return

    const update = () => {
      if (Date.now() < lockUntilRef.current) return

      const rootRect = root.getBoundingClientRect()
      const activationLine =
        rootRect.top + Math.min(rootRect.height * 0.28, 180)
      const nearBottom =
        root.scrollHeight - root.scrollTop - root.clientHeight < 48

      let current = sectionIds[0] ?? 'home'
      let bestDistance = Number.POSITIVE_INFINITY

      // Bovenaan de pagina: Home actief houden, ook als stap 1 al zichtbaar is.
      if (root.scrollTop < 72) {
        current = 'home'
      } else {
        for (const id of sectionIds) {
          if (id === 'home') continue

          const element = document.getElementById(id)
          if (!element) continue

          const rect = element.getBoundingClientRect()
          const visible =
            rect.bottom > rootRect.top + 8 && rect.top < rootRect.bottom - 8
          if (!visible) continue

          const distance = activationLine - rect.top
          if (distance >= -24 && distance < bestDistance) {
            bestDistance = distance
            current = id
          }
        }
      }

      if (nearBottom) {
        for (let i = sectionIds.length - 1; i >= 0; i -= 1) {
          const id = sectionIds[i]
          if (id === 'home') continue
          const element = document.getElementById(id)
          if (!element) continue
          const rect = element.getBoundingClientRect()
          if (rect.top < rootRect.bottom - 24) {
            current = id
            break
          }
        }
      }

      if (current === activeIdRef.current) return
      activeIdRef.current = current
      setActiveId(current)
      markPathUpdatedFromScroll()
      navigate(topicSectionPath(topic, current), { replace: true })
    }

    update()
    root.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      root.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [navigate, sectionIds, topic])

  const value = useMemo(() => activeId, [activeId])

  return (
    <ActiveSectionContext.Provider value={value}>
      {children}
    </ActiveSectionContext.Provider>
  )
}

export function useActiveSection() {
  return useContext(ActiveSectionContext)
}
