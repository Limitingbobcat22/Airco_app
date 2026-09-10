import { ChevronRight, Menu } from 'lucide-react'
import { useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { useActiveSection } from '@/hooks/use-active-section'
import { useGoToSection } from '@/hooks/use-go-to-section'
import {
  ADMIN_AIRCOS_PATH,
  getNavTitleBySectionId,
} from '@/lib/constants/nav-items'
import { LEGAL_PAGES, LEGAL_PATHS } from '@/lib/company'
import {
  AIRCO_TOPIC,
  getTopicFromPath,
  TOPIC_LABELS,
} from '@/lib/topics'

type HeaderProps = {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation()
  const activeSectionId = useActiveSection()
  const goToSection = useGoToSection()
  const isAdminAircos = pathname === ADMIN_AIRCOS_PATH
  const legalTitle =
    pathname === LEGAL_PATHS.privacy
      ? LEGAL_PAGES.privacy.title
      : pathname === LEGAL_PATHS.terms
        ? LEGAL_PAGES.terms.title
        : pathname === LEGAL_PATHS.cookies
          ? LEGAL_PAGES.cookies.title
          : null
  const topic = getTopicFromPath(pathname) ?? AIRCO_TOPIC
  const topicLabel = isAdminAircos
    ? 'Beheer'
    : legalTitle
      ? 'Juridisch'
      : TOPIC_LABELS[topic]
  const sectionTitle = isAdminAircos
    ? 'Aircos'
    : (legalTitle ?? getNavTitleBySectionId(activeSectionId, topic))

  return (
    <div className="bg-secondary flex flex-1 items-center gap-2 px-3 md:px-4">
      {onMenuClick ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      ) : null}
      <nav aria-label="Huidige locatie" className="min-w-0">
        <ol className="text-primary flex items-center gap-1.5 text-xl font-bold tracking-tight sm:gap-2 sm:text-2xl">
          <li className="min-w-0 truncate">
            {isAdminAircos || legalTitle ? (
              <span className="truncate">{topicLabel}</span>
            ) : (
              <button
                type="button"
                onClick={() => goToSection('modellen')}
                className="cursor-pointer truncate transition hover:text-teal focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-mint focus-visible:outline-none"
              >
                {topicLabel}
              </button>
            )}
          </li>
          <li aria-hidden className="text-primary/40">
            <ChevronRight className="size-5 shrink-0 sm:size-6" strokeWidth={2.5} />
          </li>
          <li className="truncate" aria-current="page">
            {sectionTitle}
          </li>
        </ol>
      </nav>
    </div>
  )
}
