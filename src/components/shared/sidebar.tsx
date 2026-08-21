import { ChevronsLeft } from 'lucide-react'
import { Link } from 'react-router'
import { useSidebar } from '@/hooks/use-sidebar'
import { cn } from '@/lib/utils'
import AppNav from './app-nav'

type SidebarProps = {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar()

  return (
    <nav
      className={cn(
        'relative z-10 hidden h-svh flex-none duration-300 md:block',
        isMinimized ? 'w-24 px-2' : 'w-72 px-3',
        className,
      )}
    >
      <div className="flex h-full flex-col overflow-y-auto">
        <div
          className={cn(
            'flex items-center px-0 py-5 md:px-2',
            isMinimized ? 'flex-col gap-3' : 'justify-between',
          )}
        >
          <Link to="/airco/vermogen" className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-full">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                <path
                  d="M4 14c4-8 12-8 16 0M7 17c3-5 7-5 10 0"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {!isMinimized ? (
              <span className="font-display text-lg tracking-tight">Aera</span>
            ) : null}
          </Link>
          <ChevronsLeft
            className={cn(
              'bg-background text-foreground size-8 shrink-0 cursor-pointer rounded-full border',
              isMinimized && 'rotate-180',
            )}
            onClick={toggle}
          />
        </div>
        <div className="space-y-4 py-4">
          <div className={cn('py-2', isMinimized ? 'px-1' : 'px-2')}>
            <AppNav isCollapsed={isMinimized} />
          </div>
        </div>
      </div>
    </nav>
  )
}
