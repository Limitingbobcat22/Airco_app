import { z } from 'zod'

export type OfferteFormValues = {
  klantId: string
  aircoId: string
  areaM2: number | ''
  heightM: number | ''
  heatingSharePct: number | ''
  requiredKw: number | ''
  yearlyGasM3: number | ''
  gasPriceEur: number | ''
  elecPriceEur: number | ''
  netEuroSavedYearly: number | ''
}

export type OfferteFieldErrors = Partial<Record<keyof OfferteFormValues, string>>

function optionalNumber(label: string) {
  return z
    .union([z.number(), z.literal('')])
    .refine((value) => value === '' || (Number.isFinite(value) && value >= 0), {
      error: `${label} moet 0 of hoger zijn.`,
    })
}

export const offerteFormSchema = z.object({
  klantId: z.string().min(1, 'Kies een klant.'),
  aircoId: z.string(),
  areaM2: optionalNumber('Oppervlakte'),
  heightM: optionalNumber('Hoogte'),
  heatingSharePct: optionalNumber('Aandeel airco'),
  requiredKw: optionalNumber('Aanbevolen vermogen'),
  yearlyGasM3: optionalNumber('Gasverbruik'),
  gasPriceEur: optionalNumber('Gasprijs'),
  elecPriceEur: optionalNumber('Stroomprijs'),
  netEuroSavedYearly: z
    .union([z.number(), z.literal('')])
    .refine((value) => value === '' || Number.isFinite(value), {
      error: 'Geschat voordeel is ongeldig.',
    }),
})

export function validateOfferteForm(
  values: OfferteFormValues,
): { ok: true } | { ok: false; fieldErrors: OfferteFieldErrors } {
  const result = offerteFormSchema.safeParse(values)
  if (result.success) return { ok: true }
  const fieldErrors: OfferteFieldErrors = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0]
    if (typeof key !== 'string') continue
    if (!(key in fieldErrors)) {
      fieldErrors[key as keyof OfferteFormValues] = issue.message
    }
  }
  return { ok: false, fieldErrors }
}
