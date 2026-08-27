export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function readApiError(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string | string[] }
    if (Array.isArray(body.message)) return body.message.join(', ')
    if (body.message) return body.message
  } catch {
    // ignore parse errors
  }
  return fallback
}
