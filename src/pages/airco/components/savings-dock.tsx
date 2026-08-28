import { useState } from 'react'
import { ChevronsDown, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Airco } from '../data/aircos'
import { dec, eur, num, type SavingsResult } from '../lib/savings'

type SavingsDockProps = {
  airco: Airco | null
  savings: SavingsResult | null
  visible: boolean
}

function Tile({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string
  value: string
  hint: string
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        'min-w-0 rounded-2xl border px-3 py-2.5 shadow-sm sm:px-4 sm:py-3',
        accent
          ? 'border-mint/50 bg-mint text-ink'
          : 'border-mist bg-white text-ink',
      )}
    >
      <p
        className={cn(
          'text-[11px] font-medium sm:text-xs',
          accent ? 'text-ink/70' : 'text-ink/50',
        )}
      >
        {label}
      </p>
      <p className="font-display mt-0.5 truncate text-lg leading-tight sm:text-2xl">
        {value}
      </p>
      <p
        className={cn(
          'mt-0.5 truncate text-[10px] sm:text-xs',
          accent ? 'text-ink/55' : 'text-ink/40',
        )}
      >
        {hint}
      </p>
    </div>
  )
}

export default function SavingsDock({ airco, savings, visible }: SavingsDockProps) {
  const [expanded, setExpanded] = useState(true)
  const hasSavings = airco != null && savings != null
  const showTiles = visible && hasSavings && expanded

  return (
    <div
      className={cn(
        'grid shrink-0 transition-all duration-300',
        visible ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="border border-ink/15 bg-white shadow-[0_-4px_16px_rgba(7,20,28,0.04)]">
          <div
            className={cn(
              'flex items-center justify-between gap-3 px-3 sm:gap-4 sm:px-4',
              showTiles ? 'pt-3' : 'py-3 sm:py-3.5',
            )}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-ink/20 bg-foam text-teal shadow-sm sm:size-11">
                <Leaf className="size-5 sm:size-[1.35rem]" strokeWidth={2.25} aria-hidden />
              </span>
              <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5">
                {hasSavings ? (
                  <>
                    <p className="truncate text-base font-semibold text-ink sm:text-lg">
                      Besparing · {airco.brand} {airco.model}
                    </p>
                    {!showTiles ? (
                      <p className="truncate text-sm text-ink/55 sm:text-base">
                        {eur.format(savings.yearly.netEuroSaved)} / jaar
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="truncate text-sm text-ink/50 sm:text-base">
                    Kies een airco om de besparing te zien.
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              disabled={!hasSavings}
              className={cn(
                'grid size-10 shrink-0 place-items-center rounded-full border border-ink/20 bg-foam text-ink shadow-sm transition focus-visible:ring-2 focus-visible:ring-teal focus-visible:outline-none sm:size-11',
                hasSavings
                  ? 'hover:border-teal/40 hover:text-teal'
                  : 'cursor-default opacity-40',
              )}
              aria-expanded={showTiles}
              aria-label={
                showTiles
                  ? 'Besparingsblokken inklappen'
                  : 'Besparingsblokken uitklappen'
              }
            >
              <ChevronsDown
                className={cn(
                  'size-5 transition-transform duration-300 sm:size-[1.35rem]',
                  !showTiles && 'rotate-180',
                )}
                aria-hidden
              />
            </button>
          </div>

          <div
            className={cn(
              'grid transition-all duration-300',
              showTiles ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
            )}
          >
            <div className="min-h-0 overflow-hidden">
              {hasSavings ? (
                <div className="px-3 py-3 sm:px-4 sm:py-4">
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                    <Tile
                      accent
                      label="Geschat netto voordeel"
                      value={eur.format(savings.yearly.netEuroSaved)}
                      hint={`${eur.format(savings.monthly.netEuroSaved)} / maand`}
                    />
                    <Tile
                      label="Minder gas"
                      value={`${num.format(savings.yearly.gasM3Saved)} m³`}
                      hint={`${eur.format(savings.yearly.gasEuroSaved)} gaskosten`}
                    />
                    <Tile
                      label="Extra stroom"
                      value={`${num.format(savings.yearly.extraElecKwh)} kWh`}
                      hint={`${eur.format(savings.yearly.elecEuroDelta)} stroom`}
                    />
                    <Tile
                      label="CO₂-winst"
                      value={`${dec.format(savings.yearly.co2SavedKg / 1000)} t`}
                      hint={`${num.format(savings.yearly.co2SavedKg)} kg minder`}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
