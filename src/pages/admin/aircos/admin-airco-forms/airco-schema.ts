import { z } from 'zod'
import type { AircoFormValues } from './airco-form-values'

export type AircoFieldErrors = Partial<Record<keyof AircoFormValues, string>>

function requiredText(label: string, max: number) {
  return z
    .string()
    .trim()
    .min(1, `${label} is verplicht.`)
    .max(max, `${label} is te lang.`)
}

function optionalText(max: number) {
  return z.string().max(max, 'Deze tekst is te lang.')
}

function requiredNumber(label: string) {
  return z
    .union([z.number(), z.literal('')])
    .refine((value) => value !== '' && Number.isFinite(value), {
      error: `${label} is verplicht.`,
    })
    .refine((value) => typeof value !== 'number' || value >= 0, {
      error: `${label} moet 0 of hoger zijn.`,
    })
}

export const aircoFormSchema = z.object({
  brand: requiredText('Merk', 80),
  model: requiredText('Model', 80),
  unitType: optionalText(80),
  tag: optionalText(120),
  description: z.string().trim().min(1, 'Beschrijving is verplicht.'),
  productFunction: optionalText(80),
  trustPoints: z.array(z.string()),
  coolingKw: requiredNumber('Koel vermogen'),
  heatingKw: requiredNumber('Verwarm vermogen'),
  seer: requiredNumber('SEER'),
  scop: requiredNumber('SCOP'),
  energyClassCooling: z
    .string()
    .min(1, 'Energielabel koelen is verplicht.')
    .max(8),
  energyClassHeating: z
    .string()
    .min(1, 'Energielabel verwarmen is verplicht.')
    .max(8),
  noiseDbaInside: requiredNumber('Geluid binnenunit'),
  noiseDbaOutside: requiredNumber('Geluid buitenunit'),
  netSizeInside: optionalText(80),
  netSizeOutside: optionalText(80),
  refrigerant: optionalText(16),
  roomM2: requiredText('Geschikte ruimte', 40),
  heatingCoverage: z
    .union([z.number(), z.literal('')])
    .refine((value) => value === '' || (Number.isFinite(value) && value >= 0), {
      error: 'Dekking verwarming moet 0 of hoger zijn.',
    }),
  priceEur: requiredNumber('Prijs'),
  accent: z.string().refine(
    (value) =>
      value === '' || /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value),
    { error: 'Accentkleur moet een hex-kleur zijn, bijvoorbeeld #005A9C.' },
  ),
})

function issuesToFieldErrors(error: z.ZodError): AircoFieldErrors {
  const fieldErrors: AircoFieldErrors = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key !== 'string') continue
    if (!(key in fieldErrors)) {
      fieldErrors[key as keyof AircoFormValues] = issue.message
    }
  }
  return fieldErrors
}

export function validateAircoForm(
  values: AircoFormValues,
): { ok: true } | { ok: false; fieldErrors: AircoFieldErrors } {
  const result = aircoFormSchema.safeParse(values)
  if (result.success) return { ok: true }
  return { ok: false, fieldErrors: issuesToFieldErrors(result.error) }
}
