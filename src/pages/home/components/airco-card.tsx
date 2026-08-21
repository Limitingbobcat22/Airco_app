import { useRef, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Expand, ImageIcon, Info, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import PopupModal from '@/components/shared/popup-modal'
import type { Airco } from '../data/aircos'
import { maxCoolingKw } from '../lib/power'
import { dec, eur } from '../lib/savings'

type AircoCardProps = {
  airco: Airco
  selected: boolean
  requiredKw: number | null
  isBestChoice?: boolean
  onSelect: (id: string | null) => void
}

function coolingRangeLabel(airco: Airco) {
  const values = airco.availableCapacities.map((c) => c.coolingKw)
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min === max) return `${dec.format(min)} kW`
  return `${dec.format(min)} tot ${dec.format(max)} kW`
}

function AircoIllustration({
  accent,
  gradientId,
  className,
}: {
  accent: string
  gradientId: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 280 200"
      className={cn(
        'h-full w-full max-h-52 drop-shadow-sm md:max-h-none 2xl:max-h-64',
        className,
      )}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f3f7f6" />
        </linearGradient>
      </defs>
      <ellipse
        cx="140"
        cy="168"
        rx="78"
        ry="10"
        fill={accent}
        opacity="0.12"
      />
      <rect
        x="48"
        y="48"
        width="184"
        height="88"
        rx="18"
        fill={`url(#${gradientId})`}
        stroke="#d5e4e0"
        strokeWidth="1.5"
      />
      <rect
        x="64"
        y="72"
        width="152"
        height="5"
        rx="2.5"
        fill={accent}
        opacity="0.85"
      />
      <rect
        x="64"
        y="86"
        width="152"
        height="5"
        rx="2.5"
        fill={accent}
        opacity="0.45"
      />
      <rect
        x="64"
        y="100"
        width="104"
        height="5"
        rx="2.5"
        fill={accent}
        opacity="0.25"
      />
      <circle cx="204" cy="112" r="4" fill={accent} opacity="0.55" />
    </svg>
  )
}

const MOCK_PHOTOS = [
  { id: 'front', label: 'Vooraanzicht', hint: 'Mockupfoto 1 van 3' },
  { id: 'angle', label: 'Schuin aanzicht', hint: 'Mockupfoto 2 van 3' },
  { id: 'detail', label: 'Detail', hint: 'Mockupfoto 3 van 3' },
] as const

const TRUST_POINTS = [
  'Inclusief standaard montage',
  'F-gassen-gecertificeerde monteur',
] as const

function SpecRow({
  label,
  value,
  striped,
}: {
  label: string
  value: string
  striped?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between gap-4 px-3 py-2.5 text-sm',
        striped ? 'bg-foam/80' : 'bg-white',
      )}
    >
      <dt className="text-ink/55">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  )
}

