import { API_URL, readApiError } from './base'
import type { Airco } from '@/pages/airco/data/aircos'

export async function listAircos(): Promise<Airco[]> {
  const response = await fetch(`${API_URL}/aircos`)

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Aircos ophalen mislukt'))
  }

  return response.json() as Promise<Airco[]>
}
