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
