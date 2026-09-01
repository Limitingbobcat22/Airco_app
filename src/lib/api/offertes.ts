import { API_URL, readApiError } from './base'
import type { Klant } from './klanten'

export type OfferteAirco = {
  id: string
  brand: string
  model: string
  unitType: string
  tag: string
  description: string
  productFunction: string
  trustPoints: string[]
  coolingKw: number
  heatingKw: number
  seer: number
  scop: number
  energyClassCooling: string
  energyClassHeating: string
  noiseDbaInside: number
  noiseDbaOutside: number
  netSizeInside: string
  netSizeOutside: string
  refrigerant: string
  roomM2: string
  heatingCoverage: number
  priceEur: number
  accent: string
}

export type Offerte = {
  id: string
  klantId: string | null
  aircoId: string | null
  areaM2: number | null
  heightM: number | null
  heatingSharePct: number | null
  requiredKw: number | null
  yearlyGasM3: number | null
  gasPriceEur: number | null
  elecPriceEur: number | null
  netEuroSavedYearly: number | null
  klant: Klant | null
  airco: OfferteAirco | null
  createdAt: string
  updatedAt: string
}

export type CreateOfferteInput = {
  klantId: string
  aircoId?: string | null
  areaM2?: number | null
  heightM?: number | null
  heatingSharePct?: number | null
  requiredKw?: number | null
  yearlyGasM3?: number | null
  gasPriceEur?: number | null
  elecPriceEur?: number | null
  netEuroSavedYearly?: number | null
}

export type UpdateOfferteInput = Partial<CreateOfferteInput>

export function offerteKlantNaam(offerte: Offerte): string {
  if (!offerte.klant) return 'Klant verwijderd'
  return `${offerte.klant.firstName} ${offerte.klant.lastName}`.trim()
}

export function offerteAircoLabel(offerte: Offerte): string {
  if (!offerte.airco) return '–'
  return `${offerte.airco.brand} ${offerte.airco.model}`.trim()
}

export async function listOffertes(token: string): Promise<Offerte[]> {
  const response = await fetch(`${API_URL}/offertes`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Offertes ophalen mislukt'))
  }

  return response.json() as Promise<Offerte[]>
}

export async function createOfferte(
  token: string,
  payload: CreateOfferteInput,
): Promise<Offerte> {
  const response = await fetch(`${API_URL}/offertes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Offerte aanmaken mislukt'))
  }

  return response.json() as Promise<Offerte>
}

export async function updateOfferte(
  token: string,
  id: string,
  payload: UpdateOfferteInput,
): Promise<Offerte> {
  const response = await fetch(`${API_URL}/offertes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Offerte bijwerken mislukt'))
  }

  return response.json() as Promise<Offerte>
}

export async function deleteOfferte(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_URL}/offertes/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Offerte verwijderen mislukt'))
  }
}
