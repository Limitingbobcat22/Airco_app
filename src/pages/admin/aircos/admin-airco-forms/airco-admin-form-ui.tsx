import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const identityClass =
  'w-full rounded-xl border border-mist bg-foam px-3 py-2.5 text-ink outline-none placeholder:text-ink/35 focus:border-teal'
export const specClass =
  'w-full min-w-0 rounded-lg border border-mist bg-white px-2.5 py-1.5 text-left text-sm font-medium text-ink outline-none placeholder:text-ink/35 focus:border-teal'
export const selectClass =
  'w-full min-w-0 rounded-lg border border-mist bg-white px-2 py-1.5 text-left text-sm font-medium text-ink outline-none focus:border-teal'

export function SpecField({
  label,
  htmlFor,
  striped,
  children,
}: {
  label: string
  htmlFor?: string
  striped?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-3 py-2 text-sm',
        striped ? 'bg-foam/80' : 'bg-white',
      )}
    >
      <label htmlFor={htmlFor} className="shrink-0 text-ink/55">
        {label}
      </label>
      <div className="min-w-0 max-w-[18rem] flex-1">{children}</div>
    </div>
  )
}
