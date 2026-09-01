import { useEffect, useState, type FormEvent } from 'react'
import type { Klant } from '@/lib/api/klanten'
import { cn } from '@/lib/utils'
import { NawTextField } from '@/pages/klant/components/naw-text-field'
import {
  mapApiValidationToFields,
  validateKlantNaw,
  type KlantFieldErrors,
} from '@/pages/klant/schema'
import {
  EMPTY_KLANT_NAW,
  type KlantNawData,
} from '@/pages/klant/types'

type KlantAdminFormProps = {
  initial?: Klant | null
  submitting?: boolean
  error?: string | null
  onSubmit: (data: KlantNawData) => void
  onDirtyChange?: (dirty: boolean) => void
  onCancel: () => void
}

function toFormValues(klant?: Klant | null): KlantNawData {
  if (!klant) return { ...EMPTY_KLANT_NAW, consentContact: true }
  return {
    firstName: klant.firstName,
    lastName: klant.lastName,
    email: klant.email,
    phone: klant.phone,
    street: klant.street,
    houseNumber: klant.houseNumber,
    postalCode: klant.postalCode,
    city: klant.city,
    note: klant.note ?? '',
    consentContact: Boolean(klant.consentContact),
  }
}

export default function KlantAdminForm({
  initial,
  submitting = false,
  error,
  onSubmit,
  onDirtyChange,
  onCancel,
}: KlantAdminFormProps) {
  const [form, setForm] = useState<KlantNawData>(() => toFormValues(initial))
  const [fieldErrors, setFieldErrors] = useState<KlantFieldErrors>({})

  useEffect(() => {
    setForm(toFormValues(initial))
  }, [initial])

  useEffect(() => {
    const baseline = JSON.stringify(toFormValues(initial))
    onDirtyChange?.(JSON.stringify(form) !== baseline)
    return () => onDirtyChange?.(false)
  }, [form, initial, onDirtyChange])

  const updateField = (name: keyof KlantNawData, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = validateKlantNaw(form, { requireConsent: !initial })
    if (!result.ok) {
      setFieldErrors(result.fieldErrors)
      return
    }
    setFieldErrors({})
    onSubmit(form)
  }

  const serverFieldErrors = error ? mapApiValidationToFields(error) : {}
  const shownErrors = { ...serverFieldErrors, ...fieldErrors }
  const generalError =
    error && Object.keys(serverFieldErrors).length === 0 ? error : null

  return (
    <form className="space-y-5 py-2 pb-4" noValidate onSubmit={handleSubmit}>
      <div>
        <p className="text-xs font-medium tracking-[0.1em] text-ink/45 uppercase">
          {initial ? 'Klant bewerken' : 'Klant toevoegen'}
        </p>
        <h3 className="mt-1 font-display text-2xl text-ink">
          {form.firstName || form.lastName
            ? `${form.firstName} ${form.lastName}`.trim()
            : 'Nieuwe klant'}
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NawTextField
          label="Voornaam"
          name="firstName"
          value={form.firstName}
          required
          autoComplete="given-name"
          error={shownErrors.firstName}
          onChange={updateField}
        />
        <NawTextField
          label="Achternaam"
          name="lastName"
          value={form.lastName}
          required
          autoComplete="family-name"
          error={shownErrors.lastName}
          onChange={updateField}
        />
        <NawTextField
          label="E-mail"
          name="email"
          type="email"
          value={form.email}
          required
          autoComplete="email"
          error={shownErrors.email}
          onChange={updateField}
        />
        <NawTextField
          label="Telefoon"
          name="phone"
          type="tel"
          value={form.phone}
          required
          autoComplete="tel"
          error={shownErrors.phone}
          onChange={updateField}
        />
        <div className="sm:col-span-2 grid gap-4 sm:grid-cols-[1fr_7rem]">
          <NawTextField
            label="Straat"
            name="street"
            value={form.street}
            required
            autoComplete="street-address"
            error={shownErrors.street}
            onChange={updateField}
          />
          <NawTextField
            label="Nr."
            name="houseNumber"
            value={form.houseNumber}
            required
            error={shownErrors.houseNumber}
            onChange={updateField}
          />
        </div>
        <NawTextField
          label="Postcode"
          name="postalCode"
          value={form.postalCode}
          required
          autoComplete="postal-code"
          placeholder="1234 AB"
          error={shownErrors.postalCode}
          onChange={updateField}
        />
        <NawTextField
          label="Woonplaats"
          name="city"
          value={form.city}
          required
          autoComplete="address-level2"
          error={shownErrors.city}
          onChange={updateField}
        />
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink/70">
          Opmerking
        </span>
        {shownErrors.note ? (
          <p className="mb-2 text-sm text-destructive">{shownErrors.note}</p>
        ) : null}
        <textarea
          name="note"
          rows={3}
          value={form.note}
          onChange={(event) => updateField('note', event.target.value)}
          className={cn(
            'w-full resize-y rounded-xl border bg-foam px-3 py-2.5 text-ink outline-none',
            shownErrors.note
              ? 'border-destructive focus:border-destructive'
              : 'border-mist focus:border-teal',
          )}
        />
      </label>

      <div>
        {shownErrors.consentContact ? (
          <p className="mb-2 text-sm text-destructive">
            {shownErrors.consentContact}
          </p>
        ) : null}
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink/80">
          <input
            type="checkbox"
            name="consentContact"
            checked={form.consentContact}
            onChange={(event) => {
              setForm((prev) => ({
                ...prev,
                consentContact: event.target.checked,
              }))
              setFieldErrors((prev) => {
                if (!prev.consentContact) return prev
                const next = { ...prev }
                delete next.consentContact
                return next
              })
            }}
            className="mt-0.5 size-4 shrink-0 rounded border-mist accent-teal"
          />
          <span>Toestemming om contact op te nemen over de offerteaanvraag.</span>
        </label>
      </div>

      {generalError ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {generalError}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-mist bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-foam disabled:opacity-60"
        >
          Annuleren
        </button>
        <button
          type="submit"
          disabled={submitting || (!initial && !form.consentContact)}
          className="rounded-xl bg-mint px-5 py-3 text-sm font-semibold text-ink hover:bg-white disabled:opacity-60"
        >
          {submitting ? 'Opslaan…' : 'Opslaan'}
        </button>
      </div>
    </form>
  )
}
