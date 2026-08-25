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

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

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
    let message = 'Inloggen mislukt'
    try {
      const body = (await response.json()) as { message?: string | string[] }
      if (Array.isArray(body.message)) message = body.message.join(', ')
      else if (body.message) message = body.message
    } catch {
      // ignore parse errors
    }
    throw new Error(message)
  }

  return response.json() as Promise<LoginResponse>
}
