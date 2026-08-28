import { API_URL, readApiError } from './base'
import type { Airco } from '@/pages/airco/data/aircos'

export type CreateAircoInput = {
  brand: string
  model: string
  unitType?: string
  tag?: string
  description: string
  productFunction?: string
  trustPoints?: string[]
  coolingKw: number
  heatingKw: number
  seer: number
  scop: number
  energyClassCooling: string
  energyClassHeating: string
  noiseDbaInside: number
  noiseDbaOutside: number
  netSizeInside?: string
  netSizeOutside?: string
  refrigerant?: string
  roomM2: string
  heatingCoverage?: number
  priceEur: number
  accent?: string
}

export async function listAircos(): Promise<Airco[]> {
  const response = await fetch(`${API_URL}/aircos`)

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Aircos ophalen mislukt'))
  }

  return response.json() as Promise<Airco[]>
}

export async function createAirco(
  token: string,
  payload: CreateAircoInput,
): Promise<Airco> {
  const response = await fetch(`${API_URL}/aircos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Airco aanmaken mislukt'))
  }

  return response.json() as Promise<Airco>
}

export function aircoImageUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${API_URL}${url}`
}

export async function uploadAircoImage(
  token: string,
  aircoId: string,
  file: File,
  options: { sortOrder: number; label: string },
): Promise<Airco> {
  const body = new FormData()
  body.append('file', file)
  body.append('sortOrder', String(options.sortOrder))
  body.append('label', options.label)

  const response = await fetch(`${API_URL}/aircos/${aircoId}/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Foto uploaden mislukt'))
  }

  return response.json() as Promise<Airco>
}

export async function updateAirco(
  token: string,
  id: string,
  payload: CreateAircoInput,
): Promise<Airco> {
  const response = await fetch(`${API_URL}/aircos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Airco bijwerken mislukt'))
  }

  return response.json() as Promise<Airco>
}

export async function deleteAircoImage(
  token: string,
  aircoId: string,
  imageId: string,
): Promise<Airco> {
  const response = await fetch(
    `${API_URL}/aircos/${aircoId}/images/${imageId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Foto verwijderen mislukt'))
  }

  return response.json() as Promise<Airco>
}

export async function deleteAirco(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_URL}/aircos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Airco verwijderen mislukt'))
  }
}
