import { useMemo } from 'react'
import type { Airco } from '../data/aircos'
import { dec } from '../lib/savings'
import AircoCard from './airco-card'

type AircoGridProps = {
  aircos: Airco[]
  selectedId: string | null
  requiredKw: number | null
  onSelect: (id: string) => void
}

export default function AircoGrid({
  aircos,
  selectedId,
  requiredKw,
  onSelect,
}: AircoGridProps) {
  const byPrice = useMemo(
    () => [...aircos].sort((left, right) => left.priceEur - right.priceEur),
    [aircos],
  )

  return (
    <section id="modellen" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.2em] text-teal uppercase">
          Stap 2
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Kies een airco
        </h2>
        <p className="mt-3 text-ink/70">
          {requiredKw != null
            ? `Jouw ruimte vraagt ${dec.format(requiredKw)} kW. Modellen met een groene rand hebben genoeg max. vermogen.`
            : 'Bereken eerst het vermogen in stap 1. Kies daarna zelf een airco die bij dat vermogen past.'}
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {byPrice.map((airco) => (
          <AircoCard
            key={airco.id}
            airco={airco}
            selected={selectedId === airco.id}
            hasSelection={selectedId != null}
            requiredKw={requiredKw}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}
