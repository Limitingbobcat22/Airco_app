import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  AIRCO_PHOTO_SLOTS,
  MAX_AIRCO_IMAGE_BYTES,
} from '@/pages/airco/data/airco-photos'

type AircoPhotoSliderProps = {
  accent: string
  brand: string
  model: string
  files: (File | null)[]
  onChange: (files: (File | null)[]) => void
  existingUrls?: (string | null)[]
  onClearExisting?: (index: number) => void
  onImmediateUpload?: (
    file: File,
    sortOrder: number,
    label: string,
  ) => Promise<void>
}

function emptySlots(): (File | null)[] {
  return AIRCO_PHOTO_SLOTS.map(() => null)
}

export default function AircoPhotoSlider({
  accent,
  brand,
  model,
  files,
  onChange,
  existingUrls = [],
  onClearExisting,
  onImmediateUpload,
}: AircoPhotoSliderProps) {
  const [index, setIndex] = useState(0)
  const [pickerError, setPickerError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const slots = files.length === AIRCO_PHOTO_SLOTS.length ? files : emptySlots()
  const slot = AIRCO_PHOTO_SLOTS[index]
  const file = slots[index] ?? null
  const existingUrl = existingUrls[index] ?? null
  const hasPhoto = Boolean(file || existingUrl)
  const total = AIRCO_PHOTO_SLOTS.length

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  )
  const shownUrl = previewUrl || existingUrl

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const goPrev = () => {
    setPickerError(null)
    setIndex((current) => (current - 1 + total) % total)
  }

  const goNext = () => {
    setPickerError(null)
    setIndex((current) => (current + 1) % total)
  }

  const assignFile = (next: File | null) => {
    const copy = [...slots]
    copy[index] = next
    onChange(copy)
  }

  const clearCurrent = () => {
    setPickerError(null)
    if (file) {
      assignFile(null)
      return
    }
    onClearExisting?.(index)
  }

  const handlePick = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0]
    event.target.value = ''
    if (!picked) return

    if (!picked.type.startsWith('image/')) {
      setPickerError('Kies een afbeelding (jpg, png, webp).')
      return
    }
    if (picked.size > MAX_AIRCO_IMAGE_BYTES) {
      setPickerError('Foto mag maximaal 5 MB zijn.')
      return
    }

    setPickerError(null)
    if (typeof onImmediateUpload === 'function') {
      const slotIndex = index
      const copy = [...slots]
      copy[slotIndex] = picked
      onChange(copy)
      setUploading(true)
      void onImmediateUpload(picked, slot.sortOrder, slot.label)
        .catch((error: unknown) => {
          setPickerError(
            error instanceof Error ? error.message : 'Foto uploaden mislukt',
          )
        })
        .finally(() => {
          setUploading(false)
        })
      return
    }
    assignFile(picked)
  }

  const openPicker = () => fileInputRef.current?.click()

  const heading = [brand.trim(), model.trim()].filter(Boolean).join(' ')

  return (
    <div className="space-y-3">
      <div className="relative">
        <div
          className="relative flex min-h-[240px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-mist px-12 py-10 text-center sm:min-h-[280px]"
          style={{
            background: `linear-gradient(160deg, ${accent}10, ${accent}18 45%, #ffffff 100%)`,
          }}
          aria-live="polite"
        >
          {shownUrl ? (
            <>
              <img
                src={shownUrl}
                alt={slot.label}
                className="absolute inset-0 size-full object-contain p-4"
              />
              <button
                type="button"
                onClick={clearCurrent}
                disabled={uploading}
                className="absolute top-3 right-3 z-20 grid size-9 place-items-center rounded-full border border-mist/80 bg-white/95 text-ink shadow-sm transition hover:border-destructive/40 hover:text-destructive focus-visible:ring-2 focus-visible:ring-teal focus-visible:outline-none disabled:opacity-60"
                aria-label={`${slot.label} verwijderen`}
              >
                <X className="size-4" strokeWidth={2.5} aria-hidden />
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent px-4 py-3 text-white">
                <p className="text-sm font-medium">{slot.label}</p>
                <p className="text-xs text-white/80">{slot.hint}</p>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={openPicker}
                disabled={uploading}
                className="grid size-16 place-items-center rounded-full border border-mist bg-white text-ink/45 shadow-sm transition hover:border-teal/50 hover:text-teal focus-visible:ring-2 focus-visible:ring-teal focus-visible:outline-none disabled:opacity-60"
                aria-label={`Foto toevoegen voor ${slot.label}`}
              >
                <Upload className="size-7" strokeWidth={2} aria-hidden />
              </button>
              <p className="mt-3 font-medium text-ink/70">{slot.label}</p>
              <p className="mt-1 max-w-sm text-sm text-ink/45">
                {slot.hint}
                {heading ? ` — ${heading}` : ''}. Klik op het icoon om een foto
                te kiezen.
              </p>
            </>
          )}
          {uploading ? (
            <div className="absolute inset-0 z-30 grid place-items-center bg-white/55 text-sm font-medium text-ink/70">
              Foto uploaden…
            </div>
          ) : null}
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
        {AIRCO_PHOTO_SLOTS.map((item, photoIndex) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setPickerError(null)
              setIndex(photoIndex)
            }}
            className={cn(
              'h-2 rounded-full transition',
              photoIndex === index
                ? 'w-6 bg-teal'
                : slots[photoIndex] || existingUrls[photoIndex]
                  ? 'w-2 bg-teal/45 hover:bg-teal/70'
                  : 'w-2 bg-ink/20 hover:bg-ink/35',
            )}
            aria-label={`Ga naar ${item.label}`}
            aria-current={photoIndex === index}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handlePick}
        />
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-full border border-mist bg-white px-3 py-1.5 text-xs font-medium text-ink/80 hover:border-teal/40 hover:text-teal disabled:opacity-60"
        >
          <Upload className="size-3.5" aria-hidden />
          {hasPhoto ? 'Foto vervangen' : 'Foto kiezen'}
        </button>
      </div>

      {pickerError ? (
        <p className="text-center text-sm text-destructive">{pickerError}</p>
      ) : null}
    </div>
  )
}
