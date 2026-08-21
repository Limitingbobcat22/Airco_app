import { useRef, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Expand, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import PopupModal from '@/components/shared/popup-modal'
import type { Airco } from '../data/aircos'
import { maxCoolingKw } from '../lib/power'
import { dec } from '../lib/savings'

type AircoCardProps = {
  airco: Airco
  selected: boolean
  hasSelection: boolean
  requiredKw: number | null
  onSelect: (id: string) => void
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

function AircoPhotoPreview({ airco }: { airco: Airco }) {
  const [index, setIndex] = useState(0)
  const photo = MOCK_PHOTOS[index]
  const total = MOCK_PHOTOS.length

  const goPrev = () => setIndex((current) => (current - 1 + total) % total)
  const goNext = () => setIndex((current) => (current + 1) % total)

  return (
    <div className="space-y-4 pb-2">
      <div>
        <p className="text-xs font-medium tracking-[0.1em] text-ink/45 uppercase">
          Airco · {airco.brand}
        </p>
        <h3 className="mt-1 font-display text-2xl text-ink">{airco.series}</h3>
        <p className="mt-1 text-sm text-ink/60">{airco.tag}</p>
      </div>

      <div className="relative">
        <div
          className="flex min-h-[50vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-mist px-16 py-16 text-center sm:min-h-[60vh]"
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
  )
}

export default function AircoCard({
  airco,
  selected,
  hasSelection,
  requiredKw,
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
    onSelect(airco.id)
  }

  return (
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
        'group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-[2rem] border text-left transition duration-200',
        selected
          ? 'bg-white shadow-[0_22px_48px_rgba(15,118,110,0.16)] ring-4 ring-mint/35'
          : 'bg-white/90 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(7,20,28,0.08)]',
        fits
          ? 'border-2 border-mint'
          : selected
            ? 'border-teal'
            : 'border-mist hover:border-teal/35',
      )}
    >
      {selected ? (
        <span className="absolute top-5 right-5 z-10 grid size-10 place-items-center rounded-full bg-mint text-ink shadow-md">
          <Check className="size-5" strokeWidth={3} aria-hidden />
          <span className="sr-only">Geselecteerd</span>
        </span>
      ) : null}

      <div className="grid flex-1 gap-6 p-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)] md:items-center md:gap-8 md:p-8 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] 2xl:gap-12 2xl:p-10">
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
          renderModal={() => <AircoPhotoPreview airco={airco} />}
        />

        <div className="flex min-w-0 flex-col">
          <p className="text-xs font-medium tracking-[0.1em] text-ink/45 uppercase md:text-sm">
            Airco · {airco.brand}
          </p>
          <h3 className="mt-2 font-display text-3xl leading-tight text-ink md:text-[2rem] 2xl:text-4xl">
            {airco.series}
          </h3>
          <p className="mt-1.5 text-sm font-medium text-teal md:text-base">
            {airco.tag}
          </p>
          <p className="mt-3 line-clamp-3 max-w-xl text-sm leading-relaxed text-ink/65 md:text-base 2xl:line-clamp-none">
            {airco.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition md:text-base',
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

      <div className="mt-auto border-t border-mist/80 px-6 py-5 md:px-8 2xl:px-10 2xl:py-6">
        <dl className="grid grid-cols-3 gap-3 text-center md:gap-0 md:text-left">
          <div className="md:pr-5">
            <dt className="text-[11px] tracking-wide text-ink/45 uppercase md:text-xs">
              Vermogen
            </dt>
            <dd
              className={cn(
                'mt-1.5 text-sm font-semibold text-ink md:text-base',
                requiredKw != null && !fits && 'text-ink/35',
                requiredKw != null && fits && !hasSelection && 'animate-kw-pulse',
                requiredKw != null && fits && hasSelection && 'text-teal',
              )}
            >
              {coolingRangeLabel(airco)}
            </dd>
          </div>
          <div className="border-mist/80 md:border-x md:px-5">
            <dt className="text-[11px] tracking-wide text-ink/45 uppercase md:text-xs">
              Functie
            </dt>
            <dd className="mt-1.5 text-sm font-semibold text-ink md:text-base">
              Koelen & verwarmen
            </dd>
          </div>
          <div className="md:pl-5">
            <dt className="text-[11px] tracking-wide text-ink/45 uppercase md:text-xs">
              Geluid
            </dt>
            <dd className="mt-1.5 text-sm font-semibold text-ink md:text-base">
              Vanaf {airco.noiseSilentDba} dB
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
