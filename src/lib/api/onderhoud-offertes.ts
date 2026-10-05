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

/** Eén offerte, met klantgegevens uit de klantentabel. Voor bewerken. */
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
  images: OnderhoudOffertePhoto[]
  createdAt: string
  updatedAt: string
}

/** Rij uit onderhoud_offerte_overview. Voor de beheertabel. */
export type OnderhoudOfferteOverview = {
  id: string
  klantId: string | null
  name: string | null
  email: string | null
  phone: string | null
  city: string | null
  typeNames: string | null
  imageCount: number
  createdAt: string
  updatedAt: string
}

export type SaveOnderhoudOfferteInput = {
  klantId: string
  typeIds: string[]
  images: File[]
  keepImageIds?: string[]
}

function appendOfferteFields(
  body: FormData,
  input: SaveOnderhoudOfferteInput,
) {
  body.append('klantId', input.klantId)
  body.append('typeIds', JSON.stringify(input.typeIds))
  if (input.keepImageIds) {
    body.append('keepImageIds', JSON.stringify(input.keepImageIds))
  }
  for (const image of input.images) {
    body.append('images', image)
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
): Promise<OnderhoudOfferteOverview[]> {
  const response = await fetch(`${API_URL}/onderhoud-offertes`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, 'Onderhoudoffertes ophalen mislukt'),
    )
  }

  return response.json() as Promise<OnderhoudOfferteOverview[]>
}

export async function getOnderhoudOfferte(
  token: string,
  id: string,
): Promise<OnderhoudOfferte> {
  const response = await fetch(`${API_URL}/onderhoud-offertes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, 'Onderhoudofferte ophalen mislukt'),
    )
  }

  return response.json() as Promise<OnderhoudOfferte>
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

export async function fetchOnderhoudImageUrl(
  token: string,
  offerteId: string,
  imageId: string,
): Promise<string> {
  const response = await fetch(
    `${API_URL}/onderhoud-offertes/${offerteId}/images/${imageId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Foto ophalen mislukt'))
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}
