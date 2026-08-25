import type { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import {
  AIRCO_TOPIC,
  defaultSectionForTopic,
  topicSectionPath,
} from '@/lib/topics'
import AppNav from './app-nav'
import BrandMark from './brand-mark'
import SidebarAuthFooter from './sidebar-auth-footer'

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
        className="bg-secondary w-[min(20rem,85vw)] border-0 p-0 pt-2 text-ink shadow-2xl"
        style={{ backgroundColor: 'hsl(var(--secondary))' }}
      >
        <SheetTitle className="sr-only">Navigatie</SheetTitle>
        <SheetDescription className="sr-only">
          Ga naar een onderdeel van de site
        </SheetDescription>
        <div className="flex h-full flex-col">
          <div className="flex items-center px-2 py-1">
            <Link
              to={topicSectionPath(AIRCO_TOPIC, defaultSectionForTopic(AIRCO_TOPIC))}
              className="flex w-full min-w-0 items-center"
              onClick={() => setSidebarOpen(false)}
            >
              <BrandMark withText />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto pt-2 pb-4">
            <div className="px-4">
              <AppNav setOpen={setSidebarOpen} isMobileNav />
            </div>
          </div>
          <SidebarAuthFooter
            isMobileNav
            onNavigate={() => setSidebarOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
