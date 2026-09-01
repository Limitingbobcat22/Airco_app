import { z } from 'zod'
import type { KlantNawData } from './types'

const DUTCH_POSTAL_CODE = /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/

export type KlantFieldErrors = Partial<Record<keyof KlantNawData, string>>

function requiredText(label: string, max: number) {
  return z
    .string()
    .trim()
    .min(1, `${label} is verplicht.`)
    .max(max, `${label} is te lang.`)
}

export const klantNawSchema = z.object({
  firstName: requiredText('Voornaam', 80),
  lastName: requiredText('Achternaam', 80),
  email: z
    .string()
    .trim()
    .min(1, 'E-mail is verplicht.')
    .pipe(z.email('Vul een geldig e-mailadres in.')),
  phone: z
    .string()
    .trim()
    .min(8, 'Telefoonnummer moet minstens 8 tekens zijn.')
    .max(30, 'Telefoonnummer is te lang.'),
  street: requiredText('Straat', 120),
  houseNumber: requiredText('Huisnummer', 16),
  postalCode: z
    .string()
    .trim()
    .min(1, 'Postcode is verplicht.')
    .regex(DUTCH_POSTAL_CODE, 'Postcode moet het formaat 1234 AB hebben.'),
  city: requiredText('Woonplaats', 80),
  note: z.string().max(2000, 'Opmerking is te lang.'),
  consentContact: z.boolean(),
})

const klantNawCreateSchema = klantNawSchema.extend({
  consentContact: z.boolean().refine((value) => value === true, {
    error: 'Toestemming voor contact is verplicht.',
  }),
})

function issuesToFieldErrors(error: z.ZodError): KlantFieldErrors {
  const fieldErrors: KlantFieldErrors = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key !== 'string') continue
    if (!(key in fieldErrors)) {
      fieldErrors[key as keyof KlantNawData] = issue.message
    }
  }
  return fieldErrors
}

export function validateKlantNaw(
  data: KlantNawData,
  options: { requireConsent?: boolean } = {},
): { ok: true } | { ok: false; fieldErrors: KlantFieldErrors } {
  const schema =
    options.requireConsent === false ? klantNawSchema : klantNawCreateSchema
  const result = schema.safeParse(data)
  if (result.success) return { ok: true }
  return { ok: false, fieldErrors: issuesToFieldErrors(result.error) }
}

/** Zet API-validatiefouten op het juiste veld, als fallback. */
export function mapApiValidationToFields(message: string): KlantFieldErrors {
  const fieldErrors: KlantFieldErrors = {}

  for (const part of message.split(', ')) {
    const lower = part.toLowerCase()
    if (lower.includes('phone')) {
      fieldErrors.phone = 'Telefoonnummer moet minstens 8 tekens zijn.'
    } else if (lower.includes('postcode') || lower.includes('postal')) {
      fieldErrors.postalCode = 'Postcode moet het formaat 1234 AB hebben.'
    } else if (lower.includes('email')) {
      fieldErrors.email = 'Vul een geldig e-mailadres in.'
    } else if (lower.includes('firstname') || lower.includes('first name')) {
      fieldErrors.firstName = 'Voornaam is verplicht.'
    } else if (lower.includes('lastname') || lower.includes('last name')) {
      fieldErrors.lastName = 'Achternaam is verplicht.'
    } else if (lower.includes('housenumber') || lower.includes('house number')) {
      fieldErrors.houseNumber = 'Huisnummer is verplicht.'
    } else if (lower.includes('street')) {
      fieldErrors.street = 'Straat is verplicht.'
    } else if (lower.includes('city')) {
      fieldErrors.city = 'Woonplaats is verplicht.'
    } else if (lower.includes('consent')) {
      fieldErrors.consentContact = 'Toestemming voor contact is verplicht.'
    }
  }

  return fieldErrors
}
