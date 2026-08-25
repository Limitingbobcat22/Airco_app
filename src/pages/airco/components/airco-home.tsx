import { ArrowRight, CheckCircle2, ChevronRight, Gauge } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import AircoIcon from '@/components/icons/airco-icon'
import KetelIcon from '@/components/icons/ketel-icon'
import { useAuth } from '@/hooks/use-auth'
import { useGoToSection } from '@/hooks/use-go-to-section'
import {
  AIRCO_TOPIC,
  getTopicFromPath,
  KETEL_TOPIC,
  TOPIC_LABELS,
  topicSectionPath,
} from '@/lib/topics'
import { cn } from '@/lib/utils'
import { useUnsavedChanges } from '@/providers/unsaved-changes'

const HOME_HIGHLIGHTS = [
  'Persoonlijk advies',
  'Vakkundige installatie',
  'Duidelijke afspraken',
] as const

const topicButtonClass = (active: boolean) =>
  cn(
    'inline-flex w-full min-w-0 items-center gap-1.5 rounded-xl px-2 py-3 text-xs leading-snug font-semibold transition focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-[#ebf3ff] focus-visible:outline-none sm:gap-2 sm:px-3 sm:py-3.5 sm:text-sm',
    active
      ? 'bg-white text-ink shadow-md ring-2 ring-mint'
      : 'bg-[#f0f6ff] text-ink shadow-sm hover:bg-white',
  )

export default function AircoHome() {
  const goToSection = useGoToSection()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, isLoggedIn } = useAuth()
  const { requestNavigation } = useUnsavedChanges()
  const topic = getTopicFromPath(pathname) ?? AIRCO_TOPIC
  const aircosActive = topic === AIRCO_TOPIC
  const ketelsActive = topic === KETEL_TOPIC
  const isAdmin = isLoggedIn && Boolean(user?.isAdmin)

  const goToKetels = () => {
    const href = topicSectionPath(KETEL_TOPIC, 'modellen')
    const label = TOPIC_LABELS[KETEL_TOPIC]
    if (requestNavigation(href, label)) navigate(href)
  }

  return (
    <section
      id="home"
      className="hero-bg relative scroll-mt-4 overflow-hidden rounded-b-3xl px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(62,224,192,0.22),transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(116,184,248,0.45),transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-sm font-medium tracking-[0.22em] text-teal uppercase">
            Duurzame Airconditioning op Maat
          </p>
          <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.05] text-ink sm:text-6xl">
            Koel in de zomer.
            <span className="block text-teal">Bespaar in de winter.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-ink/70 sm:text-lg">
            Bereken het vermogen voor uw ruimte, of bekijk meteen alle Haier-
            en Mitsubishi-modellen. De prijs bespreken we daarna op afspraak.
          </p>
          <div
            className={cn(
              'mt-8 grid gap-2 sm:gap-2.5',
              isAdmin ? 'grid-cols-3' : 'grid-cols-2',
            )}
          >
            <button
              type="button"
              onClick={() => goToSection('vermogen')}
              className="inline-flex w-full min-w-0 items-center justify-center gap-1.5 rounded-xl bg-mint px-2 py-3 text-xs leading-snug font-semibold text-ink transition hover:bg-mint/90 focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-[#ebf3ff] focus-visible:outline-none sm:gap-2 sm:px-3 sm:py-3.5 sm:text-sm"
            >
              <Gauge className="size-4 shrink-0 sm:size-5" aria-hidden />
              <span className="min-w-0 flex-1 text-center">Bereken vermogen</span>
              <ArrowRight className="hidden size-4 shrink-0 sm:block" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => goToSection('modellen')}
              aria-current={aircosActive ? 'page' : undefined}
              className={topicButtonClass(aircosActive)}
            >
              <AircoIcon className="size-5 shrink-0 sm:size-6" strokeWidth={1.75} />
              <span className="min-w-0 flex-1 text-left">Alle aircos</span>
              <ChevronRight
                className="size-4 shrink-0 text-orange-500 sm:size-5"
                strokeWidth={2.5}
                aria-hidden
              />
            </button>
            {isAdmin ? (
              <button
                type="button"
                onClick={goToKetels}
                aria-current={ketelsActive ? 'page' : undefined}
                className={topicButtonClass(ketelsActive)}
              >
                <KetelIcon className="size-5 shrink-0 sm:size-6" strokeWidth={1.75} />
                <span className="min-w-0 flex-1 text-left">Alle ketels</span>
                <ChevronRight
                  className="size-4 shrink-0 text-orange-500 sm:size-5"
                  strokeWidth={2.5}
                  aria-hidden
                />
              </button>
            ) : null}
          </div>
          <ul className="mt-6 flex flex-col gap-3">
            {HOME_HIGHLIGHTS.map((label) => (
              <li
                key={label}
                className="flex items-center gap-2 text-base font-medium text-ink"
              >
                <CheckCircle2
                  className="size-6 shrink-0 text-ink"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
        <figure className="relative mx-auto w-full max-w-md lg:max-w-lg xl:max-w-none xl:scale-105 xl:origin-center">
          <img
            src="/images/bedrijf.png"
            alt="Onze installateurs bij een airco-installatie"
            width={567}
            height={566}
            className="h-auto w-full rounded-full object-cover shadow-[0_24px_60px_rgba(15,118,110,0.28),0_8px_20px_rgba(15,23,42,0.12)]"
          />
        </figure>
      </div>
    </section>
  )
}
