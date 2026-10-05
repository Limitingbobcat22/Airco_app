import type { KlantNawData } from '@/pages/klant/types'
import { API_URL, readApiError } from './base'

export type OnderhoudOfferteTypeRef = {
  id: string
  name: string
  sortOrder: number
}

export type OnderhoudOffertePhoto = {
  id: string
  sortOrder: number
  mimeType: string
  originalFilename: string
  url: string
}

export type OnderhoudOfferte = {
  id: string
  klantId: string | null
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  note: string | null
  consentContact: boolean
  consentTerms: boolean
  types: OnderhoudOfferteTypeRef[]
  photos: OnderhoudOffertePhoto[]
  createdAt: string
  updatedAt: string
}

export type SaveOnderhoudOfferteInput = {
  klant: KlantNawData
  klantId?: string
  typeIds: string[]
  photos: File[]
  keepPhotoIds?: string[]
}

function appendOfferteFields(
  body: FormData,
  input: SaveOnderhoudOfferteInput,
) {
  const { klant } = input
  body.append('firstName', klant.firstName.trim())
  body.append('lastName', klant.lastName.trim())
  body.append('email', klant.email.trim())
  body.append('phone', klant.phone.trim())
  body.append('street', klant.street.trim())
  body.append('houseNumber', klant.houseNumber.trim())
  body.append('postalCode', klant.postalCode.trim())
  body.append('city', klant.city.trim())
  body.append('note', klant.note.trim())
  body.append('consentContact', String(klant.consentContact))
  body.append('consentTerms', String(klant.consentTerms))
  if (input.klantId) body.append('klantId', input.klantId)
  body.append('typeIds', JSON.stringify(input.typeIds))
  if (input.keepPhotoIds) {
    body.append('keepPhotoIds', JSON.stringify(input.keepPhotoIds))
  }
  for (const photo of input.photos) {
    body.append('photos', photo)
  }
}

export async function createOnderhoudOfferte(
  input: SaveOnderhoudOfferteInput,
): Promise<OnderhoudOfferte> {
  const body = new FormData()
  appendOfferteFields(body, input)

  const response = await fetch(`${API_URL}/onderhoud-offertes`, {
    method: 'POST',
    body,
  })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, 'Onderhoudsaanvraag versturen mislukt'),
    )
  }

  return response.json() as Promise<OnderhoudOfferte>
}

export async function createOnderhoudOfferteAdmin(
  token: string,
  input: SaveOnderhoudOfferteInput,
): Promise<OnderhoudOfferte> {
  const body = new FormData()
  appendOfferteFields(body, input)

  const response = await fetch(`${API_URL}/onderhoud-offertes/beheer`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, 'Onderhoudofferte aanmaken mislukt'),
    )
  }

  return response.json() as Promise<OnderhoudOfferte>
}

export async function listOnderhoudOffertes(
  token: string,
): Promise<OnderhoudOfferte[]> {
  const response = await fetch(`${API_URL}/onderhoud-offertes`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, 'Onderhoudoffertes ophalen mislukt'),
    )
  }

  return response.json() as Promise<OnderhoudOfferte[]>
}

export async function updateOnderhoudOfferte(
  token: string,
  id: string,
  input: SaveOnderhoudOfferteInput,
): Promise<OnderhoudOfferte> {
  const body = new FormData()
  appendOfferteFields(body, input)

  const response = await fetch(`${API_URL}/onderhoud-offertes/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, 'Onderhoudofferte bijwerken mislukt'),
    )
  }

  return response.json() as Promise<OnderhoudOfferte>
}

export async function deleteOnderhoudOfferte(
  token: string,
  id: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/onderhoud-offertes/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, 'Onderhoudofferte verwijderen mislukt'),
    )
  }
}

export async function fetchOnderhoudFotoUrl(
  token: string,
  offerteId: string,
  fotoId: string,
): Promise<string> {
  const response = await fetch(
    `${API_URL}/onderhoud-offertes/${offerteId}/fotos/${fotoId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Foto ophalen mislukt'))
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}
