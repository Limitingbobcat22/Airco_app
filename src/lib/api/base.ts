export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export function withSearch(url: string, search?: string): string {
  if (typeof search !== 'string') return url
  const term = search.trim()
  if (!term) return url
  const params = new URLSearchParams({ search: term })
  return `${url}?${params.toString()}`
}

function filenameFromDisposition(
  header: string | null,
  fallback: string,
): string {
  if (!header) return fallback
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(header)
  if (encoded?.[1]) {
    try {
      return decodeURIComponent(encoded[1])
    } catch {
      return encoded[1]
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(header)
  return plain?.[1] ?? fallback
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export async function downloadResponseFile(
  response: Response,
  fallbackFilename: string,
): Promise<void> {
  const blob = await response.blob()
  downloadBlob(
    blob,
    filenameFromDisposition(
      response.headers.get('Content-Disposition'),
      fallbackFilename,
    ),
  )
}

const exportStamp = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Amsterdam',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export function exportFilename(subject: string, now = new Date()): string {
  const parts = exportStamp.formatToParts(now)
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '00'
  return `aircoenwarmte-${subject}-${pick('year')}-${pick('month')}-${pick('day')}-${pick('hour')}-${pick('minute')}.xlsx`
}

export async function downloadAdminExport(
  token: string,
  path: string,
  subject: string,
  search?: string,
  columns?: string[],
): Promise<void> {
  const params = new URLSearchParams()
  const term = search?.trim()
  if (term) params.set('search', term)
  if (columns?.length) params.set('columns', columns.join(','))
  const query = params.toString()
  const response = await fetch(
    `${API_URL}${path}${query ? `?${query}` : ''}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Exporteren mislukt'))
  }

  await downloadResponseFile(response, exportFilename(subject))
}

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
