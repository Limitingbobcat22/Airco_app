import { useCallback, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Info } from 'lucide-react'
import PopupModal from '@/components/shared/popup-modal'
import SiteFooter from '@/components/shared/site-footer'
import { Modal } from '@/components/ui/modal'
import { createOnderhoudOfferte } from '@/lib/api/onderhoud-offertes'
import {
  listOnderhoudTypes,
  type OnderhoudType,
} from '@/lib/api/onderhoud-types'
import { cn } from '@/lib/utils'
import { useUnsavedChanges } from '@/providers/unsaved-changes'
import { CreateKlantForm } from '@/pages/klant'
import OnderhoudPhotoUpload from '@/pages/onderhoud/photo-upload'

function descriptionLines(description: string | null): string[] {
  if (!description?.trim()) return []
  return description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function OnderhoudPage() {
  const { setDirty } = useUnsavedChanges()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [photos, setPhotos] = useState<File[]>([])
  const [infoType, setInfoType] = useState<OnderhoudType | null>(null)
  const handlePhotosChange = useCallback((next: File[]) => {
    setPhotos(next)
  }, [])
  const infoLines = descriptionLines(infoType?.description ?? null)
  const {
    data: types = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['onderhoud-types'],
    queryFn: listOnderhoudTypes,
  })

  const maxPhotos = Math.min(selectedIds.length, 3)
  const selectedLabels = types
    .filter((type) => selectedIds.includes(type.id))
    .map((type) => type.name)
  const canRequest = selectedIds.length > 0

  useEffect(() => {
    const dirty = selectedIds.length > 0 || photos.length > 0
    setDirty(dirty)
    return () => setDirty(false)
  }, [selectedIds, photos, setDirty])

  function toggleType(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div id="page-scroll" className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col">
          <article className="hero-bg relative flex-1 overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
            <div className="relative mx-auto max-w-3xl">
              <p className="text-sm font-medium tracking-[0.22em] text-ink uppercase">
                Service
              </p>
              <h1 className="mt-2 font-display text-3xl text-ink sm:text-5xl">
                Onderhoud
              </h1>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/75 sm:text-lg">
                <p>
                  Regelmatig onderhoud houdt uw airco of ketel zuinig, stil en
                  betrouwbaar. Hier leest u straks wat een onderhoudsbeurt
                  inhoudt en wanneer die nodig is.
                </p>
                <p>
                  Deze tekst is een tijdelijke placeholder. De definitieve
                  uitleg over onderhoud, afspraken en service komt hier later.
                </p>
              </div>

              <section className="page-block mt-8 rounded-2xl border border-white/70 bg-white/90 p-5 sm:p-6">
                <h2 className="font-display text-2xl text-ink">
                  Type onderhoud
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/70 sm:text-base">
                  Kies een of meer types waarvoor u onderhoud wilt.
                </p>

                {isLoading ? (
                  <p className="mt-5 text-sm text-ink/60">
                    Onderhoudtypes laden…
                  </p>
                ) : isError ? (
                  <p className="mt-5 text-sm text-destructive">
                    {error instanceof Error
                      ? error.message
                      : 'Kon onderhoudtypes niet ophalen.'}
                  </p>
                ) : types.length === 0 ? (
                  <p className="mt-5 text-sm text-ink/60">
                    Er zijn nog geen onderhoudtypes beschikbaar.
                  </p>
                ) : (
                  <ul className="mt-5 grid gap-3">
                    {types.map((type) => {
                      const checked = selectedIds.includes(type.id)
                      return (
                        <li
                          key={type.id}
                          className={cn(
                            'flex items-center gap-2 rounded-xl border py-2 pr-2 pl-4 text-sm text-ink transition sm:text-base',
                            checked
                              ? 'border-teal bg-foam'
                              : 'border-mist bg-white hover:border-teal/40',
                          )}
                        >
                          <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 py-1">
                            <input
                              type="checkbox"
                              name="onderhoudType"
                              value={type.id}
                              checked={checked}
                              onChange={() => toggleType(type.id)}
                              className="size-4 shrink-0 accent-teal"
                            />
                            <span className="min-w-0">{type.name}</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setInfoType(type)}
                            aria-label={`Handelingen van ${type.name} bekijken`}
                            className="grid size-9 shrink-0 place-items-center rounded-full border border-mist bg-white text-ink/70 transition hover:border-teal/40 hover:text-teal focus-visible:ring-2 focus-visible:ring-teal focus-visible:outline-none"
                          >
                            <Info className="size-4" strokeWidth={2.25} aria-hidden />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>

              <OnderhoudPhotoUpload
                maxPhotos={maxPhotos}
                photos={photos}
                onPhotosChange={handlePhotosChange}
              />

              <div className="mt-4">
                <PopupModal
                  maxWidth="md:max-w-[720px]"
                  maxHeight="max-h-[85dvh]"
                  renderButton={(onClick) => (
                    <button
                      type="button"
                      onClick={onClick}
                      disabled={!canRequest}
                      className="w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-500/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Offerte aanvragen
                    </button>
                  )}
                  renderModal={(onClose) => (
                    <CreateKlantForm
                      kind="onderhoud"
                      selectedLabels={selectedLabels}
                      onClose={onClose}
                      submitRequest={async (_data, klant) => {
                        await createOnderhoudOfferte({
                          klantId: klant.id,
                          typeIds: selectedIds,
                          images: photos,
                        })
                      }}
                      onSubmit={() => {
                        setSelectedIds([])
                        setPhotos([])
                      }}
                    />
                  )}
                />
                {canRequest ? (
                  <p className="mt-3 text-sm text-ink/60">
                    Daarna vult u uw gegevens in. Wij nemen contact met u op
                    over het gekozen onderhoud.
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-ink/60">
                    Kies minimaal één onderhoudtype.
                  </p>
                )}
              </div>
            </div>
          </article>
          <SiteFooter />
        </div>
      </div>

      <Modal
        title={infoType?.name ?? 'Onderhoud'}
        description="Handelingen bij dit onderhoud"
        isOpen={infoType != null}
        onClose={() => setInfoType(null)}
        className="overflow-hidden sm:max-w-lg"
      >
        <div className="pr-8">
          <p className="text-xs font-medium tracking-[0.2em] text-[#74b8f8] uppercase">
            Handelingen
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink">
            {infoType?.name}
          </h2>
          {infoLines.length > 0 ? (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/75 marker:text-teal">
              {infoLines.map((line) => (
                <li key={line} className="pl-1">
                  {line}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              Voor dit onderhoudtype is nog geen beschrijving beschikbaar.
            </p>
          )}
        </div>
      </Modal>
    </div>
  )
}
