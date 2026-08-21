import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { INSULATION_OPTIONS, type InsulationFactor, type PowerResult } from '../lib/power'
import { dec } from '../lib/savings'

type PowerFormProps = {
  areaM2: number | null
  heightM: number
  insulationFactor: InsulationFactor
  result: PowerResult | null
  onAreaChange: (value: number | null) => void
  onHeightChange: (value: number) => void
  onInsulationChange: (value: InsulationFactor) => void
  onViewAircos: () => void
}

export default function PowerForm({
  areaM2,
  heightM,
  insulationFactor,
  result,
  onAreaChange,
  onHeightChange,
  onInsulationChange,
  onViewAircos,
}: PowerFormProps) {
  return (
    <form
      id="vermogen"
      className="scroll-mt-4 rounded-3xl border border-white/10 bg-white/8 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6"
      onSubmit={(event) => event.preventDefault()}
    >
      <p className="text-xs font-medium tracking-[0.2em] text-mint uppercase">
        Stap 1
      </p>
      <h2 className="mt-2 font-display text-2xl text-white">
        Bereken het vermogen
      </h2>
      <p className="mt-2 text-sm text-white/70">
        Bereken snel het benodigde koel- en verwarmingsvermogen (kW) voor jouw
        ruimte.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white/80">
            Oppervlakte ruimte (m²)
          </span>
          <input
            type="number"
            min={1}
            max={200}
            step={1}
            placeholder="bijv. 30"
            value={areaM2 ?? ''}
            onChange={(event) => {
              const next = event.target.value
              onAreaChange(next === '' ? null : Number(next))
            }}
            className="w-full rounded-xl border border-white/15 bg-white/8 px-3 py-2.5 text-white outline-none placeholder:text-white/35 focus:border-mint"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white/80">
            Hoogte ruimte (meter)
          </span>
          <input
            type="number"
            min={1.8}
            max={5}
            step={0.1}
            value={heightM}
            onChange={(event) => onHeightChange(Number(event.target.value))}
            className="w-full rounded-xl border border-white/15 bg-white/8 px-3 py-2.5 text-white outline-none focus:border-mint"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-medium text-white/80">
            Isolatiegraad van de ruimte
          </span>
          <select
            value={insulationFactor}
            onChange={(event) =>
              onInsulationChange(Number(event.target.value) as InsulationFactor)
            }
            className="w-full rounded-xl border border-white/15 bg-white/8 px-3 py-2.5 text-white outline-none focus:border-mint"
          >
            {INSULATION_OPTIONS.map((option) => (
              <option key={option.factor} value={option.factor} className="text-ink">
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {result ? (
        <a
          href="#modellen"
          onClick={onViewAircos}
          aria-label={`Kies een airco van minstens ${dec.format(result.requiredKw)} kW`}
          className={cn(
            'mt-6 block rounded-2xl border-l-4 border-mint bg-mint/15 px-4 py-5 text-center transition',
            'hover:bg-mint/25 focus-visible:ring-2 focus-visible:ring-mint focus-visible:outline-none',
          )}
        >
          <p className="text-sm text-white/70">Aanbevolen vermogen</p>
          <p className="mt-1 font-display text-4xl text-mint">
            {dec.format(result.requiredKw)} kW
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-mint">
            Kies een airco
            <ArrowRight className="size-3.5" aria-hidden />
          </p>
        </a>
      ) : (
        <div className="mt-6 rounded-2xl border-l-4 border-mint/40 bg-mint/10 px-4 py-5 text-center">
          <p className="text-sm text-white/70">Aanbevolen vermogen</p>
          <p className="mt-1 font-display text-4xl text-mint/70">0,0 kW</p>
          <p className="mt-2 text-xs text-white/55">
            Vul de oppervlakte in om een advies te krijgen.
          </p>
        </div>
      )}
    </form>
  )
}
