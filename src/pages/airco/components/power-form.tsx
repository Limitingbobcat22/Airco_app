import { ArrowRight, Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { type PowerResult } from '../lib/power'
import { dec } from '../lib/savings'

type PowerFormProps = {
  areaM2: number | null
  heightM: number
  heatingSharePct: number
  result: PowerResult | null
  onAreaChange: (value: number | null) => void
  onHeightChange: (value: number) => void
  onHeatingShareChange: (value: number) => void
  onViewAircos: () => void
}

function ResultPanel({
  result,
  onViewAircos,
}: {
  result: PowerResult | null
  onViewAircos: () => void
}) {
  if (result) {
    return (
      <button
        type="button"
        onClick={onViewAircos}
        aria-label={`Kies een airco van minstens ${dec.format(result.requiredKw)} kW`}
        className={cn(
          'flex h-full min-h-40 w-full flex-col justify-center rounded-2xl border-l-4 border-teal bg-foam px-5 py-6 text-center transition lg:min-h-full lg:px-6',
          'hover:bg-mist/70 focus-visible:ring-2 focus-visible:ring-teal focus-visible:outline-none',
        )}
      >
        <p className="text-sm text-ink/60">Aanbevolen vermogen</p>
        <p className="mt-1 font-display text-4xl text-teal lg:text-5xl">
          {dec.format(result.requiredKw)} kW
        </p>
        <p className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-teal">
          Kies een airco
          <ArrowRight className="size-3.5" aria-hidden />
        </p>
      </button>
    )
  }

  return (
    <div className="flex h-full min-h-40 w-full flex-col justify-center rounded-2xl border-l-4 border-teal/40 bg-foam px-5 py-6 text-center lg:min-h-full lg:px-6">
      <p className="text-sm text-ink/60">Aanbevolen vermogen</p>
      <p className="mt-1 font-display text-4xl text-teal/70 lg:text-5xl">0,0 kW</p>
      <p className="mt-3 text-xs text-ink/50">
        Vul de oppervlakte in om een advies te krijgen.
      </p>
    </div>
  )
}

export default function PowerForm({
  areaM2,
  heightM,
  heatingSharePct,
  result,
  onAreaChange,
  onHeightChange,
  onHeatingShareChange,
  onViewAircos,
}: PowerFormProps) {
  return (
    <section
      id="vermogen"
      className="mx-auto max-w-7xl scroll-mt-4 px-4 py-8 sm:px-6 sm:py-10 2xl:max-w-[110rem] 2xl:px-10"
    >
      <div className="max-w-3xl">
        <p className="text-xs font-medium tracking-[0.2em] text-teal uppercase">
          Stap 1
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Bereken het vermogen
        </h2>
        <p className="mt-3 text-ink/70">
          Bereken het benodigde vermogen op basis van uw ruimte en welk deel
          van de woning de airco verwarmt.
        </p>
      </div>

      <form
        className="mt-8 rounded-3xl border border-mist bg-white p-5 shadow-sm sm:p-6 lg:p-8"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(16rem,0.75fr)] lg:items-stretch lg:gap-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink/70">
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
                className="w-full rounded-xl border border-mist bg-foam px-3 py-2.5 text-ink outline-none placeholder:text-ink/35 focus:border-teal"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink/70">
                Hoogte ruimte (meter)
              </span>
              <input
                type="number"
                min={1.8}
                max={5}
                step={0.1}
                value={heightM}
                onChange={(event) => onHeightChange(Number(event.target.value))}
                className="w-full rounded-xl border border-mist bg-foam px-3 py-2.5 text-ink outline-none focus:border-teal"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-ink/70">
                <span className="inline-flex items-center gap-1.5">
                  Deel van de woning verwarmd via airco
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-ink/45 transition hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                          aria-label="Meer informatie over dit veld"
                          onClick={(event) => event.preventDefault()}
                        >
                          <Info className="size-3.5" strokeWidth={2.25} aria-hidden />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        align="start"
                        className="max-w-xs text-left leading-relaxed"
                      >
                        Geef aan welk percentage van uw woning u met de airco
                        wilt verwarmen. Dit beïnvloedt het benodigde vermogen én
                        de geschatte besparing op gasverbruik.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
                <span className="shrink-0 font-semibold text-teal">
                  {heatingSharePct}%
                </span>
              </span>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={heatingSharePct}
                onChange={(event) =>
                  onHeatingShareChange(Number(event.target.value))
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-mist accent-teal"
              />
            </label>
          </div>

          <ResultPanel result={result} onViewAircos={onViewAircos} />
        </div>
      </form>
    </section>
  )
}
