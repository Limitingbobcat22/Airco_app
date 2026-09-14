import { useEffect, useState, type FormEvent } from 'react'
import type { Handleiding } from '@/lib/api/handleidingen'
import { cn } from '@/lib/utils'

export type HandleidingFormValues = {
  title: string
  description: string
  file: File | null
}

type HandleidingFormProps = {
  initial?: Handleiding | null
  submitting?: boolean
  error?: string | null
  onSubmit: (data: HandleidingFormValues) => void
  onDirtyChange?: (dirty: boolean) => void
  onCancel: () => void
}

function toFormValues(handleiding?: Handleiding | null): HandleidingFormValues {
  if (!handleiding) {
    return { title: '', description: '', file: null }
  }
  return {
    title: handleiding.title,
    description: handleiding.description ?? '',
    file: null,
  }
}

export default function HandleidingForm({
  initial,
  submitting = false,
  error,
  onSubmit,
  onDirtyChange,
  onCancel,
}: HandleidingFormProps) {
  const isEdit = Boolean(initial)
  const [form, setForm] = useState<HandleidingFormValues>(() =>
    toFormValues(initial),
  )
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string
    file?: string
  }>({})

  useEffect(() => {
    setForm(toFormValues(initial))
  }, [initial])

  useEffect(() => {
    const baseline = toFormValues(initial)
    const dirty =
      form.title !== baseline.title ||
      form.description !== baseline.description ||
      form.file != null
    onDirtyChange?.(dirty)
    return () => onDirtyChange?.(false)
  }, [form, initial, onDirtyChange])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: { title?: string; file?: string } = {}
    if (!form.title.trim()) nextErrors.title = 'Titel is verplicht.'
    if (!isEdit && !form.file) nextErrors.file = 'Kies een PDF-bestand.'
    if (form.file && form.file.type !== 'application/pdf') {
      nextErrors.file = 'Alleen PDF-bestanden zijn toegestaan.'
    }
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit(form)
  }

  return (
    <form className="space-y-5 py-2 pb-4" noValidate onSubmit={handleSubmit}>
      <div>
        <p className="text-xs font-medium tracking-[0.1em] text-ink/45 uppercase">
          {isEdit ? 'Handleiding bewerken' : 'Handleiding toevoegen'}
        </p>
        <h3 className="mt-1 font-display text-2xl text-ink">
          {form.title.trim() || (isEdit ? 'Handleiding' : 'Nieuwe PDF')}
        </h3>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink/70">
          Titel<span className="text-teal"> *</span>
        </span>
        {fieldErrors.title ? (
          <p className="mb-2 text-sm text-destructive">{fieldErrors.title}</p>
        ) : null}
        <input
          type="text"
          name="title"
          value={form.title}
          maxLength={160}
          placeholder="bijv. Gebruikershandleiding Haier"
          onChange={(event) => {
            setForm((prev) => ({ ...prev, title: event.target.value }))
            setFieldErrors((prev) => {
              if (!prev.title) return prev
              const next = { ...prev }
              delete next.title
              return next
            })
          }}
          className={cn(
            'w-full rounded-xl border bg-foam px-3 py-2.5 text-ink outline-none',
            'focus:border-teal focus:ring-2 focus:ring-teal/20',
            fieldErrors.title ? 'border-destructive' : 'border-mist',
          )}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink/70">
          Beschrijving
        </span>
        <textarea
          name="description"
          value={form.description}
          maxLength={2000}
          rows={3}
          placeholder="Optionele toelichting voor klanten"
          onChange={(event) =>
            setForm((prev) => ({ ...prev, description: event.target.value }))
          }
          className="w-full resize-y rounded-xl border border-mist bg-foam px-3 py-2.5 text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink/70">
          PDF-bestand
          {!isEdit ? <span className="text-teal"> *</span> : null}
        </span>
        {fieldErrors.file ? (
          <p className="mb-2 text-sm text-destructive">{fieldErrors.file}</p>
        ) : null}
        {isEdit && !form.file ? (
          <p className="mb-2 text-xs text-ink/55">
            Huidig bestand: {initial?.originalFilename}. Laat leeg om te
            behouden.
          </p>
        ) : null}
        <input
          type="file"
          accept="application/pdf,.pdf"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null
            setForm((prev) => ({ ...prev, file }))
            setFieldErrors((prev) => {
              if (!prev.file) return prev
              const next = { ...prev }
              delete next.file
              return next
            })
          }}
          className={cn(
            'block w-full text-sm text-ink/80 file:mr-3 file:rounded-lg file:border-0 file:bg-deep file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-teal',
            fieldErrors.file ? 'text-destructive' : '',
          )}
        />
        {form.file ? (
          <p className="mt-2 text-xs text-ink/55">{form.file.name}</p>
        ) : null}
      </label>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-mist bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-foam disabled:opacity-60"
        >
          Annuleren
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-deep px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal disabled:opacity-60"
        >
          {submitting
            ? isEdit
              ? 'Opslaan…'
              : 'Uploaden…'
            : isEdit
              ? 'Opslaan'
              : 'Uploaden'}
        </button>
      </div>
    </form>
  )
}
