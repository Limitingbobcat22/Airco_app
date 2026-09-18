import { useMemo } from 'react'
import type { Airco } from '../data/aircos'
import { maxCoolingKw } from '../lib/power'
import { dec } from '../lib/savings'
import AircoCard from './airco-card'

type AircoGridProps = {
  aircos: Airco[]
  selectedId: string | null
  requiredKw: number | null
  onSelect: (id: string | null) => void
}

export default function AircoGrid({
  aircos,
  selectedId,
  requiredKw,
  onSelect,
}: AircoGridProps) {
  const visible = useMemo(() => {
    const list =
      requiredKw != null
        ? aircos.filter((airco) => maxCoolingKw(airco) >= requiredKw)
        : aircos

    return [...list].sort((left, right) => left.priceEur - right.priceEur)
  }, [aircos, requiredKw])

  const bestChoiceId = useMemo(() => {
    if (requiredKw == null || visible.length === 0) return null

    return visible.reduce((best, airco) =>
      airco.priceEur < best.priceEur ? airco : best,
    ).id
  }, [requiredKw, visible])

  const intro =
    requiredKw == null
      ? 'Bereken eerst het vermogen in stap 1. Kies daarna zelf een airco die bij dat vermogen past.'
      : visible.length === 0
        ? `Uw ruimte vraagt ${dec.format(requiredKw)} kW. Geen van de aircos heeft voldoende koelvermogen. Pas de berekening in stap 1 aan.`
        : `Uw ruimte vraagt ${dec.format(requiredKw)} kW. Alleen aircos met voldoende koelvermogen worden getoond. De beste keuze is oranje gemarkeerd.`

  return (
    <section
      id="modellen"
      className="hero-bg page-block relative mx-2 mt-4 scroll-mt-4 overflow-hidden rounded-3xl px-4 py-8 sm:mx-4 sm:mt-6 sm:px-6 sm:py-12"
    >
      <div className="relative">
        <p className="text-sm font-medium tracking-[0.2em] text-orange-500 uppercase sm:text-base">
          Stap 2
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Kies een airco
        </h2>
        <p className="mt-3 text-ink/70">{intro}</p>
      </div>
      {visible.length === 0 ? (
        <p className="relative mt-8 rounded-2xl border border-mist bg-white/70 px-5 py-8 text-center text-sm text-ink/60">
          {requiredKw != null
            ? 'Er zijn geen passende aircos voor dit vermogen.'
            : 'Er zijn nog geen aircos beschikbaar.'}
        </p>
      ) : (
        <div className="relative mt-8 grid gap-6 2xl:grid-cols-2 2xl:gap-8">
          {visible.map((airco) => (
            <AircoCard
              key={airco.id}
              airco={airco}
              selected={selectedId === airco.id}
              requiredKw={requiredKw}
              isBestChoice={airco.id === bestChoiceId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </section>
  )
}
