import { API_URL, readApiError } from './base'
import type { KlantNawData, OfferteContext } from '@/pages/klant/types'

export type Klant = {
  id: string
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
  createdAt: string
  updatedAt: string
}

export type CreateKlantInput = {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  note?: string
  consentContact: boolean
  aircoId?: string
  areaM2?: number
  heightM?: number
  heatingSharePct?: number
  requiredKw?: number
  yearlyGasM3?: number
  gasPriceEur?: number
  elecPriceEur?: number
  netEuroSavedYearly?: number
}

export type UpdateKlantInput = Omit<
  CreateKlantInput,
  | 'aircoId'
  | 'areaM2'
  | 'heightM'
  | 'heatingSharePct'
  | 'requiredKw'
  | 'yearlyGasM3'
  | 'gasPriceEur'
  | 'elecPriceEur'
  | 'netEuroSavedYearly'
>

export function toCreateKlantPayload(
  data: KlantNawData,
  offerte?: OfferteContext | null,
): CreateKlantInput {
  const payload: CreateKlantInput = {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    street: data.street.trim(),
    houseNumber: data.houseNumber.trim(),
    postalCode: data.postalCode.trim(),
    city: data.city.trim(),
    consentContact: data.consentContact,
  }

  if (data.note.trim()) payload.note = data.note.trim()
  else payload.note = ''
  if (offerte?.aircoId) payload.aircoId = offerte.aircoId
  if (offerte?.areaM2 != null) payload.areaM2 = offerte.areaM2
  if (offerte?.heightM != null) payload.heightM = offerte.heightM
  if (offerte?.heatingSharePct != null) {
    payload.heatingSharePct = offerte.heatingSharePct
  }
  if (offerte?.requiredKw != null) payload.requiredKw = offerte.requiredKw
  if (offerte?.yearlyGasM3 != null) payload.yearlyGasM3 = offerte.yearlyGasM3
  if (offerte?.gasPriceEur != null) payload.gasPriceEur = offerte.gasPriceEur
  if (offerte?.elecPriceEur != null) payload.elecPriceEur = offerte.elecPriceEur
  if (offerte?.netEuroSavedYearly != null) {
    payload.netEuroSavedYearly = offerte.netEuroSavedYearly
  }

  return payload
}

export async function createKlant(payload: CreateKlantInput): Promise<Klant> {
  const response = await fetch(`${API_URL}/klanten`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Aanvraag versturen mislukt'))
  }

  return response.json() as Promise<Klant>
}

export async function listKlanten(token: string): Promise<Klant[]> {
  const response = await fetch(`${API_URL}/klanten`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Klanten ophalen mislukt'))
  }

  return response.json() as Promise<Klant[]>
}

export async function updateKlant(
  token: string,
  id: string,
  payload: UpdateKlantInput,
): Promise<Klant> {
  const response = await fetch(`${API_URL}/klanten/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Klant bijwerken mislukt'))
  }

  return response.json() as Promise<Klant>
}

export async function deleteKlant(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_URL}/klanten/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Klant verwijderen mislukt'))
  }
}
