import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const MAX_PHOTO_BYTES = 5 * 1024 * 1024

type OnderhoudPhotoUploadProps = {
  maxPhotos: number
  photos: File[]
  onPhotosChange: (photos: File[]) => void
}

function photoLimitLabel(maxPhotos: number): string {
  if (maxPhotos <= 0) {
    return 'Kies eerst een onderhoudtype. Per gekozen type kunt u één foto toevoegen, tot maximaal drie.'
  }
  if (maxPhotos === 1) {
    return "Foto's zijn niet verplicht. U kunt 1 foto toevoegen."
  }
  return `Foto's zijn niet verplicht. U kunt maximaal ${maxPhotos} foto's toevoegen.`
}

function isAllowedImage(file: File): boolean {
  if (
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/webp' ||
    file.type === 'image/heic' ||
    file.type === 'image/heif'
  ) {
    return true
  }
  return /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)
}

function PhotoPreview({
  file,
  onRemove,
}: {
  file: File
  onRemove: () => void
}) {
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file])

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  return (
    <div className="relative overflow-hidden rounded-xl border border-mist bg-white">
      <img
        src={previewUrl}
        alt={file.name}
        className="aspect-[4/3] w-full object-cover"
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${file.name} verwijderen`}
        className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-white/95 text-ink shadow-sm hover:bg-white"
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  )
}

export default function OnderhoudPhotoUpload({
  maxPhotos,
  photos,
  onPhotosChange,
}: OnderhoudPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)
  const photosRef = useRef<File[]>([])
  const [dragging, setDragging] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  photosRef.current = photos
  const room = Math.max(maxPhotos - photos.length, 0)
  const canAdd = room > 0

  useEffect(() => {
    if (photos.length <= maxPhotos) return
    onPhotosChange(photos.slice(0, maxPhotos))
    setNotice(
      maxPhotos === 0
        ? "De foto's zijn verwijderd. Kies een onderhoudtype om opnieuw foto's toe te voegen."
        : `Het maximum is nu ${maxPhotos} ${maxPhotos === 1 ? 'foto' : "foto's"}. Extra foto's zijn verwijderd.`,
    )
  }, [maxPhotos, photos, onPhotosChange])

  function openPicker() {
    if (!canAdd) return
    inputRef.current?.click()
  }

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list)
    const space = maxPhotos - photosRef.current.length
    if (space <= 0) {
      setNotice(
        maxPhotos === 0
          ? 'Kies eerst een onderhoudtype.'
          : `U kunt maximaal ${maxPhotos} ${maxPhotos === 1 ? 'foto' : "foto's"} toevoegen.`,
      )
      return
    }

    const accepted: File[] = []
    let message: string | null = null

    for (const file of incoming) {
      if (accepted.length >= space) {
        message = `Maximaal ${maxPhotos} ${maxPhotos === 1 ? 'foto' : "foto's"}. De overige foto's zijn niet toegevoegd.`
        break
      }
      if (!isAllowedImage(file)) {
        message = 'Kies een foto in jpg, png, webp of heic.'
        continue
      }
      if (file.size > MAX_PHOTO_BYTES) {
        message = 'Een foto mag maximaal 5 MB zijn.'
        continue
      }
      accepted.push(file)
    }

    if (accepted.length > 0) {
      onPhotosChange(
        [...photosRef.current, ...accepted].slice(0, maxPhotos),
      )
    }
    setNotice(message)
  }

  function removeAt(index: number) {
    onPhotosChange(photosRef.current.filter((_, item) => item !== index))
    setNotice(null)
  }

  function onDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    if (!canAdd) return
    dragDepth.current += 1
    setDragging(true)
  }

  function onDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
  }

  function onDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    dragDepth.current = Math.max(dragDepth.current - 1, 0)
    if (dragDepth.current === 0) setDragging(false)
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    addFiles(event.dataTransfer.files)
  }

  return (
    <section className="page-block mt-4 rounded-2xl border border-white/70 bg-white/90 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-2xl text-ink">Foto's</h2>
        {maxPhotos > 0 ? (
          <p className="pt-1 text-sm font-medium text-ink/60">
            {photos.length} / {maxPhotos}
          </p>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink/70 sm:text-base">
        {photoLimitLabel(maxPhotos)}
      </p>

      <div
        className="mt-5"
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
          multiple={maxPhotos > 1}
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files)
            event.target.value = ''
          }}
        />

        {maxPhotos === 0 ? (
          <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-mist bg-white px-4 py-8 text-center text-sm text-ink/60">
            <ImagePlus className="mb-2 size-8 text-ink/35" aria-hidden />
            Kies eerst een onderhoudtype.
          </div>
        ) : (
          <div
            className={cn(
              'grid gap-3',
              maxPhotos === 1 && 'grid-cols-1',
              maxPhotos === 2 && 'sm:grid-cols-2',
              maxPhotos >= 3 && 'sm:grid-cols-3',
            )}
          >
            {photos.map((file, index) => (
              <PhotoPreview
                key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                file={file}
                onRemove={() => removeAt(index)}
              />
            ))}
            {canAdd ? (
              <button
                type="button"
                onClick={openPicker}
                className={cn(
                  'flex min-h-36 flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center text-sm text-ink transition',
                  photos.length === 0 && 'min-h-44 sm:col-span-full',
                  dragging
                    ? 'border-teal bg-foam text-teal'
                    : 'border-teal/40 bg-foam/70 hover:border-teal hover:bg-foam',
                )}
              >
                <ImagePlus className="size-8" aria-hidden />
                <span className="font-medium">
                  {photos.length === 0
                    ? 'Sleep foto\'s hierheen of klik om te kiezen'
                    : 'Foto toevoegen'}
                </span>
                <span className="text-xs text-ink/55">
                  JPG, PNG, WEBP of HEIC, maximaal 5 MB
                </span>
              </button>
            ) : null}
          </div>
        )}
      </div>

      {notice ? (
        <p className="mt-3 text-sm text-ink/70" role="status">
          {notice}
        </p>
      ) : null}
    </section>
  )
}
