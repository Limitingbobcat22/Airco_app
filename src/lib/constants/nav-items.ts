import type { LucideIcon } from 'lucide-react'
import { Flame, Wind } from 'lucide-react'
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
  return topic === KETEL_TOPIC ? Flame : Wind
}

/** Sectie-items van het actieve topic + switch naar het andere product. */
export function buildTopicNavItems(topic: TopicSlug): NavItem[] {
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
  return matched?.title ?? 'Vermogen'
}

export const navItems = buildTopicNavItems(AIRCO_TOPIC)

export function getNavItemsForPath(pathname: string): NavItem[] {
  const topic = getTopicFromPath(pathname) ?? AIRCO_TOPIC
  return buildTopicNavItems(topic)
}
