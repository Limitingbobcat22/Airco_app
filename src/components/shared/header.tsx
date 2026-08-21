import { Menu } from 'lucide-react'
import { useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { useActiveSection } from '@/hooks/use-active-section'
import { getNavTitleBySectionId } from '@/lib/constants/nav-items'
import { AIRCO_TOPIC, getTopicFromPath } from '@/lib/topics'
import Heading from './heading'

type HeaderProps = {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation()
  const activeSectionId = useActiveSection()
  const topic = getTopicFromPath(pathname) ?? AIRCO_TOPIC
  const headingText = getNavTitleBySectionId(activeSectionId, topic)

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
      <Heading title={headingText} />
    </div>
  )
}
