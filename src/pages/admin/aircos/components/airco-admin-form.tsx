import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'

export type AircoFormValues = {
  brand: string
  series: string
  model: string
  tag: string
  description: string
  coolingKw: number
  heatingKw: number
  roomM2: string
  priceEur: number
}

type AircoAdminFormProps = {
  initialValues: AircoFormValues
  submitLabel: string
  onSubmit: (values: AircoFormValues) => void
  onCancel: () => void
}

const fieldClass =
  'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

export default function AircoAdminForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: AircoAdminFormProps) {
  const [values, setValues] = useState<AircoFormValues>(initialValues)

  const update = <K extends keyof AircoFormValues>(
    key: K,
    value: AircoFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit({
      ...values,
      brand: values.brand.trim(),
      series: values.series.trim(),
      model: values.model.trim(),
      tag: values.tag.trim(),
      description: values.description.trim(),
      roomM2: values.roomM2.trim(),
    })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold tracking-tight">{submitLabel}</h2>
        <p className="text-muted-foreground text-sm">
          Wijzigingen blijven lokaal tot create/update aan de API gekoppeld is.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="airco-brand" className="text-sm font-medium">
            Merk
          </label>
          <input
            id="airco-brand"
            required
            value={values.brand}
            onChange={(e) => update('brand', e.target.value)}
            className={fieldClass}
            placeholder="Haier"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="airco-series" className="text-sm font-medium">
            Serie
          </label>
          <input
            id="airco-series"
            required
            value={values.series}
            onChange={(e) => update('series', e.target.value)}
            className={fieldClass}
            placeholder="Pearl"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="airco-model" className="text-sm font-medium">
            Model
          </label>
          <input
            id="airco-model"
            required
            value={values.model}
            onChange={(e) => update('model', e.target.value)}
            className={fieldClass}
            placeholder="Wandmodel"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="airco-tag" className="text-sm font-medium">
            Tag
          </label>
          <input
            id="airco-tag"
            value={values.tag}
            onChange={(e) => update('tag', e.target.value)}
            className={fieldClass}
            placeholder="Populair"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="airco-cooling" className="text-sm font-medium">
            Koel vermogen (kW)
          </label>
          <input
            id="airco-cooling"
            type="number"
            min={0}
            step={0.1}
            required
            value={values.coolingKw}
            onChange={(e) => update('coolingKw', Number(e.target.value))}
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="airco-heating" className="text-sm font-medium">
            Verwarm vermogen (kW)
          </label>
          <input
            id="airco-heating"
            type="number"
            min={0}
            step={0.1}
            required
            value={values.heatingKw}
            onChange={(e) => update('heatingKw', Number(e.target.value))}
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="airco-room" className="text-sm font-medium">
            Ruimte
          </label>
          <input
            id="airco-room"
            value={values.roomM2}
            onChange={(e) => update('roomM2', e.target.value)}
            className={fieldClass}
            placeholder="tot 40 m²"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="airco-price" className="text-sm font-medium">
            Prijs (€)
          </label>
          <input
            id="airco-price"
            type="number"
            min={0}
            step={10}
            required
            value={values.priceEur}
            onChange={(e) => update('priceEur', Number(e.target.value))}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="airco-description" className="text-sm font-medium">
          Beschrijving
        </label>
        <textarea
          id="airco-description"
          rows={3}
          value={values.description}
          onChange={(e) => update('description', e.target.value)}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          placeholder="Korte productbeschrijving"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
