import type { LucideIcon } from 'lucide-react'
import { ClipboardList, Gauge, Thermometer, Wind } from 'lucide-react'

export type NavItem = {
  title?: string
  href?: string
  icon?: LucideIcon
  separator?: boolean
  sectionHeader?: string
}

export function getSectionIdFromHref(href: string): string | null {
  if (href === '/') return 'home'
  const hashIndex = href.indexOf('#')
  if (hashIndex === -1) return null
  return href.slice(hashIndex + 1)
}

export function getNavTitleBySectionId(sectionId: string): string {
  const matched = navItems.find(
    (item) => item.href && getSectionIdFromHref(item.href) === sectionId,
  )
  return matched?.title ?? 'Vermogen'
}

export const navItems: NavItem[] = [
  {
    sectionHeader: 'Ontdekken',
  },
  {
    title: 'Vermogen',
    href: '/#vermogen',
    icon: Gauge,
  },
  {
    title: 'Modellen',
    href: '/#modellen',
    icon: Wind,
  },
  {
    separator: true,
  },
  {
    sectionHeader: 'Besparen',
  },
  {
    title: 'Verbruik',
    href: '/#verbruik',
    icon: Thermometer,
  },
  {
    title: 'Overzicht',
    href: '/#overzicht',
    icon: ClipboardList,
  },
]
