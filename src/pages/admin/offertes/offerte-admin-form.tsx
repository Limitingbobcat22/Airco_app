import { useEffect, useState, type FormEvent } from 'react'
import type { Klant } from '@/lib/api/klanten'
import type { CreateOfferteInput, Offerte } from '@/lib/api/offertes'
import { cn } from '@/lib/utils'
import { parseNumberInput } from '@/pages/admin/aircos/admin-airco-forms/airco-form-values'
import type { Airco } from '@/pages/airco/data/aircos'
import {
  validateOfferteForm,
  type OfferteFieldErrors,
  type OfferteFormValues,
} from './offerte-schema'

type OfferteAdminFormProps = {
  initial?: Offerte | null
  klanten: Klant[]
  aircos: Airco[]
  submitting?: boolean
  error?: string | null
  onSubmit: (payload: CreateOfferteInput) => void
  onDirtyChange?: (dirty: boolean) => void
  onCancel: () => void
}

const EMPTY_FORM: OfferteFormValues = {
  klantId: '',
  aircoId: '',
  areaM2: '',
  heightM: '',
  heatingSharePct: '',
  requiredKw: '',
  yearlyGasM3: '',
  gasPriceEur: '',
  elecPriceEur: '',
  netEuroSavedYearly: '',
}

const selectClass =
  'w-full rounded-xl border border-mist bg-foam px-3 py-2.5 text-ink outline-none focus:border-teal'

function NumberField({
  label,
  step,
  value,
  error,
  onChange,
}: {
  label: string
  step: number
  value: number | ''
  error?: string
  onChange: (value: number | '') => void
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink/70">{label}</span>
      {error ? <p className="mb-2 text-sm text-destructive">{error}</p> : null}
      <input
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(event) => onChange(parseNumberInput(event.target.value))}
        className={selectClass}
      />
    </label>
  )
}

const eur = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

function toFormValues(offerte?: Offerte | null): OfferteFormValues {
  if (!offerte) return { ...EMPTY_FORM }
  return {
    klantId: offerte.klantId ?? '',
    aircoId: offerte.aircoId ?? '',
    areaM2: offerte.areaM2 ?? '',
    heightM: offerte.heightM ?? '',
    heatingSharePct: offerte.heatingSharePct ?? '',
    requiredKw: offerte.requiredKw ?? '',
    yearlyGasM3: offerte.yearlyGasM3 ?? '',
    gasPriceEur: offerte.gasPriceEur ?? '',
    elecPriceEur: offerte.elecPriceEur ?? '',
    netEuroSavedYearly: offerte.netEuroSavedYearly ?? '',
  }
}

function optionalNumber(value: number | ''): number | null {
  return value === '' ? null : value
}

function toPayload(values: OfferteFormValues): CreateOfferteInput {
  return {
    klantId: values.klantId,
    aircoId: values.aircoId || null,
    areaM2: optionalNumber(values.areaM2),
    heightM: optionalNumber(values.heightM),
    heatingSharePct: optionalNumber(values.heatingSharePct),
    requiredKw: optionalNumber(values.requiredKw),
    yearlyGasM3: optionalNumber(values.yearlyGasM3),
    gasPriceEur: optionalNumber(values.gasPriceEur),
    elecPriceEur: optionalNumber(values.elecPriceEur),
    netEuroSavedYearly: optionalNumber(values.netEuroSavedYearly),
  }
}

