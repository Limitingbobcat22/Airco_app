import { API_URL, readApiError } from './base'

export type AuthUser = {
  id: string
  email: string
  isAdmin: boolean
}

export type LoginResponse = {
  access_token: string
  token_type: string
  expires_in: string
  user: AuthUser
}

export class SessionUnauthorizedError extends Error {
  constructor() {
    super('Sessie verlopen')
    this.name = 'SessionUnauthorizedError'
  }
}

/** Controleert de opgeslagen token via de bestaande /auth/me route. */
export async function fetchSession(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (response.status === 401) {
    throw new SessionUnauthorizedError()
  }

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Sessie controleren mislukt'))
  }

  const body = (await response.json()) as {
    sub: string
    email: string
    isAdmin: boolean
  }

  return {
    id: body.sub,
    email: body.email,
    isAdmin: Boolean(body.isAdmin),
  }
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Inloggen mislukt'))
  }

  return response.json() as Promise<LoginResponse>
}
