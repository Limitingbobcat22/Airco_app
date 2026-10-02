import { useState, type MouseEvent, type ReactNode, type SVGProps } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Modal } from '@/components/ui/modal'
import { useAuth } from '@/hooks/use-auth'
import { useGoToSection } from '@/hooks/use-go-to-section'
import { COMPANY, LEGAL_PAGES } from '@/lib/company'
import { scrollToPageSection } from '@/lib/page-scroll'
import {
  AIRCO_TOPIC,
  getTopicFromPath,
  KETEL_TOPIC,
  topicSectionPath,
} from '@/lib/topics'
import { useUnsavedChanges } from '@/providers/unsaved-changes'
import { cn } from '@/lib/utils'
import BrandMark from './brand-mark'

function SocialSvg({ className, children }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <SocialSvg className={className}>
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.8A4.2 4.2 0 1 0 16.2 12 4.2 4.2 0 0 0 12 7.8zm0 1.7A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5zm5.35-3.35a1 1 0 1 0 1 1 1 1 0 0 0-1-1z" />
    </SocialSvg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <SocialSvg className={className}>
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
    </SocialSvg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <SocialSvg className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3-.04.6-.02.88.05V9.4a6.34 6.34 0 0 0-1-.08A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
    </SocialSvg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <SocialSvg className={className}>
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.59 5.93L0 24l6.38-1.67a11.8 11.8 0 0 0 5.66 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.45zM12.05 21.8h-.01a9.8 9.8 0 0 1-5-1.36l-.36-.21-3.79.99 1.01-3.69-.23-.38a9.82 9.82 0 0 1-1.5-5.24c0-5.42 4.41-9.83 9.84-9.83 2.63 0 5.1 1.02 6.96 2.89a9.77 9.77 0 0 1 2.88 6.95c0 5.42-4.42 9.83-9.84 9.84zm5.39-7.36c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.29-.76.96-.93 1.16-.17.2-.34.22-.63.07-.29-.14-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.91-2.19-.24-.58-.48-.5-.66-.51h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.2 3.03.15.2 2.06 3.15 5 4.42.7.3 1.24.48 1.67.61.7.22 1.34.19 1.84.12.56-.08 1.74-.71 1.98-1.4.25-.68.25-1.27.17-1.39-.07-.12-.27-.2-.56-.34z" />
    </SocialSvg>
  )
}

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
  whatsapp: WhatsAppIcon,
} as const

