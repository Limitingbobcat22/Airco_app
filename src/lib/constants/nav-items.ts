import type { LucideIcon } from 'lucide-react'
import { Flame, FileText, Table2, Users } from 'lucide-react'
import AircoIcon from '@/components/icons/airco-icon'
import {
  AIRCO_TOPIC,
  defaultSectionForTopic,
  getSectionFromPath,
  getTopicFromPath,
  KETEL_TOPIC,
  TOPIC_LABELS,
  TOPIC_NAV_LINKS,
  topicSectionPath,
  type TopicSlug,
} from '@/lib/topics'

export const ADMIN_AIRCOS_PATH = '/admin/aircos'
export const ADMIN_KLANTEN_PATH = '/admin/klanten'
export const ADMIN_OFFERTES_PATH = '/admin/offertes'

export type NavItem = {
  title?: string
  href?: string
  icon?: LucideIcon
  separator?: boolean
  sectionHeader?: string
  /** Navigeert naar een ander product/topic — kan bevestiging vragen. */
  leavesTopic?: boolean
  destinationLabel?: string
}

function otherTopic(topic: TopicSlug): TopicSlug {
  return topic === AIRCO_TOPIC ? KETEL_TOPIC : AIRCO_TOPIC
}

function topicSwitchIcon(topic: TopicSlug): LucideIcon {
  return topic === KETEL_TOPIC ? Flame : (AircoIcon as LucideIcon)
}

type BuildTopicNavOptions = {
  /** Ketels en admin-pagina's alleen tonen voor admins. */
  isAdmin?: boolean
}

/** Sectie-items van het actieve topic + switch naar het andere product. */
export function buildTopicNavItems(
  topic: TopicSlug,
  options: BuildTopicNavOptions = {},
): NavItem[] {
  const { isAdmin = false } = options
  const links = TOPIC_NAV_LINKS[topic]
  const items: NavItem[] = []
  let lastGroup: string | null = null

  for (const link of links) {
    if (link.group !== lastGroup) {
      if (lastGroup != null) items.push({ separator: true })
      items.push({ sectionHeader: link.group })
      lastGroup = link.group
    }
    items.push({
      title: link.title,
      href: topicSectionPath(topic, link.section),
      icon: link.icon,
    })
  }

  const target = otherTopic(topic)
  const canSwitchToTarget = target !== KETEL_TOPIC || isAdmin

  if (canSwitchToTarget) {
    const label = TOPIC_LABELS[target]
    items.push({ separator: true })
    items.push({ sectionHeader: 'Producten' })
    items.push({
      title: label,
      href: topicSectionPath(target, defaultSectionForTopic(target)),
      icon: topicSwitchIcon(target),
      leavesTopic: true,
      destinationLabel: label,
    })
  }

  if (isAdmin) {
    items.push({ separator: true })
    items.push({ sectionHeader: 'Beheer' })
    items.push({
      title: 'Aircos beheer',
      href: ADMIN_AIRCOS_PATH,
      icon: Table2,
      leavesTopic: true,
      destinationLabel: 'Aircos beheer',
    })
    items.push({
      title: 'Klanten beheer',
      href: ADMIN_KLANTEN_PATH,
      icon: Users,
      leavesTopic: true,
      destinationLabel: 'Klanten beheer',
    })
    items.push({
      title: 'Offertes beheer',
      href: ADMIN_OFFERTES_PATH,
      icon: FileText,
      leavesTopic: true,
      destinationLabel: 'Offertes beheer',
    })
  }

  return items
}

export function getSectionIdFromHref(href: string): string | null {
  return getSectionFromPath(href) ?? getSectionFromPath(`/${href}`)
}

export function getNavTitleBySectionId(
  sectionId: string,
  topic: TopicSlug = AIRCO_TOPIC,
): string {
  const matched = TOPIC_NAV_LINKS[topic].find((link) => link.section === sectionId)
  return matched?.title ?? 'Home'
}

export const navItems = buildTopicNavItems(AIRCO_TOPIC)

export function getNavItemsForPath(
  pathname: string,
  options: BuildTopicNavOptions = {},
): NavItem[] {
  const topic = getTopicFromPath(pathname) ?? AIRCO_TOPIC
  return buildTopicNavItems(topic, options)
}
