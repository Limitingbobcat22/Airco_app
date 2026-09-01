import PopupModal from '@/components/shared/popup-modal'
import { CreateKlantForm } from '@/pages/klant'
import type { Airco } from '../data/aircos'
import {
  SAVINGS_CONSTANTS,
  dec,
  eur,
  eurExact,
  num,
  type SavingsResult,
} from '../lib/savings'

type SavingsPanelProps = {
  airco: Airco | null
  savings: SavingsResult | null
  requiredKw: number | null
  areaM2: number | null
  heightM: number
  heatingSharePct: number
  gasPrice: number
  elecPrice: number
  yearlyGas: number
}

export default function SavingsPanel({
  airco,
  savings,
  requiredKw,
  areaM2,
  heightM,
  heatingSharePct,
  gasPrice,
  elecPrice,
  yearlyGas,
}: SavingsPanelProps) {
  if (!airco || !savings) {
    return (
      <section id="overzicht" className="mx-auto max-w-7xl scroll-mt-4 px-4 py-8 sm:px-6 min-h-[60vh] 2xl:max-w-[110rem] 2xl:px-10">
        <div className="rounded-3xl border border-dashed border-teal/30 bg-white p-8 text-center text-ink/60">
          Kies een airco om uw overzicht en geschatte netto voordeel te zien.
        </div>
      </section>
    )
  }

  return (
    <section id="overzicht" className="mx-auto max-w-7xl scroll-mt-4 px-4 py-8 sm:px-6 sm:py-10 2xl:max-w-[110rem] 2xl:px-10">
      <div>
        <p className="text-xs font-medium tracking-[0.2em] text-teal uppercase">
          Stap 4
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Overzicht {airco.brand} {airco.model}
        </h2>
        <p className="mt-3 max-w-2xl text-ink/70">
          Uw geschatte netto voordeel en het passende vermogen op basis van de
          gekozen airco. De exacte prijs bespreken we samen op afspraak.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-mist bg-white p-5 sm:p-6">
            <p className="text-xs font-medium tracking-wide text-teal uppercase">
              Uw ruimte
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
                <dt>Aandeel airco</dt>
                <dd className="font-medium text-ink">{heatingSharePct}%</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Berekend vermogen</dt>
                <dd className="font-medium text-ink">
                  {requiredKw != null ? `${dec.format(requiredKw)} kW` : '–'}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Koel vermogen</dt>
                <dd className="font-medium text-ink">
                  {dec.format(airco.coolingKw)} kW
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-mist bg-white p-5 sm:p-6">
            <p className="text-xs font-medium tracking-wide text-teal uppercase">
              Geschat netto voordeel
            </p>
            <p className="mt-3 font-display text-3xl text-ink">
              {eur.format(savings.yearly.netEuroSaved)}
            </p>
            <p className="mt-1 text-sm text-ink/55">per jaar</p>
            <dl className="mt-5 space-y-3 text-sm text-ink/75">
              <div className="flex justify-between gap-3">
                <dt>Per maand</dt>
                <dd className="font-medium text-ink">
                  {eur.format(savings.monthly.netEuroSaved)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Minder gas</dt>
                <dd className="font-medium text-ink">
                  {num.format(savings.yearly.gasM3Saved)} m³
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Extra stroom</dt>
                <dd className="font-medium text-ink">
                  {num.format(savings.yearly.extraElecKwh)} kWh
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
              Volgende stap
            </p>
            <p className="mt-3 font-display text-2xl leading-snug sm:text-3xl">
              Prijs op maat via afspraak
            </p>
            <p className="mt-2 text-sm text-white/70">
              Na dit overzicht plannen we een afspraak. Dan bespreken we de
              exacte prijs en installatie voor uw situatie.
            </p>
            <dl className="mt-5 space-y-3 text-sm text-white/75">
              <div className="flex justify-between gap-3">
                <dt>Model</dt>
                <dd className="font-medium text-white">
                  {airco.model}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Koel vermogen</dt>
                <dd className="font-medium text-white">
                  {dec.format(airco.coolingKw)} kW
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Netto voordeel</dt>
                <dd className="font-medium text-white">
                  {eur.format(savings.yearly.netEuroSaved)} / jaar
                </dd>
              </div>
            </dl>
            <PopupModal
              maxWidth="md:max-w-[720px]"
              maxHeight="max-h-[85dvh]"
              renderButton={(onClick) => (
                <button
                  type="button"
                  onClick={onClick}
                  className="mt-6 w-full rounded-xl bg-mint py-3 text-sm font-semibold text-ink hover:bg-white"
                >
                  Offerte aanvragen
                </button>
              )}
              renderModal={(onClose) => (
                <CreateKlantForm
                  onClose={onClose}
                  offerte={{
                    aircoId: airco.id,
                    aircoLabel: `${airco.brand} ${airco.model}`,
                    coolingKw: airco.coolingKw,
                    heatingKw: airco.heatingKw,
                    areaM2,
                    heightM,
                    heatingSharePct,
                    requiredKw,
                    yearlyGasM3: yearlyGas,
                    gasPriceEur: gasPrice,
                    elecPriceEur: elecPrice,
                    netEuroSavedYearly: savings.yearly.netEuroSaved,
                  }}
                />
              )}
            />
            <p className="mt-3 text-xs text-white/45">
              Geen vaste catalogusprijs — alles op maat.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-mist bg-white p-5 sm:p-6">
          <h3 className="font-display text-xl">Uitgangspunten</h3>
          <ul className="mt-4 grid gap-3 text-sm text-ink/75 lg:grid-cols-2">
            <li>
              {heatingSharePct}% van uw jaarlijkse gasverbruik wordt
              vervangen door verwarming via de airco.
            </li>
            <li>
              1 m³ gas ≈ {SAVINGS_CONSTANTS.gasKwhPerM3} kWh warmte. De airco
              levert die warmte met SCOP {dec.format(airco.scop)}.
            </li>
            <li>
              Tarieven: gas {eurExact.format(gasPrice)}/m³, stroom{' '}
              {eurExact.format(elecPrice)}/kWh.
            </li>
            <li>
              CO₂-reductie: {SAVINGS_CONSTANTS.co2GasKgPerM3} kg per m³
              bespaard gas.
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