function AircoPhotoPreview({
  airco,
  onClose,
  onCalculateSavings,
}: {
  airco: Airco
  onClose: () => void
  onCalculateSavings: () => void
}) {
  const [index, setIndex] = useState(0)
  const photo = MOCK_PHOTOS[index]
  const total = MOCK_PHOTOS.length

  const coolingValues = airco.availableCapacities.map((c) => c.coolingKw)
  const coolingMin = Math.min(...coolingValues)
  const coolingMax = Math.max(...coolingValues)
  const coolingRange =
    coolingMin === coolingMax
      ? `${dec.format(coolingMin)} kW`
      : `${dec.format(coolingMin)} – ${dec.format(coolingMax)} kW`

  const goPrev = () => setIndex((current) => (current - 1 + total) % total)
  const goNext = () => setIndex((current) => (current + 1) % total)

  const specs = [
    { label: 'Type', value: `${airco.model} (split)` },
    { label: 'Functie', value: 'Koelen en verwarmen' },
    { label: 'Capaciteit koelen', value: coolingRange },
    {
      label: 'Energielabel',
      value: `${airco.energyClassCooling} / ${airco.energyClassHeating}`,
    },
    { label: 'SEER', value: `Tot ${dec.format(airco.seer)}` },
    { label: 'SCOP', value: `Tot ${dec.format(airco.scop)}` },
    {
      label: 'Geluid binnenunit',
      value: `Vanaf ${airco.noiseSilentDba} dB(A)`,
    },
    { label: 'Koudemiddel', value: airco.refrigerant },
    { label: 'Geschikte ruimte', value: airco.roomM2 },
    {
      label: 'Werkt tot',
      value: `${airco.minTempC} °C`,
    },
  ]

  return (
    <div className="grid gap-8 pb-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium tracking-[0.1em] text-ink/45 uppercase">
            Airco · {airco.brand}
          </p>
          <h3 className="mt-1 font-display text-2xl text-ink sm:text-3xl">
            {airco.brand} {airco.series}
          </h3>
          <p className="mt-1 text-sm text-ink/60">{airco.tag}</p>
        </div>

        <div className="relative">
          <div
            className="flex min-h-[42vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-mist px-12 py-14 text-center sm:min-h-[52vh]"
            style={{
              background: `linear-gradient(160deg, ${airco.accent}10, ${airco.accent}18 45%, #ffffff 100%)`,
            }}
            aria-live="polite"
          >
            <span className="grid size-14 place-items-center rounded-full bg-white/80 text-ink/35 shadow-sm">
              <ImageIcon className="size-7" aria-hidden />
            </span>
            <p className="font-medium text-ink/70">{photo.label}</p>
            <p className="max-w-sm text-sm text-ink/45">
              {photo.hint} — later komt hier de echte foto van {airco.brand}{' '}
              {airco.series}.
            </p>
          </div>

          <button
            type="button"
            onClick={goPrev}
            className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-mist/80 bg-white/95 text-ink shadow-sm transition hover:border-teal/40 hover:text-teal focus-visible:ring-2 focus-visible:ring-teal focus-visible:outline-none"
            aria-label="Vorige foto"
          >
            <ChevronLeft className="size-5" strokeWidth={2.25} aria-hidden />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-mist/80 bg-white/95 text-ink shadow-sm transition hover:border-teal/40 hover:text-teal focus-visible:ring-2 focus-visible:ring-teal focus-visible:outline-none"
            aria-label="Volgende foto"
          >
            <ChevronRight className="size-5" strokeWidth={2.25} aria-hidden />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2">
          {MOCK_PHOTOS.map((item, photoIndex) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(photoIndex)}
              className={cn(
                'h-2 rounded-full transition',
                photoIndex === index
                  ? 'w-6 bg-teal'
                  : 'w-2 bg-ink/20 hover:bg-ink/35',
              )}
              aria-label={`Ga naar ${item.label}`}
              aria-current={photoIndex === index}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6 lg:sticky lg:top-0">
        <div>
          <p className="font-display text-2xl text-ink sm:text-3xl">
            {airco.brand} {airco.series} airco
          </p>
          <p className="mt-2 text-base font-semibold text-teal">
            Vanaf {eur.format(airco.priceEur)} incl. standaard montage
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
            {airco.description}
          </p>
        </div>

        <ul className="space-y-2.5">
          {airco.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm text-ink/75"
            >
              <Check
                className="mt-0.5 size-4 shrink-0 text-teal"
                strokeWidth={3}
                aria-hidden
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <dl className="overflow-hidden rounded-2xl border border-mist">
          {specs.map((spec, i) => (
            <SpecRow
              key={spec.label}
              label={spec.label}
              value={spec.value}
              striped={i % 2 === 1}
            />
          ))}
        </dl>

        <ul className="space-y-2 border-t border-mist pt-4">
          {TRUST_POINTS.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2.5 text-sm text-ink/70"
            >
              <Check
                className="mt-0.5 size-4 shrink-0 text-teal"
                strokeWidth={3}
                aria-hidden
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col-reverse gap-3 border-t border-mist pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-mist bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-foam"
          >
            Annuleren
          </button>
          <button
            type="button"
            onClick={onCalculateSavings}
            className="rounded-xl bg-mint px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white"
          >
            Bereken besparing
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AircoCard({
  airco,
  selected,
  requiredKw,
  isBestChoice = false,
  onSelect,
}: AircoCardProps) {
  const fits = requiredKw != null && maxCoolingKw(airco) >= requiredKw
  const [previewOpen, setPreviewOpen] = useState(false)
  const ignoreSelectUntilRef = useRef(0)

  const handlePreviewOpenChange = (open: boolean) => {
    setPreviewOpen(open)
    if (!open) {
      // Voorkom click-through op de card na sluiten van de dialog.
      ignoreSelectUntilRef.current = Date.now() + 400
    }
  }

  const selectAirco = () => {
    if (previewOpen || Date.now() < ignoreSelectUntilRef.current) return
    onSelect(selected ? null : airco.id)
  }

  const showFitGlow = requiredKw != null

  return (
    <div
      className={cn(
        'relative h-full rounded-[2rem] transition duration-200',
        showFitGlow && fits && 'airco-card-shadow--fit',
        showFitGlow && !fits && 'airco-card-shadow--miss',
      )}
    >
      {showFitGlow ? (
        <span
          aria-hidden
          className={cn(
            'airco-card-glow rounded-[2rem]',
            fits ? 'airco-card-glow--fit' : 'airco-card-glow--miss',
          )}
        />
      ) : null}

      <div
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        onClick={selectAirco}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            selectAirco()
          }
        }}
        className={cn(
          'group relative z-[1] flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-[2rem] border text-left transition duration-200',
          selected
            ? 'bg-white shadow-[0_22px_48px_rgba(15,118,110,0.16)] ring-4 ring-mint/35'
            : showFitGlow && !fits
              ? 'bg-white/80'
              : showFitGlow
                ? 'bg-white'
                : 'bg-white/90 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(7,20,28,0.08)]',
          showFitGlow
            ? 'border border-transparent'
            : selected
              ? 'border-teal'
              : 'border-mist hover:border-teal/35',
          showFitGlow && !fits && !selected && 'opacity-70 hover:opacity-90',
        )}
      >
        {selected ? (
          <span className="absolute top-5 right-5 z-10 grid size-10 place-items-center rounded-full bg-mint text-ink shadow-md">
            <Check className="size-5" strokeWidth={3} aria-hidden />
            <span className="sr-only">Geselecteerd</span>
          </span>
        ) : null}

        {showFitGlow ? (
          <span className="sr-only">
            {fits
              ? 'Geschikt voor uw berekende vermogen'
              : 'Onvoldoende vermogen voor uw berekening'}
          </span>
        ) : null}

        <div className="flex flex-1 flex-col gap-4 p-6 md:gap-5 md:p-8 2xl:p-10">
          <h3
            className={cn(
              'font-display text-3xl leading-tight text-ink md:text-[2rem] 2xl:text-4xl',
              selected && 'pr-14',
            )}
          >
            {airco.brand} {airco.series}
          </h3>

          <div className="grid gap-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)] md:items-start md:gap-8 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] 2xl:gap-12">
            <PopupModal
              isOpen={previewOpen}
              onOpenChange={handlePreviewOpenChange}
              maxWidth="!max-w-[min(96rem,95vw)]"
              maxHeight="max-h-[90dvh]"
              renderButton={(onClick) => (
                <div
                  className="relative flex min-h-44 w-full items-center justify-center rounded-3xl md:min-h-52 2xl:min-h-64"
                  style={{
                    background: `linear-gradient(160deg, ${airco.accent}14, ${airco.accent}28 55%, #ffffff 100%)`,
                  }}
                >
                  <AircoIllustration
                    accent={airco.accent}
                    gradientId={`unit-face-${airco.id}`}
                  />
                  <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation()
                      event.preventDefault()
                      onClick()
                    }}
                    className="absolute top-3 right-3 grid size-10 place-items-center rounded-full border border-mist/80 bg-white/90 text-ink shadow-sm transition hover:border-teal/40 hover:bg-white hover:text-teal focus-visible:ring-2 focus-visible:ring-teal focus-visible:outline-none"
                    aria-label={`Bekijk foto van ${airco.brand} ${airco.series}`}
                  >
                    <Expand className="size-5" strokeWidth={2.25} aria-hidden />
                  </button>
                </div>
              )}
              renderModal={(onClose) => (
                <AircoPhotoPreview
                  airco={airco}
                  onClose={onClose}
                  onCalculateSavings={() => {
                    onSelect(airco.id)
                    onClose()
                    window.setTimeout(() => {
                      document
                        .getElementById('verbruik')
                        ?.scrollIntoView({ behavior: 'smooth' })
                      window.history.replaceState(null, '', '/#verbruik')
                    }, 150)
                  }}
                />
              )}
            />

            <div className="flex min-w-0 flex-col">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <p className="text-sm font-medium text-teal md:text-base">
                  {airco.tag}
                </p>
                {isBestChoice ? (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-mint/50 bg-mint/20 px-3 py-1.5 text-xs font-semibold tracking-wide text-deep uppercase md:text-[13px]">
                    <Sparkles className="size-3.5" strokeWidth={2.25} aria-hidden />
                    Beste keuze
                  </span>
                ) : null}
              </div>
              <p className="mt-3 line-clamp-3 max-w-xl text-sm leading-relaxed text-ink/65 md:text-base 2xl:line-clamp-none">
                {airco.description}
              </p>

              <div className="mt-4 flex items-start justify-between gap-4">
                <ul className="min-w-0 flex-1 space-y-2">
                  {airco.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-ink/70 md:text-base"
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-mint md:size-[1.125rem]"
                        strokeWidth={3}
                        aria-hidden
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation()
                    event.preventDefault()
                    handlePreviewOpenChange(true)
                  }}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-mist/80 bg-white px-3 py-1.5 text-sm font-medium text-ink/70 shadow-sm transition hover:border-teal/40 hover:text-teal focus-visible:ring-2 focus-visible:ring-teal focus-visible:outline-none"
                  aria-label={`Meer informatie over ${airco.brand} ${airco.series}`}
                >
                  <Info className="size-4" strokeWidth={2.25} aria-hidden />
                  Info
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-mist/80 px-6 py-5 md:px-8 2xl:px-10 2xl:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <dl className="grid min-w-0 flex-1 grid-cols-1 gap-4 text-left sm:grid-cols-2 sm:gap-0">
              <div className="sm:pr-5">
                <dt className="text-[11px] tracking-wide text-ink/45 uppercase md:text-xs">
                  Vermogen
                </dt>
                <dd
                  className={cn(
                    'mt-1.5 text-base font-semibold text-ink md:text-lg',
                    requiredKw != null && !fits && 'text-ink/35',
                    requiredKw != null && fits && 'text-teal',
                  )}
                >
                  {coolingRangeLabel(airco)}
                </dd>
              </div>
              <div className="border-mist/80 sm:border-l sm:pl-5">
                <dt className="text-[11px] tracking-wide text-ink/45 uppercase md:text-xs">
                  Efficiëntie
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-ink md:text-base">
                  SCOP {dec.format(airco.scop)} | SEER {dec.format(airco.seer)}
                </dd>
              </div>
            </dl>

            <span
              className={cn(
                'inline-flex shrink-0 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition md:text-base',
                selected
                  ? 'bg-teal text-white'
                  : 'bg-ink text-white group-hover:bg-deep',
              )}
            >
              {selected ? 'Geselecteerd' : 'Kies dit model'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
