import { API_URL, readApiError } from './base'

export type Handleiding = {
  id: string
  title: string
  description: string | null
  originalFilename: string
  mimeType: string
  url: string
  createdAt: string
  updatedAt: string
}

export type CreateHandleidingInput = {
  title: string
  description?: string
  file: File
}

export type UpdateHandleidingInput = {
  title: string
  description?: string
  file?: File
}

export async function listHandleidingen(): Promise<Handleiding[]> {
  const response = await fetch(`${API_URL}/handleidingen`)

  if (!response.ok) {
    throw new Error(
      await readApiError(response, 'Handleidingen ophalen mislukt'),
    )
  }

  return response.json() as Promise<Handleiding[]>
}

export async function createHandleiding(
  token: string,
  payload: CreateHandleidingInput,
): Promise<Handleiding> {
  const body = new FormData()
  body.append('file', payload.file)
  body.append('title', payload.title)
  if (payload.description?.trim()) {
    body.append('description', payload.description.trim())
  }

  const response = await fetch(`${API_URL}/handleidingen`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, 'Handleiding uploaden mislukt'),
    )
  }

  return response.json() as Promise<Handleiding>
}

export async function updateHandleiding(
  token: string,
  id: string,
  payload: UpdateHandleidingInput,
): Promise<Handleiding> {
  const body = new FormData()
  body.append('title', payload.title)
  body.append('description', payload.description?.trim() ?? '')
  if (payload.file) {
    body.append('file', payload.file)
  }

  const response = await fetch(`${API_URL}/handleidingen/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, 'Handleiding bijwerken mislukt'),
    )
  }

  return response.json() as Promise<Handleiding>
}

export async function deleteHandleiding(
  token: string,
  id: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/handleidingen/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(
      await readApiError(response, 'Handleiding verwijderen mislukt'),
    )
  }
}

export function handleidingFileUrl(handleiding: Pick<Handleiding, 'id' | 'url'>): string {
  if (handleiding.url.startsWith('http://') || handleiding.url.startsWith('https://')) {
    return handleiding.url
  }
  return `${API_URL}${handleiding.url}`
}
