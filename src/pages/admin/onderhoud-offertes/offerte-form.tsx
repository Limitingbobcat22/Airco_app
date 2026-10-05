import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import type { Klant } from '@/lib/api/klanten'
import type { OnderhoudOfferte } from '@/lib/api/onderhoud-offertes'
import { fetchOnderhoudImageUrl } from '@/lib/api/onderhoud-offertes'
import type { OnderhoudType } from '@/lib/api/onderhoud-types'
import { cn } from '@/lib/utils'
import CreateKlantForm from '@/pages/klant/components/create'
import { EMPTY_KLANT_NAW, type KlantNawData } from '@/pages/klant/types'

export type OnderhoudOfferteFormValues = {
  klantId: string
  typeIds: string[]
  keepPhotoIds: string[]
  newPhotos: File[]
}

function matchKlantId(
  offerte: OnderhoudOfferte | null,
  klanten: Klant[],
): string {
  if (!offerte) return ''
  if (offerte.klantId && klanten.some((item) => item.id === offerte.klantId)) {
    return offerte.klantId
  }
  const email = offerte.email.trim().toLowerCase()
  return (
    klanten.find((item) => item.email.trim().toLowerCase() === email)?.id ?? ''
  )
}

type OnderhoudOfferteFormProps = {
  token: string
  initial: OnderhoudOfferte | null
  klanten?: Klant[]
  types: OnderhoudType[]
  submitting?: boolean
  error?: string | null
  onSubmit: (data: OnderhoudOfferteFormValues) => void
  onDirtyChange?: (dirty: boolean) => void
  onCancel: () => void
}

function formState(offerte: OnderhoudOfferte | null) {
  if (!offerte) {
    return {
      klant: { ...EMPTY_KLANT_NAW },
      typeIds: [] as string[],
      keepPhotoIds: [] as string[],
    }
  }

  return {
    klant: toKlant(offerte),
    typeIds: offerte.types.map((type) => type.id),
    keepPhotoIds: offerte.images.map((image) => image.id),
  }
}

function klantToNaw(klant: Klant): KlantNawData {
  return {
    firstName: klant.firstName,
    lastName: klant.lastName,
    email: klant.email,
    phone: klant.phone,
    street: klant.street,
    houseNumber: klant.houseNumber,
    postalCode: klant.postalCode,
    city: klant.city,
    note: klant.note ?? '',
    consentContact: Boolean(klant.consentContact),
    consentTerms: Boolean(klant.consentTerms),
  }
}

function toKlant(offerte: OnderhoudOfferte): KlantNawData {
  return {
    firstName: offerte.firstName,
    lastName: offerte.lastName,
    email: offerte.email,
    phone: offerte.phone,
    street: offerte.street,
    houseNumber: offerte.houseNumber,
    postalCode: offerte.postalCode,
    city: offerte.city,
    note: offerte.note ?? '',
    consentContact: Boolean(offerte.consentContact),
    consentTerms: Boolean(offerte.consentTerms),
  }
}

type FotoSlide = {
  key: string
  alt: string
  src: string | null
}

function useStoredFotoUrls(
  token: string,
  offerteId: string | null,
  photoIds: string[],
) {
  const [urls, setUrls] = useState<Record<string, string>>({})
  const key = photoIds.join('|')

  useEffect(() => {
    if (!offerteId || !key) {
      setUrls({})
      return
    }

    let active = true
    const created: string[] = []
    for (const fotoId of key.split('|')) {
      void fetchOnderhoudImageUrl(token, offerteId, fotoId)
        .then((url) => {
          created.push(url)
          if (!active) {
            URL.revokeObjectURL(url)
            return
          }
          setUrls((current) => ({ ...current, [fotoId]: url }))
        })
        .catch(() => undefined)
    }

    return () => {
      active = false
      for (const url of created) URL.revokeObjectURL(url)
    }
  }, [token, offerteId, key])

  return urls
}

function useLocalFotoUrls(files: File[]) {
  const urls = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  )

  useEffect(
    () => () => {
      for (const url of urls) URL.revokeObjectURL(url)
    },
    [urls],
  )

  return urls
}

