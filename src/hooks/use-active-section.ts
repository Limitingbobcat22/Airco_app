import { useEffect, useState } from 'react'
import { getSectionIdFromHref, navItems } from '@/lib/constants/nav-items'

const SECTION_IDS = navItems
  .map((item) => (item.href ? getSectionIdFromHref(item.href) : null))
  .filter((id): id is string => Boolean(id))

export function useActiveSection() {
  const [activeId, setActiveId] = useState(SECTION_IDS[0] ?? 'home')

  useEffect(() => {
    const root = document.getElementById('page-scroll')
    if (!root) return

    const update = () => {
      const rootRect = root.getBoundingClientRect()
      let current = SECTION_IDS[0] ?? 'home'
      let bestVisible = 0

      for (const id of SECTION_IDS) {
        const element = document.getElementById(id)
        if (!element) continue

        const rect = element.getBoundingClientRect()
        const visibleHeight =
          Math.min(rect.bottom, rootRect.bottom) - Math.max(rect.top, rootRect.top)

        if (visibleHeight > bestVisible) {
          bestVisible = visibleHeight
          current = id
        }
      }

      setActiveId(current)
    }

    update()
    root.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      root.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return activeId
}