function FooterSocials({ className }: { className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-2.5', className)}>
      {COMPANY.socials.map((social) => {
        const Icon = SOCIAL_ICONS[social.id]
        return (
          <li key={social.id}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="grid size-14 place-items-center rounded-2xl border border-white/15 bg-white/5 text-white transition hover:border-orange-500/60 hover:bg-orange-500 hover:text-white focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
            >
              <Icon className="size-7" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold tracking-[0.22em] text-orange-500 uppercase">
      {children}
    </h2>
  )
}

function footerLinkClass(className?: string) {
  return cn(
    'text-sm text-white/70 transition hover:text-orange-500 focus-visible:rounded-md focus-visible:text-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none',
    className,
  )
}

type FooterRouteLinkProps = {
  href: string
  label: string
  children: ReactNode
  className?: string
}

function FooterRouteLink({
  href,
  label,
  children,
  className,
}: FooterRouteLinkProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const goToSection = useGoToSection()
  const { requestNavigation } = useUnsavedChanges()
  const currentTopic = getTopicFromPath(pathname)
  const hrefTopic = getTopicFromPath(href)
  const hrefSection = href.split('/').filter(Boolean)[1] ?? null

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (href === '#contact') {
      event.preventDefault()
      scrollToPageSection('contact', 'smooth')
      return
    }

    const sameTopicSection =
      hrefTopic != null &&
      hrefTopic === currentTopic &&
      hrefSection != null

    if (sameTopicSection) {
      event.preventDefault()
      goToSection(hrefSection)
      return
    }

    if (pathname === href) {
      event.preventDefault()
      return
    }

    event.preventDefault()
    if (requestNavigation(href, label)) navigate(href)
  }

  return (
    <Link
      to={href === '#contact' ? pathname : href}
      className={footerLinkClass(className)}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}

type LegalKey = keyof typeof LEGAL_PAGES
type LegalPage = (typeof LEGAL_PAGES)[LegalKey]
type LegalArticlesList = Extract<LegalPage, { articles: readonly unknown[] }>['articles']

const LEGAL_KEYS = ['privacy', 'terms', 'cookies'] as const satisfies readonly LegalKey[]

function LegalText({ text }: { text: string }) {
  const email = COMPANY.email
  if (!text.includes(email)) return text

  const [before, after] = text.split(email)
  return (
    <>
      {before}
      <a
        href={`mailto:${email}`}
        className="font-medium text-[#74b8f8] underline decoration-[#74b8f8]/40 underline-offset-2 hover:text-[#5aa6ef]"
      >
        {email}
      </a>
      {after}
    </>
  )
}

function LegalArticles({ articles }: { articles: LegalArticlesList }) {
  return (
    <div className="mt-5 divide-y divide-mist">
      {articles.map((article) => {
        const useBullets = 'bullets' in article && article.bullets
        const ListTag = useBullets ? 'ul' : 'ol'
        return (
          <article key={article.title} className="py-4 first:pt-0 last:pb-1">
            <h3 className="text-sm font-semibold text-ink">{article.title}</h3>
            {'lead' in article ? (
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                <LegalText text={article.lead} />
              </p>
            ) : null}
            {'items' in article ? (
              <ListTag
                className={cn(
                  'mt-2 space-y-2 pl-5 text-sm leading-relaxed text-ink/75 marker:text-[#74b8f8]',
                  useBullets ? 'list-disc' : 'list-decimal marker:font-medium',
                )}
              >
                {article.items.map((item) => (
                  <li key={item} className="pl-1">
                    <LegalText text={item} />
                  </li>
                ))}
              </ListTag>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}

export default function SiteFooter() {
  const { pathname } = useLocation()
  const { user, isLoggedIn } = useAuth()
  const isAdmin = isLoggedIn && Boolean(user?.isAdmin)
  const [legalKey, setLegalKey] = useState<LegalKey | null>(null)
  const year = new Date().getFullYear()
  const legalPage = legalKey ? LEGAL_PAGES[legalKey] : null
  const topic = getTopicFromPath(pathname) ?? AIRCO_TOPIC
  const aircoHome = topicSectionPath(AIRCO_TOPIC, 'home')
  const aircoModels = topicSectionPath(AIRCO_TOPIC, 'modellen')
  const powerHref = topicSectionPath(topic, 'vermogen')
  const offerteHref = topicSectionPath(topic, 'overzicht')
  const ketelHome = topicSectionPath(KETEL_TOPIC, 'home')

  return (
    <section
      aria-label="Footer"
      className="mx-2 mt-4 pb-2 sm:mx-4 sm:mt-6 sm:pb-4"
    >
      <footer className="page-block overflow-hidden rounded-3xl bg-[#002451] text-white">
      <div className="px-5 py-10 sm:px-8 sm:py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <div>
            <FooterRouteLink
              href={aircoHome}
              label="Home"
              className="inline-flex max-w-[16rem] items-center text-white hover:text-white"
            >
              <BrandMark className="size-23" />
              <span className="sr-only">{COMPANY.name}</span>
            </FooterRouteLink>
            <p className="mt-4 font-display text-2xl text-white">{COMPANY.name}</p>
            <p className="mt-1 text-xs font-medium tracking-[0.14em] text-orange-500 uppercase">
              {COMPANY.tagline}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
              {COMPANY.description}
            </p>
            <FooterSocials className="mt-4 hidden sm:flex" />
          </div>

          <div>
            <FooterHeading>Diensten</FooterHeading>
            <ul className="mt-4 space-y-2.5">
              <li>
                <FooterRouteLink href={aircoModels} label="Airco">
                  Airco
                </FooterRouteLink>
              </li>
              {isAdmin ? (
                <li>
                  <FooterRouteLink href={ketelHome} label="Ketel">
                    Ketel
                  </FooterRouteLink>
                </li>
              ) : null}
              <li>
                <FooterRouteLink href={powerHref} label="Vermogen">
                  Vermogen berekenen
                </FooterRouteLink>
              </li>
              <li>
                <FooterRouteLink href={offerteHref} label="Offerte">
                  Offerte
                </FooterRouteLink>
              </li>
            </ul>
          </div>

          <div id="contact" className="scroll-mt-4">
            <FooterHeading>Contact</FooterHeading>
            <address className="mt-4 space-y-2.5 text-sm not-italic text-white/70">
              {COMPANY.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p>
                <a href={COMPANY.phoneHref} className={footerLinkClass()}>
                  {COMPANY.phoneDisplay}
                </a>
              </p>
              <p>
                <a href={`mailto:${COMPANY.email}`} className={footerLinkClass()}>
                  {COMPANY.email}
                </a>
              </p>
            </address>
          </div>

          <FooterSocials className="sm:hidden" />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="flex flex-col gap-3 px-5 py-4 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© {year} {COMPANY.name}</span>
            <span className="hidden text-white/25 sm:inline" aria-hidden>
              ·
            </span>
            <span>KvK {COMPANY.kvk}</span>
            <span className="hidden text-white/25 sm:inline" aria-hidden>
              ·
            </span>
            <span>btw {COMPANY.vat}</span>
          </p>
          <nav aria-label="Juridisch" className="flex flex-wrap gap-x-4 gap-y-1">
            {LEGAL_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                className={footerLinkClass('cursor-pointer border-0 bg-transparent p-0')}
                onClick={() => setLegalKey(key)}
              >
                {LEGAL_PAGES[key].title}
              </button>
            ))}
          </nav>
        </div>
      </div>
      </footer>
      <Modal
        title={legalPage?.title ?? 'Juridisch'}
        description="Juridische informatie"
        isOpen={legalPage != null}
        onClose={() => setLegalKey(null)}
        className={cn(
          'overflow-hidden',
          legalPage && 'articles' in legalPage ? 'sm:max-w-2xl' : 'sm:max-w-lg',
        )}
      >
        {legalPage ? (
          <div
            className={cn(
              'pr-8',
              'articles' in legalPage && 'max-h-[min(72vh,42rem)] overflow-y-auto',
            )}
          >
            <p className="text-xs font-medium tracking-[0.2em] text-[#74b8f8] uppercase">
              Juridisch
            </p>
            <h2 className="mt-2 font-display text-2xl text-ink">{legalPage.title}</h2>
            {'intro' in legalPage ? (
              <p className="mt-4 text-sm leading-relaxed text-ink/75">{legalPage.intro}</p>
            ) : null}
            {'articles' in legalPage ? (
              <LegalArticles articles={legalPage.articles} />
            ) : null}
          </div>
        ) : null}
      </Modal>
    </section>
  )
}