function FotoCarousel({
  slides,
  index,
  onIndexChange,
}: {
  slides: FotoSlide[]
  index: number
  onIndexChange: (index: number) => void
}) {
  const total = slides.length
  const slide = slides[index]
  if (!slide || total === 0) return null

  const go = (step: number) => {
    onIndexChange((index + step + total) % total)
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div
          className="relative flex min-h-[52vh] w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-mist px-12 text-center"
          style={{
            background:
              'linear-gradient(160deg, #74b8f814, #74b8f828 45%, #ffffff 100%)',
          }}
        >
          {slide.src ? (
            <img
              src={slide.src}
              alt=""
              className="absolute inset-0 size-full object-contain p-4"
            />
          ) : (
            <div className="h-40 w-full animate-pulse rounded-xl bg-white/70" />
          )}
        </div>

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-3 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-mist/80 bg-white/95 text-ink shadow-sm transition hover:border-teal/40 hover:text-teal"
              aria-label="Vorige foto"
            >
              <ChevronLeft className="size-5" strokeWidth={2.25} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute top-1/2 right-3 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-mist/80 bg-white/95 text-ink shadow-sm transition hover:border-teal/40 hover:text-teal"
              aria-label="Volgende foto"
            >
              <ChevronRight className="size-5" strokeWidth={2.25} aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="flex items-center justify-center gap-2">
          {slides.map((item, photoIndex) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onIndexChange(photoIndex)}
              className={cn(
                'h-2 rounded-full transition',
                photoIndex === index
                  ? 'w-6 bg-orange-500'
                  : 'w-2 bg-orange-500/45 hover:bg-orange-500/70',
              )}
              aria-label={`Ga naar foto ${photoIndex + 1}`}
              aria-current={photoIndex === index}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function klantLabel(klant: Klant) {
  return `${klant.firstName} ${klant.lastName}`.trim()
}

function KlantPicker({
  klanten,
  selectedId,
  onSelect,
}: {
  klanten: Klant[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = klanten.find((item) => item.id === selectedId)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return klanten
    return klanten.filter((item) =>
      `${klantLabel(item)} ${item.email} ${item.phone} ${item.city}`
        .toLowerCase()
        .includes(needle),
    )
  }, [klanten, query])

  return (
    <div ref={rootRef} className="min-w-0">
      <span className="mb-2 block text-sm font-medium text-ink/70">Klant</span>
      <div className="relative">
        <input
          type="text"
          value={open ? query : selected ? klantLabel(selected) : ''}
          placeholder="Zoek een klant"
          onFocus={() => {
            setOpen(true)
            setQuery('')
          }}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          className="w-full min-w-0 rounded-xl border border-mist bg-foam px-3 py-2.5 pr-10 text-ink outline-none focus:border-teal"
        />
        {query.length > 0 || selected ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              onSelect('')
              setOpen(true)
            }}
            aria-label="Klant wissen"
            className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-ink/55 hover:bg-white hover:text-ink"
          >
            <X className="size-4" />
          </button>
        ) : null}
        {open ? (
        <ul className="absolute top-full right-0 left-0 z-30 mt-1 max-h-[360px] overflow-x-hidden overflow-y-auto rounded-xl border border-mist bg-white shadow-lg">
          {matches.length === 0 ? (
            <li className="px-3 py-2 text-sm text-ink/60">Geen klant gevonden.</li>
          ) : (
            matches.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(item.id)
                    setQuery('')
                    setOpen(false)
                  }}
                  className={cn(
                    'block h-9 w-full min-w-0 truncate px-3 text-left text-sm leading-9 hover:bg-foam',
                    item.id === selectedId && 'bg-foam font-medium',
                  )}
                >
                  {klantLabel(item)} · {item.email}
                </button>
              </li>
            ))
          )}
        </ul>
        ) : null}
      </div>
    </div>
  )
}

