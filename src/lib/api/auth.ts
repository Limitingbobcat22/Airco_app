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
