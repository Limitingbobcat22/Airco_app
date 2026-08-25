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
  const showTiles = visible && expanded

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
              showTiles ? 'pt-3' : 'py-3.5 sm:py-4',
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/20 bg-foam text-teal shadow-sm sm:size-12">
                <Leaf className="size-5 sm:size-6" strokeWidth={2.25} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-ink sm:text-lg">
                  {airco && savings
                    ? `Besparing · ${airco.brand} ${airco.series}`
                    : 'Uw besparing'}
                </p>
                {!showTiles && airco && savings ? (
                  <p className="truncate text-sm text-ink/55 sm:text-base">
                    {eur.format(savings.yearly.netEuroSaved)} / jaar
                  </p>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/20 bg-foam text-ink shadow-sm transition hover:border-teal/40 hover:text-teal focus-visible:ring-2 focus-visible:ring-teal focus-visible:outline-none sm:size-12"
              aria-expanded={showTiles}
              aria-label={
                showTiles
                  ? 'Besparingsblokken inklappen'
                  : 'Besparingsblokken uitklappen'
              }
            >
              <ChevronsDown
                className={cn(
                  'size-5 transition-transform duration-300 sm:size-6',
                  showTiles && 'rotate-180',
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
              <div className="px-3 py-3 sm:px-4 sm:py-4">
                {airco && savings ? (
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
                ) : (
                  <p className="rounded-2xl border border-dashed border-mist bg-white px-4 py-6 text-center text-sm text-ink/50">
                    Kies een airco om de besparing te zien.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