export default function OnderhoudOfferteForm({
  token,
  initial,
  klanten = [],
  types,
  submitting = false,
  error,
  onSubmit,
  onDirtyChange,
  onCancel,
}: OnderhoudOfferteFormProps) {
  const [klant, setKlant] = useState<KlantNawData>(
    () => formState(initial).klant,
  )
  const [typeIds, setTypeIds] = useState<string[]>(
    () => formState(initial).typeIds,
  )
  const [keepPhotoIds, setKeepPhotoIds] = useState<string[]>(
    () => formState(initial).keepPhotoIds,
  )
  const [newPhotos, setNewPhotos] = useState<File[]>([])
  const [selectedKlantId, setSelectedKlantId] = useState('')
  const [newKlantOpen, setNewKlantOpen] = useState(false)
  const [createdKlanten, setCreatedKlanten] = useState<Klant[]>([])
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)
  const [fotoIndex, setFotoIndex] = useState(0)
  const [fotoPreviewOpen, setFotoPreviewOpen] = useState(false)
  const isCreate = initial == null
  const sortedKlanten = useMemo(() => {
    const merged = [
      ...createdKlanten,
      ...klanten.filter(
        (item) => !createdKlanten.some((created) => created.id === item.id),
      ),
    ]
    return merged.sort((a, b) =>
      `${a.lastName} ${a.firstName}`.localeCompare(
        `${b.lastName} ${b.firstName}`,
        'nl',
      ),
    )
  }, [klanten, createdKlanten])
  const selectedKlant = sortedKlanten.find((item) => item.id === selectedKlantId)

  useEffect(() => {
    const next = formState(initial)
    setKlant(next.klant)
    setTypeIds(next.typeIds)
    setKeepPhotoIds(next.keepPhotoIds)
    setNewPhotos([])
    if (!initial) setSelectedKlantId('')
  }, [initial])

  useEffect(() => {
    if (!initial) return
    setSelectedKlantId(matchKlantId(initial, klanten))
  }, [initial, klanten])

  useEffect(() => {
    const baseline = formState(initial)
    const dirty =
      JSON.stringify(klant) !== JSON.stringify(baseline.klant) ||
      typeIds.join() !== baseline.typeIds.join() ||
      keepPhotoIds.join() !== baseline.keepPhotoIds.join() ||
      newPhotos.length > 0
    onDirtyChange?.(dirty)
    return () => onDirtyChange?.(false)
  }, [klant, typeIds, keepPhotoIds, newPhotos, initial, onDirtyChange])

  const maxPhotos = Math.min(Math.max(typeIds.length, 0), 3)
  const photoCount = keepPhotoIds.length + newPhotos.length
  const room = Math.max(maxPhotos - photoCount, 0)
  const keptPhotos = (initial?.images ?? []).filter((photo) =>
    keepPhotoIds.includes(photo.id),
  )
  const storedUrls = useStoredFotoUrls(
    token,
    initial?.id ?? null,
    keptPhotos.map((photo) => photo.id),
  )
  const localUrls = useLocalFotoUrls(newPhotos)
  const fotoSlides = useMemo<FotoSlide[]>(
    () => [
      ...keptPhotos.map((photo) => ({
        key: photo.id,
        alt: photo.originalFilename,
        src: storedUrls[photo.id] ?? null,
      })),
      ...newPhotos.map((file, index) => ({
        key: `new-${file.name}-${file.lastModified}-${index}`,
        alt: file.name,
        src: localUrls[index] ?? null,
      })),
    ],
    [keptPhotos, storedUrls, newPhotos, localUrls],
  )
  const activeFotoIndex = Math.min(fotoIndex, Math.max(fotoSlides.length - 1, 0))

  const openFotoPreview = (index: number) => {
    setFotoIndex(index)
    setFotoPreviewOpen(true)
  }

  const toggleType = (id: string) => {
    setTypeIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
    setFormError(null)
  }

  const addPhotos = (list: FileList | null) => {
    if (!list || room <= 0) return
    const accepted = Array.from(list)
      .filter((file) => file.type.startsWith('image/') || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name))
      .filter((file) => file.size <= 5 * 1024 * 1024)
      .slice(0, room)
    if (accepted.length === 0) {
      setFormError('Kies een foto in jpg, png, webp of heic, maximaal 5 MB.')
      return
    }
    setNewPhotos((current) => [...current, ...accepted])
    setFormError(null)
  }

  const chooseExistingKlant = (id: string) => {
    setSelectedKlantId(id)
    setFormError(null)
    const found = sortedKlanten.find((item) => item.id === id)
    setKlant(found ? klantToNaw(found) : { ...EMPTY_KLANT_NAW })
  }

  const rememberCreatedKlant = (created: Klant) => {
    setCreatedKlanten((current) => [
      created,
      ...current.filter((item) => item.id !== created.id),
    ])
    queryClient.setQueryData<Klant[]>(['klanten'], (current = []) =>
      current.some((item) => item.id === created.id)
        ? current
        : [created, ...current],
    )
    setSelectedKlantId(created.id)
    setKlant(klantToNaw(created))
    setFormError(null)
  }

  const openNewKlant = () => {
    setFormError(null)
    setNewKlantOpen(true)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isCreate) {
      if (!selectedKlant) {
        setFormError('Kies een klant.')
        return
      }
      if (typeIds.length === 0) {
        setFormError('Kies minimaal één onderhoudtype.')
        return
      }
      if (photoCount > maxPhotos) {
        setFormError(
          `Maximaal ${maxPhotos} ${maxPhotos === 1 ? 'foto' : "foto's"} bij ${typeIds.length} ${typeIds.length === 1 ? 'type' : 'types'}.`,
        )
        return
      }
      setFormError(null)
      onSubmit({
        klantId: selectedKlant.id,
        typeIds,
        keepPhotoIds,
        newPhotos,
      })
      return
    }
    if (!selectedKlant) {
      setFormError('Kies een klant of voeg een nieuwe toe.')
      return
    }
    if (typeIds.length === 0) {
      setFormError('Kies minimaal één onderhoudtype.')
      return
    }
    if (photoCount > maxPhotos) {
      setFormError(
        `Maximaal ${maxPhotos} ${maxPhotos === 1 ? 'foto' : "foto's"} bij ${typeIds.length} ${typeIds.length === 1 ? 'type' : 'types'}.`,
      )
      return
    }
    setFormError(null)
    onSubmit({
      klantId: selectedKlant.id,
      typeIds,
      keepPhotoIds,
      newPhotos,
    })
  }

  return (
    <>
    <form className="space-y-5 py-2 pb-4" noValidate onSubmit={handleSubmit}>
      <div>
        <p className="text-xs font-medium tracking-[0.2em] text-[#74b8f8] uppercase">
          {initial ? 'Offerte bewerken' : 'Nieuwe offerte'}
        </p>
        <p className="mt-2 text-sm text-ink/70">
          {initial
            ? "Kies de klant en pas de onderhoudtypes en foto's aan."
            : 'Kies een bestaande klant of voeg een nieuwe klant toe.'}
        </p>
      </div>

      {isCreate ? (
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <KlantPicker
                klanten={sortedKlanten}
                selectedId={selectedKlantId}
                onSelect={chooseExistingKlant}
              />
            </div>
            <button
              type="button"
              onClick={openNewKlant}
              className="rounded-xl border border-mist bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-foam"
            >
              Voeg nieuwe toe
            </button>
          </div>

          {selectedKlant ? (
            <div className="rounded-xl border border-mist bg-white px-4 py-3 text-sm text-ink/80">
              <p className="font-semibold text-ink">
                {selectedKlant.firstName} {selectedKlant.lastName}
              </p>
              <p className="mt-1">{selectedKlant.email}</p>
              <p>{selectedKlant.phone}</p>
              <p>
                {selectedKlant.street} {selectedKlant.houseNumber},{' '}
                {selectedKlant.postalCode} {selectedKlant.city}
              </p>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink/70">
              Klant
            </span>
            <select
              value={selectedKlantId}
              onChange={(event) => chooseExistingKlant(event.target.value)}
              className="w-full rounded-xl border border-mist bg-foam px-3 py-2.5 text-ink outline-none focus:border-teal"
            >
              <option value="">Kies een klant</option>
              {sortedKlanten.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.firstName} {item.lastName} · {item.email}
                </option>
              ))}
            </select>
          </label>
          {selectedKlant ? (
            <div className="rounded-2xl border border-mist bg-white px-4 py-3 text-sm text-ink/75">
              <p className="font-medium text-ink">
                {selectedKlant.firstName} {selectedKlant.lastName}
              </p>
              <p className="mt-1">{selectedKlant.email}</p>
              <p>{selectedKlant.phone}</p>
              <p className="mt-1">
                {selectedKlant.street} {selectedKlant.houseNumber},{' '}
                {selectedKlant.postalCode} {selectedKlant.city}
              </p>
            </div>
          ) : null}
          <p className="text-sm text-ink/60">
            Klantgegevens wijzig je in Klanten beheer.
          </p>
        </div>
      )}

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink/70">
          Onderhoudtypes
        </legend>
        <ul className="grid gap-2">
          {types.map((type) => {
            const checked = typeIds.includes(type.id)
            return (
              <li key={type.id}>
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm',
                    checked ? 'border-teal bg-foam' : 'border-mist bg-white',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleType(type.id)}
                    className="size-4 accent-teal"
                  />
                  {type.name}
                </label>
              </li>
            )
          })}
        </ul>
      </fieldset>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-ink/70">Foto&apos;s</p>
          <p className="text-sm text-ink/55">
            {photoCount} / {maxPhotos || 0}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {keptPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative overflow-hidden rounded-xl border border-mist"
            >
              <button
                type="button"
                onClick={() => openFotoPreview(index)}
                className="block w-full"
                aria-label={`${photo.originalFilename} bekijken`}
              >
                {storedUrls[photo.id] ? (
                  <img
                    src={storedUrls[photo.id]}
                    alt={photo.originalFilename}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[4/3] animate-pulse bg-mist" />
                )}
              </button>
              <button
                type="button"
                onClick={() =>
                  setKeepPhotoIds((current) =>
                    current.filter((id) => id !== photo.id),
                  )
                }
                aria-label="Foto verwijderen"
                className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-white/95 text-ink shadow-sm"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
          {newPhotos.map((file, index) => (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              className="relative overflow-hidden rounded-xl border border-mist"
            >
              <button
                type="button"
                onClick={() => openFotoPreview(keptPhotos.length + index)}
                className="block w-full"
                aria-label={`${file.name} bekijken`}
              >
                {localUrls[index] ? (
                  <img
                    src={localUrls[index]}
                    alt={file.name}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[4/3] animate-pulse bg-mist" />
                )}
              </button>
              <button
                type="button"
                onClick={() =>
                  setNewPhotos((current) =>
                    current.filter((_, item) => item !== index),
                  )
                }
                aria-label="Nieuwe foto verwijderen"
                className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-white/95 text-ink shadow-sm"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
        {room > 0 ? (
          <label className="mt-3 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-teal/40 bg-foam/70 px-4 py-3 text-sm font-medium text-ink">
            Foto toevoegen
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              multiple={room > 1}
              className="sr-only"
              onChange={(event) => {
                addPhotos(event.target.files)
                event.target.value = ''
              }}
            />
          </label>
        ) : null}
      </div>

      {formError || error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {formError || error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-mist bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-foam disabled:opacity-60"
        >
          Annuleren
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-[#74b8f8] px-5 py-3 text-sm font-semibold text-ink hover:bg-[#5aa6ef] disabled:opacity-60"
        >
          {submitting ? 'Opslaan…' : 'Opslaan'}
        </button>
      </div>
    </form>
    <Modal
      stacked
      title="Nieuwe klant"
      description="Klantgegevens"
      isOpen={newKlantOpen}
      onClose={() => setNewKlantOpen(false)}
      className="max-h-[90vh] overflow-y-auto p-4 sm:max-w-3xl sm:p-6"
    >
      <CreateKlantForm
        kind="onderhoud"
        variant="beheer"
        onClose={() => setNewKlantOpen(false)}
        onCreated={rememberCreatedKlant}
      />
    </Modal>
    <Modal
      stacked
      title="Foto's"
      description="Foto's van de onderhoudofferte"
      isOpen={fotoPreviewOpen && fotoSlides.length > 0}
      onClose={() => setFotoPreviewOpen(false)}
      className="max-h-[92vh] overflow-y-auto p-4 sm:max-w-4xl sm:p-6"
    >
      <div className="pt-6">
        <FotoCarousel
          slides={fotoSlides}
          index={activeFotoIndex}
          onIndexChange={setFotoIndex}
        />
      </div>
    </Modal>
    </>
  )
}
