import type { LucideIcon } from 'lucide-react'
import {
  ClipboardList,
  Flame,
  Gauge,
  Home,
  Thermometer,
} from 'lucide-react'
import AircoIcon from '@/components/icons/airco-icon'

export const AIRCO_TOPIC = 'airco'
export const KETEL_TOPIC = 'ketel'

export const TOPIC_SLUGS = [AIRCO_TOPIC, KETEL_TOPIC] as const
export type TopicSlug = (typeof TOPIC_SLUGS)[number]

export const AIRCO_SECTIONS = [
  'home',
  'vermogen',
  'modellen',
  'verbruik',
  'overzicht',
] as const

export const KETEL_SECTIONS = [
  'home',
  'vermogen',
  'modellen',
  'verbruik',
  'overzicht',
] as const

export type AircoSection = (typeof AIRCO_SECTIONS)[number]
export type KetelSection = (typeof KETEL_SECTIONS)[number]

export const TOPIC_SECTIONS: Record<TopicSlug, readonly string[]> = {
  airco: AIRCO_SECTIONS,
  ketel: KETEL_SECTIONS,
}

export type TopicNavLink = {
  title: string
  section: string
  icon: LucideIcon
  group: 'Ontdekken' | 'Besparen'
}

export const AIRCO_NAV_LINKS: TopicNavLink[] = [
  { title: 'Home', section: 'home', icon: Home, group: 'Ontdekken' },
  { title: 'Vermogen', section: 'vermogen', icon: Gauge, group: 'Ontdekken' },
  { title: 'Modellen', section: 'modellen', icon: AircoIcon as LucideIcon, group: 'Ontdekken' },
  { title: 'Verbruik', section: 'verbruik', icon: Thermometer, group: 'Besparen' },
  {
    title: 'Overzicht',
    section: 'overzicht',
    icon: ClipboardList,
    group: 'Besparen',
  },
]

export const KETEL_NAV_LINKS: TopicNavLink[] = [
  { title: 'Home', section: 'home', icon: Home, group: 'Ontdekken' },
  { title: 'Vermogen', section: 'vermogen', icon: Gauge, group: 'Ontdekken' },
  { title: 'Modellen', section: 'modellen', icon: Flame, group: 'Ontdekken' },
  { title: 'Verbruik', section: 'verbruik', icon: Thermometer, group: 'Besparen' },
  {
    title: 'Overzicht',
    section: 'overzicht',
    icon: ClipboardList,
    group: 'Besparen',
  },
]

export const TOPIC_NAV_LINKS: Record<TopicSlug, TopicNavLink[]> = {
  airco: AIRCO_NAV_LINKS,
  ketel: KETEL_NAV_LINKS,
}

export const TOPIC_LABELS: Record<TopicSlug, string> = {
  airco: 'Airco',
  ketel: 'Ketels',
}

export function isTopicSlug(value: string): value is TopicSlug {
  return TOPIC_SLUGS.includes(value as TopicSlug)
}

export function topicSectionPath(topic: TopicSlug, section: string) {
  return `/${topic}/${section}`
}

export function getTopicFromPath(pathname: string): TopicSlug | null {
  const [topic] = pathname.split('/').filter(Boolean)
  return topic && isTopicSlug(topic) ? topic : null
}

export function getSectionFromPath(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length < 2) return null
  const [topic, section] = parts
  if (!isTopicSlug(topic)) return null
  return TOPIC_SECTIONS[topic].includes(section) ? section : null
}

export function defaultSectionForTopic(topic: TopicSlug) {
  return TOPIC_SECTIONS[topic][0] ?? 'home'
}
