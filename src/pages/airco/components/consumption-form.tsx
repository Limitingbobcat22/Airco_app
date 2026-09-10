import type { Airco } from '../data/aircos'
import { dec } from '../lib/savings'

type ConsumptionFormProps = {
  yearlyGas: number
  gasPrice: number
  elecPrice: number
  airco: Airco | null
  onYearlyGasChange: (value: number) => void
  onGasPriceChange: (value: number) => void
  onElecPriceChange: (value: number) => void
}

function NumberField({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  unit: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink/70">{label}</span>
      <div className="relative">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full rounded-xl border border-mist bg-white px-3 py-2.5 pr-16 text-ink outline-none focus:border-teal"
        />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-ink/45">
          {unit}
        </span>
      </div>
    </label>
  )
}

export default function ConsumptionForm({
  yearlyGas,
  gasPrice,
  elecPrice,
  airco,
  onYearlyGasChange,
  onGasPriceChange,
  onElecPriceChange,
}: ConsumptionFormProps) {
  return (
    <section
      id="verbruik"
      className="hero-bg relative mt-4 scroll-mt-4 overflow-hidden rounded-3xl px-4 py-8 sm:mt-6 sm:px-6 sm:py-12"
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-xs font-medium tracking-[0.2em] text-teal uppercase">
            Stap 3
          </p>
          <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
            Bereken uw besparing
          </h2>
          <p className="mt-3 text-ink/70">
            Vul uw jaarlijks gasverbruik en energietarieven in. We rekenen direct
            uit wat u per jaar bespaart met de gekozen airco.
          </p>
        </div>

        <form
          className="mt-8"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Uw jaarlijks gasverbruik (m³)"
                unit="m³"
                value={yearlyGas}
                min={0}
                max={10000}
                step={50}
                onChange={onYearlyGasChange}
              />
              <NumberField
                label="Huidige gasprijs (€ per m³)"
                unit="€ / m³"
                value={gasPrice}
                min={0}
                max={5}
                step={0.01}
                onChange={onGasPriceChange}
              />
              <NumberField
                label="Huidige stroomprijs (€ per kWh)"
                unit="€ / kWh"
                value={elecPrice}
                min={0}
                max={2}
                step={0.01}
                onChange={onElecPriceChange}
              />
            </div>

            {airco ? (
              <p className="mt-6 rounded-2xl border border-mist bg-foam px-4 py-3 text-sm text-ink/70">
                Gekozen model:{' '}
                <span className="font-medium text-ink">
                  {airco.brand} {airco.model}
                </span>
                {' · '}
                SCOP {dec.format(airco.scop)} ({airco.energyClassHeating})
              </p>
            ) : (
              <p className="mt-6 rounded-2xl border border-dashed border-mist bg-foam px-4 py-3 text-sm text-ink/55">
                Kies eerst een airco in stap 2 om de besparing te berekenen.
              </p>
            )}
        </form>
      </div>
    </section>
  )
}
