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
      const activationLine = rootRect.top + Math.min(rootRect.height * 0.32, 220)
      let current = SECTION_IDS[0] ?? 'home'

      for (const id of SECTION_IDS) {
        const element = document.getElementById(id)
        if (!element) continue

        const rect = element.getBoundingClientRect()
        if (rect.top <= activationLine) {
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
