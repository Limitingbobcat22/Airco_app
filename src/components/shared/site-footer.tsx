import { type MouseEvent, type ReactNode, type SVGProps } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '@/hooks/use-auth'
import { useGoToSection } from '@/hooks/use-go-to-section'
import { COMPANY, LEGAL_PATHS } from '@/lib/company'
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

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
} as const

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold tracking-[0.22em] text-mint uppercase">
      {children}
    </h2>
  )
}

function footerLinkClass(className?: string) {
  return cn(
    'text-sm text-white/70 transition hover:text-mint focus-visible:rounded-md focus-visible:text-mint focus-visible:ring-2 focus-visible:ring-mint focus-visible:outline-none',
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

export default function SiteFooter() {
  const { pathname } = useLocation()
  const { user, isLoggedIn } = useAuth()
  const isAdmin = isLoggedIn && Boolean(user?.isAdmin)
  const year = new Date().getFullYear()
  const topic = getTopicFromPath(pathname) ?? AIRCO_TOPIC
  const aircoHome = topicSectionPath(AIRCO_TOPIC, 'home')
  const aircoModels = topicSectionPath(AIRCO_TOPIC, 'modellen')
  const powerHref = topicSectionPath(topic, 'vermogen')
  const offerteHref = topicSectionPath(topic, 'overzicht')
  const ketelHome = topicSectionPath(KETEL_TOPIC, 'home')

  return (
    <section
      aria-label="Footer"
      className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 sm:pb-10 2xl:max-w-[110rem] 2xl:px-10"
    >
      <footer className="overflow-hidden rounded-3xl bg-deep text-white">
      <div className="h-1 bg-gradient-to-r from-teal via-mint to-teal" />
      <div className="px-5 py-10 sm:px-8 sm:py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <FooterRouteLink
              href={aircoHome}
              label="Home"
              className="inline-flex max-w-[16rem] items-center text-white hover:text-white"
            >
              <BrandMark className="size-14" />
              <span className="sr-only">{COMPANY.name}</span>
            </FooterRouteLink>
            <p className="mt-4 font-display text-2xl text-white">{COMPANY.name}</p>
            <p className="mt-1 text-xs font-medium tracking-[0.14em] text-mint uppercase">
              {COMPANY.tagline}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
              {COMPANY.description}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {COMPANY.socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.id]
                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="grid size-11 place-items-center rounded-2xl border border-white/15 bg-white/5 text-white transition hover:border-mint/60 hover:bg-mint hover:text-ink focus-visible:ring-2 focus-visible:ring-mint focus-visible:outline-none"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                )
              })}
            </ul>
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

          <div>
            <FooterHeading>Bedrijf</FooterHeading>
            <ul className="mt-4 space-y-2.5">
              <li>
                <FooterRouteLink href={aircoHome} label="Over ons">
                  Over ons
                </FooterRouteLink>
              </li>
              <li>
                <FooterRouteLink href="#contact" label="Contact">
                  Contact
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
            <FooterRouteLink href={LEGAL_PATHS.privacy} label="Privacybeleid">
              Privacybeleid
            </FooterRouteLink>
            <FooterRouteLink href={LEGAL_PATHS.terms} label="Algemene voorwaarden">
              Algemene voorwaarden
            </FooterRouteLink>
            <FooterRouteLink href={LEGAL_PATHS.cookies} label="Cookiebeleid">
              Cookiebeleid
            </FooterRouteLink>
          </nav>
        </div>
      </div>
      </footer>
    </section>
  )
}
