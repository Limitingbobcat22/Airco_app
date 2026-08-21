import type { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import AppNav from './app-nav'

type MobileSidebarProps = {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

export default function MobileSidebar({
  sidebarOpen,
  setSidebarOpen,
}: MobileSidebarProps) {
  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent
        side="left"
        className="w-[min(20rem,85vw)] p-0 pt-2 text-ink"
        style={{ backgroundColor: '#ffffff' }}
      >
        <SheetTitle className="sr-only">Navigatie</SheetTitle>
        <SheetDescription className="sr-only">
          Ga naar een onderdeel van de site
        </SheetDescription>
        <div className="flex h-full flex-col">
          <div className="flex items-center border-b px-4 py-3">
            <Link
              to="/airco/vermogen"
              className="flex items-center gap-2"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-full">
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M4 14c4-8 12-8 16 0M7 17c3-5 7-5 10 0"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="font-display text-lg tracking-tight">Aera</span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4">
              <AppNav setOpen={setSidebarOpen} isMobileNav />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
