import { cn } from '@/lib/utils'
import type { KlantNawData } from '../types'

type NawTextFieldProps = {
  label: string
  name: keyof KlantNawData
  type?: string
  value: string
  required?: boolean
  autoComplete?: string
  placeholder?: string
  error?: string
  onChange: (name: keyof KlantNawData, value: string) => void
}

export function NawTextField({
  label,
  name,
  type = 'text',
  value,
  required,
  autoComplete,
  placeholder,
  error,
  onChange,
}: NawTextFieldProps) {
  const errorId = `${String(name)}-error`

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink/70">
        {label}
        {required ? <span className="text-teal"> *</span> : null}
      </span>
      {error ? (
        <p id={errorId} className="mb-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <input
        type={type}
        name={name}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(name, event.target.value)}
        className={cn(
          'w-full rounded-xl border bg-foam px-3 py-2.5 text-ink outline-none',
          error
            ? 'border-destructive focus:border-destructive'
            : 'border-mist focus:border-teal',
        )}
      />
    </label>
  )
}
