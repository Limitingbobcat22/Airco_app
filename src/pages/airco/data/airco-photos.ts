import type { AircoImageMeta } from './aircos'

export const AIRCO_PHOTO_SLOTS = [
  {
    sortOrder: 0,
    id: 'front',
    label: 'Vooraanzicht',
    hint: 'Foto 1 van 3',
  },
  {
    sortOrder: 1,
    id: 'angle',
    label: 'Schuin aanzicht',
    hint: 'Foto 2 van 3',
  },
  {
    sortOrder: 2,
    id: 'detail',
    label: 'Detail',
    hint: 'Foto 3 van 3',
  },
] as const

export const MAX_AIRCO_IMAGE_BYTES = 5 * 1024 * 1024

export type PendingAircoImage = {
  sortOrder: number
  label: string
  file: File
}

export function pendingImagesFromFiles(
  files: (File | null)[],
): PendingAircoImage[] {
  return AIRCO_PHOTO_SLOTS.flatMap((slot) => {
    const file = files[slot.sortOrder]
    if (!file) return []
    return [{ sortOrder: slot.sortOrder, label: slot.label, file }]
  })
}

export function imageSlotsFromAirco(
  images: AircoImageMeta[],
): (AircoImageMeta | null)[] {
  return AIRCO_PHOTO_SLOTS.map(
    (slot) =>
      images.find((image) => image.sortOrder === slot.sortOrder) ?? null,
  )
}

export function removedImageIds(
  initial: (AircoImageMeta | null)[],
  current: (AircoImageMeta | null)[],
  files: (File | null)[],
): string[] {
  return AIRCO_PHOTO_SLOTS.flatMap((slot) => {
    const original = initial[slot.sortOrder]
    if (!original) return []
    if (files[slot.sortOrder]) return []
    if (current[slot.sortOrder]) return []
    return [original.id]
  })
}
