import { ChevronsLeft } from 'lucide-react'
import { Link } from 'react-router'
import { useSidebar } from '@/hooks/use-sidebar'
import {
  AIRCO_TOPIC,
  defaultSectionForTopic,
  topicSectionPath,
} from '@/lib/topics'
import { cn } from '@/lib/utils'
import AppNav from './app-nav'
import BrandMark from './brand-mark'

type SidebarProps = {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar()

  return (
    <nav
      className={cn(
        'relative z-10 hidden h-svh flex-none duration-300 md:block',
        isMinimized ? 'w-24 px-2' : 'w-96 px-3',
        className,
      )}
    >
      <div className="flex h-full flex-col overflow-y-auto">
        <div
          className={cn(
            'flex items-center',
            isMinimized ? 'flex-col gap-2 px-0 py-2' : 'gap-2 px-0 pt-2 pb-0',
          )}
        >
          <Link
            to={topicSectionPath(AIRCO_TOPIC, defaultSectionForTopic(AIRCO_TOPIC))}
            className={cn(
              'flex items-center',
              isMinimized ? 'justify-center' : 'min-w-0 flex-1',
            )}
          >
            <BrandMark withText={!isMinimized} />
          </Link>
          <ChevronsLeft
            className={cn(
              'bg-background text-foreground size-8 shrink-0 cursor-pointer rounded-full border',
              isMinimized && 'rotate-180',
            )}
            onClick={toggle}
          />
        </div>
        <div className={cn('space-y-4', isMinimized ? 'py-3' : 'pt-1 pb-3')}>
          <div className={cn('py-2', isMinimized ? 'px-1' : 'px-2')}>
            <AppNav isCollapsed={isMinimized} />
          </div>
        </div>
      </div>
    </nav>
  )
}
