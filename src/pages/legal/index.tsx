import { Navigate, useLocation } from 'react-router'
import SiteFooter from '@/components/shared/site-footer'
import { LEGAL_PAGES } from '@/lib/company'

const SLUGS = ['privacy', 'voorwaarden', 'cookies'] as const
type LegalSlug = (typeof SLUGS)[number]

function isLegalSlug(value: string): value is LegalSlug {
  return SLUGS.includes(value as LegalSlug)
}

function slugToKey(slug: LegalSlug): keyof typeof LEGAL_PAGES {
  if (slug === 'voorwaarden') return 'terms'
  if (slug === 'cookies') return 'cookies'
  return 'privacy'
}

export default function LegalPage() {
  const { pathname } = useLocation()
  const slug = pathname.replace(/^\//, '')

  if (!isLegalSlug(slug)) {
    return <Navigate to="/privacy" replace />
  }

  const page = LEGAL_PAGES[slugToKey(slug)]

  return (
    <div className="flex h-full min-h-0 flex-col bg-foam">
      <div id="page-scroll" className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col">
          <article className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
            <p className="text-xs font-medium tracking-[0.2em] text-teal uppercase">
              Juridisch
            </p>
            <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              {page.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink/75">
              {page.intro}
            </p>
          </article>
          <SiteFooter />
        </div>
      </div>
    </div>
  )
}
