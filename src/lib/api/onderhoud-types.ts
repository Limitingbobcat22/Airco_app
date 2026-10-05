import { API_URL, readApiError } from './base'

export type OnderhoudType = {
  id: string
  name: string
  sortOrder: number
  description: string | null
}

export type OnderhoudTypeInput = {
  name: string
  description?: string
  sortOrder: number
}

export async function listOnderhoudTypes(): Promise<OnderhoudType[]> {
  const response = await fetch(`${API_URL}/onderhoud-types`)

  if (!response.ok) {
    throw new Error(
      await readApiError(response, 'Onderhoudtypes ophalen mislukt'),
    )
  }

  return response.json() as Promise<OnderhoudType[]>
}

export async function createOnderhoudType(
  token: string,
  payload: OnderhoudTypeInput,
): Promise<OnderhoudType> {
  const response = await fetch(`${API_URL}/onderhoud-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, 'Onderhoudtype aanmaken mislukt'),
    )
  }

  return response.json() as Promise<OnderhoudType>
}

export async function updateOnderhoudType(
  token: string,
  id: string,
  payload: OnderhoudTypeInput,
): Promise<OnderhoudType> {
  const response = await fetch(`${API_URL}/onderhoud-types/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, 'Onderhoudtype bijwerken mislukt'),
    )
  }

  return response.json() as Promise<OnderhoudType>
}

export async function deleteOnderhoudType(
  token: string,
  id: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/onderhoud-types/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, 'Onderhoudtype verwijderen mislukt'),
    )
  }
}
