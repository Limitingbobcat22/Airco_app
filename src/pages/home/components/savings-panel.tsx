import type { Airco } from '../data/aircos'
import { type InsulationFactor, insulationLabel } from '../lib/power'
import { ENERGY, dec, eur, num, type SavingsResult } from '../lib/savings'

type SavingsPanelProps = {
  airco: Airco | null
  savings: SavingsResult | null
  requiredKw: number | null
  areaM2: number | null
  heightM: number
  insulationFactor: InsulationFactor
}

export default function SavingsPanel({
  airco,
  savings,
  requiredKw,
  areaM2,
  heightM,
  insulationFactor,
}: SavingsPanelProps) {
  if (!airco || !savings) {
    return (
      <section id="overzicht" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-12 sm:px-6 min-h-[60vh]">
        <div className="rounded-3xl border border-dashed border-teal/30 bg-white p-8 text-center text-ink/60">
          Kies een airco om je overzicht en indicatieve offerte te zien.
        </div>
      </section>
    )
  }

  return (
    <section id="overzicht" className="scroll-mt-4 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-medium tracking-[0.2em] text-teal uppercase">
          Stap 4
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Overzicht {airco.brand} {airco.series} {airco.sizeCode}
        </h2>
        <p className="mt-3 max-w-2xl text-ink/70">
          Je besparing, het passende vermogen en een indicatieve offerte op
          basis van de gekozen airco.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-mist bg-white p-5 sm:p-6">
            <p className="text-xs font-medium tracking-wide text-teal uppercase">
              Jouw ruimte
            </p>
            <dl className="mt-4 space-y-3 text-sm text-ink/75">
              <div className="flex justify-between gap-3">
                <dt>Oppervlakte</dt>
                <dd className="font-medium text-ink">
                  {areaM2 ? `${areaM2} m²` : '–'}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Hoogte</dt>
                <dd className="font-medium text-ink">{dec.format(heightM)} m</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Isolatie</dt>
                <dd className="font-medium text-ink">
                  {insulationLabel(insulationFactor, true)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Berekend vermogen</dt>
                <dd className="font-medium text-ink">
                  {requiredKw != null ? `${dec.format(requiredKw)} kW` : '–'}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Gekozen model</dt>
                <dd className="font-medium text-ink">
                  {airco.sizeCode} · {dec.format(airco.coolingKw)} kW
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-mist bg-white p-5 sm:p-6">
            <p className="text-xs font-medium tracking-wide text-teal uppercase">
              Besparing per jaar
            </p>
            <p className="mt-3 font-display text-3xl text-ink">
              {eur.format(savings.yearly.netEuroSaved)}
            </p>
            <p className="mt-1 text-sm text-ink/55">netto voordeel</p>
            <dl className="mt-5 space-y-3 text-sm text-ink/75">
              <div className="flex justify-between gap-3">
                <dt>Minder gas</dt>
                <dd className="font-medium text-ink">
                  {num.format(savings.yearly.gasM3Saved)} m³
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Stroomdelta</dt>
                <dd className="font-medium text-ink">
                  {num.format(Math.abs(savings.yearly.extraElecKwh))} kWh
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>CO₂-winst</dt>
                <dd className="font-medium text-ink">
                  {num.format(savings.yearly.co2SavedKg)} kg
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl bg-deep p-5 text-white sm:p-6">
            <p className="text-xs font-medium tracking-wide text-mint uppercase">
              Indicatieve offerte
            </p>
            <p className="mt-3 font-display text-3xl">
              {eur.format(airco.priceEur)}
            </p>
            <p className="mt-1 text-sm text-white/60">incl. plaatsing, indicatie</p>
            <dl className="mt-5 space-y-3 text-sm text-white/75">
              <div className="flex justify-between gap-3">
                <dt>Model</dt>
                <dd className="font-medium text-white">
                  {airco.series} {airco.sizeCode}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Vermogen</dt>
                <dd className="font-medium text-white">
                  {dec.format(airco.coolingKw)} / {dec.format(airco.heatingKw)} kW
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Terugverdientijd</dt>
                <dd className="font-medium text-white">
                  {savings.paybackYears
                    ? `${dec.format(savings.paybackYears)} jaar`
                    : 'n.v.t.'}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-mint py-3 text-sm font-semibold text-ink hover:bg-white"
            >
              Offerte aanvragen
            </button>
            <p className="mt-3 text-xs text-white/45">
              Zonder subsidie, mockupprijs.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-mist bg-white p-5 sm:p-6">
          <h3 className="font-display text-xl">Uitgangspunten</h3>
          <ul className="mt-4 grid gap-3 text-sm text-ink/75 lg:grid-cols-2">
            <li>
              {num.format(ENERGY.spaceHeatingShare * 100)}% van je gas is
              ruimteverwarming. Dit model dekt daarvan{' '}
              {num.format(airco.heatingCoverage * 100)}%.
            </li>
            <li>
              1 m³ gas ≈ {ENERGY.gasKwhPerM3} kWh warmte, cv-ketel{' '}
              {num.format(ENERGY.boilerEfficiency * 100)}% rendement. De airco
              levert die warmte met SCOP {airco.scop}.
            </li>
            <li>
              Koelen: {num.format(ENERGY.coolingShareOfElec * 100)}% van je
              stroom telt als koeling, vergeleken met SEER{' '}
              {ENERGY.oldCoolingSeer} vs. {airco.seer}.
            </li>
            <li>
              Prijzen: gas {eur.format(ENERGY.gasPriceEur)}/m³, stroom{' '}
              {eur.format(ENERGY.elecPriceEur)}/kWh. CO₂:{' '}
              {ENERGY.co2GasKgPerM3} kg/m³ gas en {ENERGY.co2ElecKgPerKwh}{' '}
              kg/kWh (NL-mix 2026).
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
