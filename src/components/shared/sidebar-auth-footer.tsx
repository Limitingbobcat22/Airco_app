import { LogIn, LogOut } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/use-auth'
import { useLoginModal } from '@/hooks/use-login-modal'
import { cn } from '@/lib/utils'
import { LIB_VERSION } from '@/version'

type SidebarAuthFooterProps = {
  isCollapsed?: boolean
  isMobileNav?: boolean
  onNavigate?: () => void
}

export default function SidebarAuthFooter({
  isCollapsed = false,
  isMobileNav = false,
  onNavigate,
}: SidebarAuthFooterProps) {
  const { isLoggedIn, user, logout } = useAuth()
  const { open } = useLoginModal()
  const showLabels = isMobileNav || !isCollapsed

  const handleLogin = () => {
    open()
    onNavigate?.()
  }

  const handleLogout = () => {
    logout()
    onNavigate?.()
  }

  return (
    <div
      className={cn(
        'mt-auto flex flex-col gap-2 pb-4',
        isCollapsed && !isMobileNav ? 'items-center px-1' : 'px-4',
      )}
    >
      <TooltipProvider>
        {isLoggedIn ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleLogout}
                className={cn(
                  'hover:text-muted-foreground flex w-full items-center rounded-md py-2.5 text-base font-medium',
                  isCollapsed && !isMobileNav
                    ? 'justify-center px-2'
                    : 'gap-2.5',
                )}
              >
                <LogOut
                  className={cn('size-6 shrink-0', showLabels && 'ml-2.5')}
                />
                {showLabels ? <span className="mr-2 truncate">Logout</span> : null}
              </button>
            </TooltipTrigger>
            <TooltipContent
              align="center"
              side="right"
              sideOffset={8}
              className={showLabels ? 'hidden' : 'inline-block'}
            >
              Logout
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleLogin}
                className={cn(
                  'hover:text-muted-foreground flex w-full items-center rounded-md py-2.5 text-base font-medium',
                  isCollapsed && !isMobileNav
                    ? 'justify-center px-2'
                    : 'gap-2.5',
                )}
              >
                <LogIn
                  className={cn('size-6 shrink-0', showLabels && 'ml-2.5')}
                />
                {showLabels ? <span className="mr-2 truncate">Login</span> : null}
              </button>
            </TooltipTrigger>
            <TooltipContent
              align="center"
              side="right"
              sideOffset={8}
              className={showLabels ? 'hidden' : 'inline-block'}
            >
              Login
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>

      {showLabels && isLoggedIn && user ? (
        <p className="truncate text-sm underline">{user.email}</p>
      ) : null}

      {showLabels ? (
        <p className="text-muted-foreground text-xs">Version {LIB_VERSION}</p>
      ) : null}
    </div>
  )
}
