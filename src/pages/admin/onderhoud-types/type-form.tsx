import { useEffect, useState, type FormEvent } from 'react'
import type { OnderhoudType } from '@/lib/api/onderhoud-types'
import { cn } from '@/lib/utils'

export type OnderhoudTypeFormValues = {
  name: string
  description: string
  sortOrder: number
}

type OnderhoudTypeFormProps = {
  initial?: OnderhoudType | null
  nextSortOrder: number
  submitting?: boolean
  error?: string | null
  onSubmit: (data: OnderhoudTypeFormValues) => void
  onDirtyChange?: (dirty: boolean) => void
  onCancel: () => void
}

function toFormValues(
  type: OnderhoudType | null | undefined,
  nextSortOrder: number,
): OnderhoudTypeFormValues {
  if (!type) {
    return { name: '', description: '', sortOrder: nextSortOrder }
  }
  return {
    name: type.name,
    description: type.description ?? '',
    sortOrder: type.sortOrder,
  }
}

export default function OnderhoudTypeForm({
  initial,
  nextSortOrder,
  submitting = false,
  error,
  onSubmit,
  onDirtyChange,
  onCancel,
}: OnderhoudTypeFormProps) {
  const isEdit = Boolean(initial)
  const [form, setForm] = useState(() => toFormValues(initial, nextSortOrder))
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; sortOrder?: string }>({})

  useEffect(() => {
    setForm(toFormValues(initial, nextSortOrder))
  }, [initial, nextSortOrder])

  useEffect(() => {
    const baseline = toFormValues(initial, nextSortOrder)
    const dirty =
      form.name !== baseline.name ||
      form.description !== baseline.description ||
      form.sortOrder !== baseline.sortOrder
    onDirtyChange?.(dirty)
    return () => onDirtyChange?.(false)
  }, [form, initial, nextSortOrder, onDirtyChange])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: { name?: string; sortOrder?: string } = {}
    if (!form.name.trim()) nextErrors.name = 'Naam is verplicht.'
    if (!Number.isInteger(form.sortOrder) || form.sortOrder < 0) {
      nextErrors.sortOrder = 'Volgorde moet 0 of hoger zijn.'
    }
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      sortOrder: form.sortOrder,
    })
  }

  return (
    <form className="space-y-5 py-2 pb-4" noValidate onSubmit={handleSubmit}>
      <div>
        <p className="text-xs font-medium tracking-[0.2em] text-[#74b8f8] uppercase">
          {isEdit ? 'Type bewerken' : 'Type toevoegen'}
        </p>
        <p className="mt-2 text-sm text-ink/70">
          Elke regel in de beschrijving wordt een handeling in de info-popup.
        </p>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink/70">Naam</span>
        {fieldErrors.name ? (
          <p className="mb-2 text-sm text-destructive">{fieldErrors.name}</p>
        ) : null}
        <input
          value={form.name}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, name: event.target.value }))
          }
          className={cn(
            'w-full rounded-xl border bg-foam px-3 py-2.5 text-ink outline-none',
            fieldErrors.name
              ? 'border-destructive'
              : 'border-mist focus:border-teal',
          )}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink/70">
          Volgorde
        </span>
        {fieldErrors.sortOrder ? (
          <p className="mb-2 text-sm text-destructive">{fieldErrors.sortOrder}</p>
        ) : null}
        <input
          type="number"
          min={0}
          value={form.sortOrder}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              sortOrder: Number(event.target.value),
            }))
          }
          className={cn(
            'w-28 rounded-xl border bg-foam px-3 py-2.5 text-ink outline-none',
            fieldErrors.sortOrder
              ? 'border-destructive'
              : 'border-mist focus:border-teal',
          )}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink/70">
          Handelingen
        </span>
        <textarea
          rows={8}
          value={form.description}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, description: event.target.value }))
          }
          placeholder={'Eén handeling per regel'}
          className="w-full resize-y rounded-xl border border-mist bg-foam px-3 py-2.5 text-ink outline-none focus:border-teal"
        />
      </label>

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
          className="rounded-xl bg-[#74b8f8] px-5 py-3 text-sm font-semibold text-ink hover:bg-[#5aa6ef] disabled:opacity-60"
        >
          {submitting ? 'Opslaan…' : 'Opslaan'}
        </button>
      </div>
    </form>
  )
}