export default function OfferteAdminForm({
  initial,
  klanten,
  aircos,
  submitting = false,
  error,
  onSubmit,
  onDirtyChange,
  onCancel,
}: OfferteAdminFormProps) {
  const [form, setForm] = useState<OfferteFormValues>(() => toFormValues(initial))
  const [fieldErrors, setFieldErrors] = useState<OfferteFieldErrors>({})

  useEffect(() => {
    setForm(toFormValues(initial))
  }, [initial])

  useEffect(() => {
    const baseline = JSON.stringify(toFormValues(initial))
    onDirtyChange?.(JSON.stringify(form) !== baseline)
    return () => onDirtyChange?.(false)
  }, [form, initial, onDirtyChange])

  const selectedKlant = klanten.find((item) => item.id === form.klantId)
  const selectedAirco = aircos.find((item) => item.id === form.aircoId)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = validateOfferteForm(form)
    if (!result.ok) {
      setFieldErrors(result.fieldErrors)
      return
    }
    setFieldErrors({})
    onSubmit(toPayload(form))
  }

  return (
    <form className="space-y-5 py-2 pb-4" noValidate onSubmit={handleSubmit}>
      <div>
        <p className="text-xs font-medium tracking-[0.1em] text-ink/45 uppercase">
          {initial ? 'Offerte bewerken' : 'Offerte toevoegen'}
        </p>
        <h3 className="mt-1 font-display text-2xl text-ink">
          {selectedKlant
            ? `${selectedKlant.firstName} ${selectedKlant.lastName}`.trim()
            : 'Nieuwe offerte'}
        </h3>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink/70">
          Klant <span className="text-teal">*</span>
        </span>
        {fieldErrors.klantId ? (
          <p className="mb-2 text-sm text-destructive">{fieldErrors.klantId}</p>
        ) : null}
        <select
          value={form.klantId}
          onChange={(event) => {
            setForm((prev) => ({ ...prev, klantId: event.target.value }))
            setFieldErrors((prev) => {
              if (!prev.klantId) return prev
              const next = { ...prev }
              delete next.klantId
              return next
            })
          }}
          className={cn(
            selectClass,
            fieldErrors.klantId && 'border-destructive focus:border-destructive',
          )}
        >
          <option value="">Kies een klant</option>
          {klanten.map((klant) => (
            <option key={klant.id} value={klant.id}>
              {klant.firstName} {klant.lastName} · {klant.email}
            </option>
          ))}
        </select>
      </label>

      {selectedKlant ? (
        <div className="rounded-2xl border border-mist bg-white px-4 py-3 text-sm text-ink/75">
          <p className="font-medium text-ink">
            {selectedKlant.firstName} {selectedKlant.lastName}
          </p>
          <p className="mt-1">{selectedKlant.email}</p>
          <p>{selectedKlant.phone}</p>
          <p className="mt-1">
            {selectedKlant.street} {selectedKlant.houseNumber},{' '}
            {selectedKlant.postalCode} {selectedKlant.city}
          </p>
        </div>
      ) : null}

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink/70">Airco</span>
        <select
          value={form.aircoId}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, aircoId: event.target.value }))
          }
          className={selectClass}
        >
          <option value="">Geen model gekozen</option>
          {aircos.map((airco) => (
            <option key={airco.id} value={airco.id}>
              {airco.brand} {airco.model}
            </option>
          ))}
        </select>
      </label>

      {selectedAirco ? (
        <div className="rounded-2xl border border-mist bg-white px-4 py-3 text-sm text-ink/75">
          <p className="font-medium text-ink">
            {selectedAirco.brand} {selectedAirco.model}
          </p>
          <p className="mt-1">
            Koelen {selectedAirco.coolingKw.toFixed(1)} kW · Verwarmen{' '}
            {selectedAirco.heatingKw.toFixed(1)} kW
          </p>
          <p>Prijs vanaf {eur.format(selectedAirco.priceEur)}</p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Oppervlakte ruimte (m²)"
          step={1}
          value={form.areaM2}
          error={fieldErrors.areaM2}
          onChange={(value) => {
            setForm((prev) => ({ ...prev, areaM2: value }))
            setFieldErrors((prev) => {
              if (!prev.areaM2) return prev
              const next = { ...prev }
              delete next.areaM2
              return next
            })
          }}
        />
        <NumberField
          label="Hoogte ruimte (meter)"
          step={0.1}
          value={form.heightM}
          error={fieldErrors.heightM}
          onChange={(value) => {
            setForm((prev) => ({ ...prev, heightM: value }))
            setFieldErrors((prev) => {
              if (!prev.heightM) return prev
              const next = { ...prev }
              delete next.heightM
              return next
            })
          }}
        />
        <NumberField
          label="Deel van de woning via airco (%)"
          step={5}
          value={form.heatingSharePct}
          error={fieldErrors.heatingSharePct}
          onChange={(value) => {
            setForm((prev) => ({ ...prev, heatingSharePct: value }))
            setFieldErrors((prev) => {
              if (!prev.heatingSharePct) return prev
              const next = { ...prev }
              delete next.heatingSharePct
              return next
            })
          }}
        />
        <NumberField
          label="Aanbevolen vermogen (kW)"
          step={0.1}
          value={form.requiredKw}
          error={fieldErrors.requiredKw}
          onChange={(value) => {
            setForm((prev) => ({ ...prev, requiredKw: value }))
            setFieldErrors((prev) => {
              if (!prev.requiredKw) return prev
              const next = { ...prev }
              delete next.requiredKw
              return next
            })
          }}
        />
        <NumberField
          label="Jaarlijks gasverbruik (m³)"
          step={50}
          value={form.yearlyGasM3}
          error={fieldErrors.yearlyGasM3}
          onChange={(value) => {
            setForm((prev) => ({ ...prev, yearlyGasM3: value }))
            setFieldErrors((prev) => {
              if (!prev.yearlyGasM3) return prev
              const next = { ...prev }
              delete next.yearlyGasM3
              return next
            })
          }}
        />
        <NumberField
          label="Huidige gasprijs (€ per m³)"
          step={0.01}
          value={form.gasPriceEur}
          error={fieldErrors.gasPriceEur}
          onChange={(value) => {
            setForm((prev) => ({ ...prev, gasPriceEur: value }))
            setFieldErrors((prev) => {
              if (!prev.gasPriceEur) return prev
              const next = { ...prev }
              delete next.gasPriceEur
              return next
            })
          }}
        />
        <NumberField
          label="Huidige stroomprijs (€ per kWh)"
          step={0.01}
          value={form.elecPriceEur}
          error={fieldErrors.elecPriceEur}
          onChange={(value) => {
            setForm((prev) => ({ ...prev, elecPriceEur: value }))
            setFieldErrors((prev) => {
              if (!prev.elecPriceEur) return prev
              const next = { ...prev }
              delete next.elecPriceEur
              return next
            })
          }}
        />
        <NumberField
          label="Geschat voordeel / jaar (€)"
          step={1}
          value={form.netEuroSavedYearly}
          error={fieldErrors.netEuroSavedYearly}
          onChange={(value) => {
            setForm((prev) => ({ ...prev, netEuroSavedYearly: value }))
            setFieldErrors((prev) => {
              if (!prev.netEuroSavedYearly) return prev
              const next = { ...prev }
              delete next.netEuroSavedYearly
              return next
            })
          }}
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
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
          disabled={submitting}
          className="rounded-xl bg-mint px-5 py-3 text-sm font-semibold text-ink hover:bg-white disabled:opacity-60"
        >
          {submitting ? 'Opslaan…' : 'Opslaan'}
        </button>
      </div>
    </form>
  )
}
