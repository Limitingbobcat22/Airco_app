import type { Dispatch, MouseEvent, SetStateAction } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useActiveSection } from '@/hooks/use-active-section'
import { useAuth } from '@/hooks/use-auth'
import { useSidebar } from '@/hooks/use-sidebar'
import {
  getSectionIdFromHref,
  getNavItemsForPath,
  type NavItem,
} from '@/lib/constants/nav-items'
import { scrollToPageSection } from '@/lib/page-scroll'
import { getTopicFromPath } from '@/lib/topics'
import { useUnsavedChanges } from '@/providers/unsaved-changes'
import { cn } from '@/lib/utils'

type AppNavProps = {
  items?: NavItem[]
  setOpen?: Dispatch<SetStateAction<boolean>>
  isMobileNav?: boolean
  isCollapsed?: boolean
}

function isItemActive(
  href: string,
  pathname: string,
  activeSectionId: string,
  leavesTopic?: boolean,
) {
  if (pathname === href || pathname.startsWith(`${href}/`)) return true
  // Buiten topic-pagina's (admin): alleen exacte path-match, geen sectie-spy.
  if (!getTopicFromPath(pathname)) return false
  if (leavesTopic) return false
  const sectionId = getSectionIdFromHref(href)
  if (sectionId) return sectionId === activeSectionId
  return false
}

export default function AppNav({
  items,
  setOpen,
  isMobileNav = false,
  isCollapsed,
}: AppNavProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeSectionId = useActiveSection()
  const { isMinimized } = useSidebar()
  const { user, isLoggedIn } = useAuth()
  const { requestNavigation } = useUnsavedChanges()
  const shouldShowIconOnly =
    isCollapsed !== undefined ? isCollapsed : isMinimized
  const isAdmin = isLoggedIn && Boolean(user?.isAdmin)
  const navItems = items ?? getNavItemsForPath(pathname, { isAdmin })

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {navItems.map((item, index) => {
          if (item.sectionHeader) {
            if (shouldShowIconOnly) return null

            return (
              <div
                key={`section-${item.sectionHeader}-${index}`}
                className="text-foreground/50 px-3 pt-1 text-xs font-semibold tracking-[0.2em] uppercase first:pt-0"
              >
                {item.sectionHeader}
              </div>
            )
          }

          if (item.separator) {
            return (
              <div
                key={`separator-${index}`}
                className="mx-2 my-2 border-t border-gray-400"
              />
            )
          }

          if (!item.href || !item.icon || !item.title) return null

          const href = item.href
          const title = item.title
          const Icon = item.icon
          const active = isItemActive(
            href,
            pathname,
            activeSectionId,
            item.leavesTopic,
          )

          const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
            if (!item.leavesTopic) {
              setOpen?.(false)
              const sectionId = getSectionIdFromHref(href)
              if (sectionId && pathname === href) {
                event.preventDefault()
                scrollToPageSection(
                  sectionId === 'home' ? null : sectionId,
                  'smooth',
                )
              }
              return
            }

            event.preventDefault()
            const label = item.destinationLabel ?? title
            const canNavigate = requestNavigation(href, label)
            if (canNavigate) navigate(href)
            setOpen?.(false)
          }

          const link = (
            <Link
              to={href}
              className={cn(
                'flex items-center overflow-hidden rounded-md py-2.5 text-base font-medium hover:text-muted-foreground',
                shouldShowIconOnly ? 'justify-center px-2' : 'gap-2.5',
                active
                  ? 'bg-primary text-primary-foreground hover:text-primary-foreground'
                  : 'transparent',
              )}
              onClick={handleClick}
            >
              <Icon
                className={cn('size-6 shrink-0', !shouldShowIconOnly && 'ml-2.5')}
              />
              {isMobileNav || (!shouldShowIconOnly && !isMobileNav) ? (
                <span className="mr-2 truncate">{item.title}</span>
              ) : null}
            </Link>
          )

          if (isMobileNav) {
            return <div key={item.href}>{link}</div>
          }

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent
                align="center"
                side="right"
                sideOffset={8}
                className={!shouldShowIconOnly ? 'hidden' : 'inline-block'}
              >
                {item.title}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
    </nav>
  )
}
