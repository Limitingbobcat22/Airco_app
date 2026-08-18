import type { ReactNode } from 'react'

type HeroProps = {
  children: ReactNode
}

export default function Hero({ children }: HeroProps) {
  return (
    <section id="home" className="relative scroll-mt-4 overflow-hidden bg-ink px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16">
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
            Bereken het vermogen voor jouw ruimte, kies een Haier- of
            Mitsubishi-model, en zie wat je bespaart — tot een indicatieve
            offerte.
          </p>
        </div>
        {children}
      </div>
    </section>
  )
}
