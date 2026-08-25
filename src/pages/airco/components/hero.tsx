import { ArrowRight, Gauge, Wind } from 'lucide-react'
import { useGoToSection } from '@/hooks/use-go-to-section'

export default function Hero() {
  const goToSection = useGoToSection()

  return (
    <section
      id="home"
      className="relative scroll-mt-4 overflow-hidden bg-ink px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(62,224,192,0.28),transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(14,116,144,0.4),transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] mt-4">
        <div>
          <p className="text-sm font-medium tracking-[0.22em] text-mint uppercase">
            Duurzame Airconditioning op Maat
          </p>
          <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.05] text-white sm:text-6xl">
            Koel in de zomer.
            <span className="block text-mint">Bespaar in de winter.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-white/75 sm:text-lg">
            Bereken het vermogen voor uw ruimte, of bekijk meteen alle Haier-
            en Mitsubishi-modellen. De prijs bespreken we daarna op afspraak.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => goToSection('vermogen')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-5 py-3 text-sm font-semibold text-ink transition hover:bg-mint/90 focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
            >
              <Gauge className="size-4" aria-hidden />
              Bereken vermogen
              <ArrowRight className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => goToSection('modellen')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
            >
              <Wind className="size-4" aria-hidden />
              Bekijk alle aircos
            </button>
          </div>
        </div>
        <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
          <img
            src="/images/bedrijf.png"
            alt="Onze installateurs bij een airco-installatie"
            width={567}
            height={566}
            className="h-auto w-full rounded-full object-cover shadow-[0_20px_80px_rgba(0,0,0,0.25)]"
          />
        </figure>
      </div>
    </section>
  )
}
