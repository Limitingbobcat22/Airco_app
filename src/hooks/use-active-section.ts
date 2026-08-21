import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { getSectionIdFromHref, navItems } from '@/lib/constants/nav-items'

const SECTION_IDS = navItems
  .map((item) => (item.href ? getSectionIdFromHref(item.href) : null))
  .filter((id): id is string => Boolean(id))

function sectionIdFromHash(hash: string) {
  const id = hash.replace(/^#/, '')
  return SECTION_IDS.includes(id) ? id : null
}

export function useActiveSection() {
  const { hash } = useLocation()
  const lockUntilRef = useRef(0)
  const [activeId, setActiveId] = useState(
    () => sectionIdFromHash(hash) ?? SECTION_IDS[0] ?? 'vermogen',
  )

  useEffect(() => {
    const fromHash = sectionIdFromHash(hash)
    if (!fromHash) return
    setActiveId(fromHash)
    // Tijdens smooth scroll even vasthouden op de aangeklikte sectie.
    lockUntilRef.current = Date.now() + 700
  }, [hash])

  useEffect(() => {
    const root = document.getElementById('page-scroll')
    if (!root) return

    const update = () => {
      if (Date.now() < lockUntilRef.current) return

      const rootRect = root.getBoundingClientRect()
      const activationLine =
        rootRect.top + Math.min(rootRect.height * 0.28, 180)
      const nearBottom =
        root.scrollHeight - root.scrollTop - root.clientHeight < 48

      let current = SECTION_IDS[0] ?? 'vermogen'
      let bestDistance = Number.POSITIVE_INFINITY

      for (const id of SECTION_IDS) {
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

      if (nearBottom) {
        for (let i = SECTION_IDS.length - 1; i >= 0; i -= 1) {
          const id = SECTION_IDS[i]
          const element = document.getElementById(id)
          if (!element) continue
          const rect = element.getBoundingClientRect()
          if (rect.top < rootRect.bottom - 24) {
            current = id
            break
          }
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
