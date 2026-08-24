import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  defaultSectionForTopic,
  KETEL_SECTIONS,
  KETEL_TOPIC,
  topicSectionPath,
} from '@/lib/topics'
import { useUnsavedChanges } from '@/providers/unsaved-changes'
import { KETELS, type Ketel } from './data/ketels'

const eur = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

function StepHeader({
  step,
  title,
  description,
}: {
  step: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium tracking-[0.2em] text-teal uppercase">
        {step}
      </p>
      <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{title}</h2>
      <p className="mt-3 text-ink/70">{description}</p>
    </div>
  )
}

function KetelCard({
  ketel,
  selected,
  onSelect,
}: {
  ketel: Ketel
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'rounded-3xl border p-5 text-left transition sm:p-6',
        selected
          ? 'border-teal bg-white ring-4 ring-mint/30'
          : 'border-mist bg-white/90 hover:border-teal/40',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-teal">{ketel.tag}</p>
          <h3 className="mt-1 font-display text-2xl text-ink">
            {ketel.brand} {ketel.series}
          </h3>
        </div>
        {selected ? (
          <span className="grid size-9 place-items-center rounded-full bg-mint text-ink">
            <Check className="size-4" strokeWidth={3} aria-hidden />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">{ketel.description}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-ink/70">
        <div>
          <dt className="text-xs tracking-wide text-ink/45 uppercase">Vermogen</dt>
          <dd className="mt-1 font-semibold text-ink">{ketel.powerKw} kW</dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-ink/45 uppercase">Rendement</dt>
          <dd className="mt-1 font-semibold text-ink">{ketel.efficiencyPct}%</dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-ink/45 uppercase">Type</dt>
          <dd className="mt-1 font-semibold text-ink">{ketel.fuel}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-ink/45 uppercase">Vanaf</dt>
          <dd className="mt-1 font-semibold text-ink">{eur.format(ketel.priceEur)}</dd>
        </div>
      </dl>
    </button>
  )
}

export default function KetelPage() {
  const { section } = useParams()
  const { setDirty } = useUnsavedChanges()
  const [persons, setPersons] = useState(3)
  const [bathrooms, setBathrooms] = useState(1)
  const [yearlyGas, setYearlyGas] = useState(1400)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    const dirty =
      persons !== 3 ||
      bathrooms !== 1 ||
      yearlyGas !== 1400 ||
      selectedId != null
    setDirty(dirty)
    return () => setDirty(false)
  }, [persons, bathrooms, yearlyGas, selectedId, setDirty])

  const selected = KETELS.find((ketel) => ketel.id === selectedId) ?? null
  const estimatedKw = Math.max(18, persons * 4 + bathrooms * 6)
  const estimatedSave = selected
    ? Math.round(yearlyGas * 0.12 * (selected.efficiencyPct / 100))
    : null

  if (
    !section ||
    !KETEL_SECTIONS.includes(section as (typeof KETEL_SECTIONS)[number])
  ) {
    return (
      <Navigate
        to={topicSectionPath(KETEL_TOPIC, defaultSectionForTopic(KETEL_TOPIC))}
        replace
      />
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-foam">
      <div id="page-scroll" className="min-h-0 flex-1 overflow-y-auto pb-[45vh]">
        <section
          id="home"
          className="scroll-mt-4 bg-ink px-4 py-12 sm:px-6 sm:py-16"
        >
          <div className="mx-auto max-w-7xl 2xl:max-w-[110rem] 2xl:px-4">
            <p className="text-sm font-medium tracking-[0.22em] text-mint uppercase">
              Testomgeving · Ketels
            </p>
            <h1 className="mt-4 max-w-xl font-display text-4xl text-white sm:text-5xl">
              Vind de juiste ketel.
              <span className="mt-2 block text-mint">Stap voor stap.</span>
            </h1>
            <p className="mt-4 max-w-lg text-white/70">
              Dit is een testversie met nepdata. Later komt hier de echte
              berekening en productcatalogus.
            </p>

            <div
              id="vermogen"
              className="mt-8 max-w-xl scroll-mt-4 rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-xl sm:p-6"
            >
              <p className="text-xs font-medium tracking-[0.2em] text-mint uppercase">
                Stap 1
              </p>
              <h2 className="mt-2 font-display text-2xl text-white">
                Schat het vermogen
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Vul een paar basisgegevens in. We tonen een geschat ketelvermogen
                (mock).
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-white/70">
                    Aantal personen
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={persons}
                    onChange={(event) => setPersons(Number(event.target.value))}
                    className="w-full rounded-xl border border-white/15 bg-ink/40 px-3 py-2.5 text-white outline-none focus:border-mint"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-white/70">
                    Badkamers
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={bathrooms}
                    onChange={(event) =>
                      setBathrooms(Number(event.target.value))
                    }
                    className="w-full rounded-xl border border-white/15 bg-ink/40 px-3 py-2.5 text-white outline-none focus:border-mint"
                  />
                </label>
              </div>
              <p className="mt-5 rounded-2xl bg-mint/15 px-4 py-3 text-sm text-mint">
                Geschat vermogen:{' '}
                <span className="font-semibold text-white">{estimatedKw} kW</span>
              </p>
            </div>
          </div>
        </section>

        <section
          id="modellen"
          className="mx-auto max-w-7xl scroll-mt-4 px-4 py-12 sm:px-6 sm:py-16 2xl:max-w-[110rem] 2xl:px-10"
        >
          <StepHeader
            step="Stap 2"
            title="Kies een ketel"
            description="Nepmodellen ter illustratie. Selecteer er één om verder te gaan."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {KETELS.map((ketel) => (
              <KetelCard
                key={ketel.id}
                ketel={ketel}
                selected={selectedId === ketel.id}
                onSelect={() =>
                  setSelectedId((prev) => (prev === ketel.id ? null : ketel.id))
                }
              />
            ))}
          </div>
        </section>

        <section
          id="verbruik"
          className="mx-auto max-w-7xl scroll-mt-4 px-4 py-12 sm:px-6 sm:py-16 2xl:max-w-[110rem] 2xl:px-10"
        >
          <StepHeader
            step="Stap 3"
            title="Uw gasverbruik"
            description="Vul een jaarverbruik in. De besparing hieronder is een mock-schatting."
          />
          <form
            className="mt-8 max-w-xl rounded-3xl border border-mist bg-white p-5 shadow-sm sm:p-6"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink/70">
                Jaarlijks gasverbruik
              </span>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={10000}
                  step={50}
                  value={yearlyGas}
                  onChange={(event) => setYearlyGas(Number(event.target.value))}
                  className="w-full rounded-xl border border-mist bg-foam px-3 py-2.5 pr-16 text-ink outline-none focus:border-teal"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-ink/45">
                  m³
                </span>
              </div>
            </label>
            {selected ? (
              <p className="mt-5 rounded-2xl border border-mist bg-foam px-4 py-3 text-sm text-ink/70">
                Gekozen:{' '}
                <span className="font-medium text-ink">
                  {selected.brand} {selected.series}
                </span>
              </p>
            ) : (
              <p className="mt-5 rounded-2xl border border-dashed border-mist bg-foam px-4 py-3 text-sm text-ink/55">
                Kies eerst een ketel in stap 2.
              </p>
            )}
          </form>
        </section>

        <section
          id="overzicht"
          className="mx-auto max-w-7xl scroll-mt-4 px-4 py-12 sm:px-6 sm:py-16 2xl:max-w-[110rem] 2xl:px-10"
        >
          <StepHeader
            step="Stap 4"
            title="Overzicht"
            description="Samenvatting van uw testkeuze. Offerte en echte berekening volgen later."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-mist bg-white p-5 sm:p-6">
              <p className="text-xs font-medium tracking-wide text-teal uppercase">
                Uw situatie
              </p>
              <dl className="mt-4 space-y-3 text-sm text-ink/75">
                <div className="flex justify-between gap-3">
                  <dt>Personen</dt>
                  <dd className="font-medium text-ink">{persons}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Badkamers</dt>
                  <dd className="font-medium text-ink">{bathrooms}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Geschat vermogen</dt>
                  <dd className="font-medium text-ink">{estimatedKw} kW</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Gasverbruik</dt>
                  <dd className="font-medium text-ink">{yearlyGas} m³</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl bg-deep p-5 text-white sm:p-6">
              <p className="text-xs font-medium tracking-wide text-mint uppercase">
                Gekozen ketel
              </p>
              {selected ? (
                <>
                  <p className="mt-3 font-display text-2xl sm:text-3xl">
                    {selected.brand} {selected.series}
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    {selected.powerKw} kW · {selected.fuel} · rendement{' '}
                    {selected.efficiencyPct}%
                  </p>
                  <p className="mt-5 font-display text-3xl text-mint">
                    {eur.format(selected.priceEur)}
                  </p>
                  <p className="mt-1 text-sm text-white/55">vanaf · mockprijs</p>
                  {estimatedSave != null ? (
                    <p className="mt-4 text-sm text-white/75">
                      Indicatieve gaswinst: ±{estimatedSave} m³ / jaar (mock)
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="mt-3 text-sm text-white/65">
                  Selecteer een ketel om het overzicht te vullen.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
