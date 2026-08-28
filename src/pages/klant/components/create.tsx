import { Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import {
  EMPTY_KLANT_NAW,
  type KlantNawData,
  type OfferteContext,
} from '../types'

const eur = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

type CreateKlantFormProps = {
  offerte?: OfferteContext | null
  onClose: () => void
  onSubmit?: (data: KlantNawData) => void | Promise<void>
}

function TextField({
  label,
  name,
  type = 'text',
  value,
  required,
  autoComplete,
  placeholder,
  onChange,
}: {
  label: string
  name: keyof KlantNawData
  type?: string
  value: string
  required?: boolean
  autoComplete?: string
  placeholder?: string
  onChange: (name: keyof KlantNawData, value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink/70">
        {label}
        {required ? <span className="text-teal"> *</span> : null}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(name, event.target.value)}
        className="w-full rounded-xl border border-mist bg-foam px-3 py-2.5 text-ink outline-none focus:border-teal"
      />
    </label>
  )
}

export default function CreateKlantForm({
  offerte,
  onClose,
  onSubmit,
}: CreateKlantFormProps) {
  const [form, setForm] = useState<KlantNawData>(EMPTY_KLANT_NAW)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const updateField = (name: keyof KlantNawData, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      // Backend/API volgt later — payload is klaar voor e-mailverzending.
      await onSubmit?.(form)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="py-6 text-center">
        <p className="text-xs font-medium tracking-[0.2em] text-teal uppercase">
          Aanvraag ontvangen
        </p>
        <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
          Bedankt, {form.firstName}
        </h2>
        <p className="mt-3 text-sm text-ink/70">
          Wij nemen zo snel mogelijk contact met u op over uw offerte.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-deep py-3 text-sm font-semibold text-white hover:bg-teal sm:w-auto sm:px-8"
        >
          Sluiten
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 py-2 pb-4">
      <div>
        <h2 className="text-xl font-medium tracking-[0.2em] text-teal uppercase">
          Offerte
        </h2>
        <p className="mt-2 text-sm text-ink/70">
          Vul uw NAW-gegevens in. Wij gebruiken deze om uw offerteaanvraag te
          versturen.
        </p>
      </div>

      <div className="rounded-2xl border border-mist bg-foam px-4 py-3 text-sm text-ink/75">
        <p className="font-medium text-ink">Algemene informatie</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-4">
          <li>
            Na uw aanvraag nemen wij zo snel mogelijk contact met u op, meestal
            binnen 1 werkdag.
          </li>
          <li>
            Wij bespreken uw situatie, het gekozen model en een prijsvoorstel op
            maat.
          </li>
          <li>
            Een aanvraag is vrijblijvend — u zit nergens aan vast.
          </li>
          <li>
            Uw gegevens gebruiken wij alleen om contact met u op te nemen over
            deze offerte.
          </li>
        </ul>
      </div>

      {offerte ? (
        <div className="rounded-2xl border border-mist bg-white px-4 py-3 text-sm text-ink/75">
          <p>
            Gekozen model:{' '}
            <span className="font-medium text-ink">{offerte.aircoLabel}</span>
          </p>
          <p className="mt-1">
            Koel vermogen: {offerte.coolingKw.toFixed(1)} kW
            {offerte.netEuroSavedYearly != null ? (
              <>
                {' · '}Geschat voordeel:{' '}
                {eur.format(offerte.netEuroSavedYearly)} / jaar
              </>
            ) : null}
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Voornaam"
          name="firstName"
          value={form.firstName}
          required
          autoComplete="given-name"
          onChange={updateField}
        />
        <TextField
          label="Achternaam"
          name="lastName"
          value={form.lastName}
          required
          autoComplete="family-name"
          onChange={updateField}
        />
        <TextField
          label="E-mail"
          name="email"
          type="email"
          value={form.email}
          required
          autoComplete="email"
          onChange={updateField}
        />
        <TextField
          label="Telefoon"
          name="phone"
          type="tel"
          value={form.phone}
          required
          autoComplete="tel"
          onChange={updateField}
        />
        <div className="sm:col-span-2 grid gap-4 sm:grid-cols-[1fr_7rem]">
          <TextField
            label="Straat"
            name="street"
            value={form.street}
            required
            autoComplete="street-address"
            onChange={updateField}
          />
          <TextField
            label="Nr."
            name="houseNumber"
            value={form.houseNumber}
            required
            autoComplete="off"
            onChange={updateField}
          />
        </div>
        <TextField
          label="Postcode"
          name="postalCode"
          value={form.postalCode}
          required
          autoComplete="postal-code"
          placeholder="1234 AB"
          onChange={updateField}
        />
        <TextField
          label="Woonplaats"
          name="city"
          value={form.city}
          required
          autoComplete="address-level2"
          onChange={updateField}
        />
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink/70">
          Opmerking
        </span>
        <textarea
          name="note"
          rows={3}
          value={form.note}
          onChange={(event) => updateField('note', event.target.value)}
          placeholder="Bijvoorbeeld voorkeur voor contactmoment…"
          className="w-full resize-y rounded-xl border border-mist bg-foam px-3 py-2.5 text-ink outline-none focus:border-teal"
        />
      </label>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-ink/80">
        <input
          type="checkbox"
          name="consentContact"
          checked={form.consentContact}
          required
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              consentContact: event.target.checked,
            }))
          }
          className="mt-0.5 size-4 shrink-0 rounded border-mist accent-teal"
        />
        <span>
          Ik geef hierbij toestemming aan AiroEnWarmte om contact met mij op te nemen over
          deze offerteaanvraag.
        </span>
      </label>

      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-mist bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-foam"
        >
          Annuleren
        </button>
        <button
          type="submit"
          disabled={submitting || !form.consentContact}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-5 py-3 text-sm font-semibold text-ink hover:bg-white disabled:opacity-60"
        >
          <Send className="size-4" aria-hidden />
          {submitting ? 'Versturen…' : 'Verzend Email'}
        </button>
      </div>
    </form>
  )
}
