import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Airco } from '../data/aircos'
import { applyCapacity, maxCoolingKw } from '../lib/power'
import { dec, eur } from '../lib/savings'

type AircoCardProps = {
  airco: Airco
  selected: boolean
  hasSelection: boolean
  requiredKw: number | null
  onSelect: (id: string) => void
}

export default function AircoCard({
  airco,
  selected,
  hasSelection,
  requiredKw,
  onSelect,
}: AircoCardProps) {
  const sized = applyCapacity(airco, requiredKw)
  const fits =
    requiredKw != null && maxCoolingKw(airco) >= requiredKw

  return (
    <button
      type="button"
      onClick={() => onSelect(airco.id)}
      aria-pressed={selected}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-3xl border text-left transition duration-200',
        selected
          ? 'bg-white shadow-[0_20px_50px_rgba(15,118,110,0.18)] ring-4 ring-mint/40'
          : 'bg-white/80 hover:-translate-y-1 hover:shadow-lg',
        fits
          ? 'border-2 border-mint'
          : selected
            ? 'border-teal'
            : 'border-mist hover:border-teal/40',
      )}
    >
      <div
        className="relative h-36 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${airco.accent}22, ${airco.accent}55)`,
        }}
      >
        <svg viewBox="0 0 220 96" className="h-full w-full" aria-hidden>
          <rect
            x="28"
            y="28"
            width="164"
            height="42"
            rx="12"
            fill="white"
            fillOpacity="0.92"
          />
          <rect x="40" y="40" width="140" height="4" rx="2" fill={airco.accent} />
          <rect
            x="40"
            y="50"
            width="140"
            height="4"
            rx="2"
            fill={airco.accent}
            opacity="0.55"
          />
          <rect
            x="40"
            y="60"
            width="90"
            height="4"
            rx="2"
            fill={airco.accent}
            opacity="0.3"
          />
        </svg>
        {selected ? (
          <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-mint text-ink shadow-md">
            <Check className="size-5" strokeWidth={3} aria-hidden />
            <span className="sr-only">Geselecteerd</span>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold tracking-wide text-teal uppercase">
          {airco.tag}
        </p>
        <h3 className="mt-1 font-display text-xl text-ink">
          {airco.brand} {airco.series}
        </h3>
        <p className="mt-2 text-sm text-ink/70">{airco.description}</p>

        <ul className="mt-4 space-y-1.5 text-sm text-ink/75">
          {airco.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check
                className="mt-0.5 size-4 shrink-0 text-teal"
                strokeWidth={2.5}
                aria-hidden
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xs text-ink/50">Indicatie incl. plaatsing</p>
            <p className="text-lg font-semibold">{eur.format(sized.priceEur)}</p>
          </div>
          <div className="min-w-0 text-right">
            <p className="text-xs text-ink/50">Max. koelvermogen</p>
            <p
              className={cn(
                'ml-auto w-fit text-lg font-semibold',
                requiredKw != null && !fits && 'text-ink/35',
                requiredKw != null && fits && !hasSelection && 'animate-kw-pulse',
                (requiredKw == null || (fits && hasSelection)) && 'text-teal',
              )}
            >
              {dec.format(maxCoolingKw(airco))} kW
            </p>
          </div>
        </div>
      </div>
    </button>
  )
}
