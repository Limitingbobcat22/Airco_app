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

function compareByBestFit(left: Airco, right: Airco, requiredKw: number | null) {
  if (requiredKw != null) {
    const leftFits = maxCoolingKw(left) >= requiredKw
    const rightFits = maxCoolingKw(right) >= requiredKw
    if (leftFits !== rightFits) return leftFits ? -1 : 1
  }

  return left.priceEur - right.priceEur
}

export default function AircoGrid({
  aircos,
  selectedId,
  requiredKw,
  onSelect,
}: AircoGridProps) {
  const sorted = useMemo(
    () => [...aircos].sort((left, right) => compareByBestFit(left, right, requiredKw)),
    [aircos, requiredKw],
  )

  const bestChoiceId = useMemo(() => {
    if (requiredKw == null) return null

    const suitable = aircos.filter(
      (airco) => maxCoolingKw(airco) >= requiredKw,
    )
    if (suitable.length === 0) return null

    return suitable.reduce((best, airco) =>
      airco.priceEur < best.priceEur ? airco : best,
    ).id
  }, [aircos, requiredKw])

  return (
    <section
      id="modellen"
      className="hero-bg page-block relative mx-2 mt-4 scroll-mt-4 overflow-hidden rounded-3xl px-4 py-8 sm:mx-4 sm:mt-6 sm:px-6 sm:py-12"
    >
      <div className="relative">
        <p className="text-sm font-medium tracking-[0.2em] text-teal uppercase sm:text-base">
          Stap 2
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Kies een airco
        </h2>
        <p className="mt-3 text-ink/70">
          {requiredKw != null
            ? `Uw ruimte vraagt ${dec.format(requiredKw)} kW. Geschikte modellen zijn groen gemarkeerd, selecteer een model wat bij uw ruimte past.`
            : 'Bereken eerst het vermogen in stap 1. Kies daarna zelf een airco die bij dat vermogen past.'}
        </p>
      </div>
      <div className="relative mt-8 grid gap-6 2xl:grid-cols-2 2xl:gap-8">
        {sorted.map((airco) => (
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
    </section>
  )
}
