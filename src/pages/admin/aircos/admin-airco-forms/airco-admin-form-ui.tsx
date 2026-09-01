import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const identityClass =
  'w-full rounded-xl border border-mist bg-foam px-3 py-2.5 text-ink outline-none placeholder:text-ink/35 focus:border-teal'
export const specClass =
  'w-full min-w-0 rounded-lg border border-mist bg-white px-2.5 py-1.5 text-left text-sm font-medium text-ink outline-none placeholder:text-ink/35 focus:border-teal'
export const selectClass =
  'w-full min-w-0 rounded-lg border border-mist bg-white px-2 py-1.5 text-left text-sm font-medium text-ink outline-none focus:border-teal'

export function withFieldError(baseClass: string, error?: string) {
  return cn(
    baseClass,
    error && 'border-destructive focus:border-destructive',
  )
}

export function FieldError({ error }: { error?: string }) {
  if (!error) return null
  return <p className="mb-1.5 text-sm text-destructive">{error}</p>
}

export function IdentityField({
  id,
  label,
  value,
  error,
  placeholder,
  className,
  onChange,
}: {
  id: string
  label: string
  value: string
  error?: string
  placeholder?: string
  className?: string
  onChange: (value: string) => void
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <FieldError error={error} />
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={withFieldError(identityClass, error)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
      />
    </div>
  )
}

export function SpecField({
  label,
  htmlFor,
  striped,
  error,
  children,
}: {
  label: string
  htmlFor?: string
  striped?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex justify-between gap-4 px-3 py-2 text-sm',
        error ? 'items-start' : 'items-center',
        striped ? 'bg-foam/80' : 'bg-white',
      )}
    >
      <label
        htmlFor={htmlFor}
        className={cn('shrink-0 text-ink/55', error && 'pt-0.5')}
      >
        {label}
      </label>
      <div className="min-w-0 max-w-[18rem] flex-1">
        <FieldError error={error} />
        {children}
      </div>
    </div>
  )
}
