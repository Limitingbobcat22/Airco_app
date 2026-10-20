import { Search } from 'lucide-react'

type AdminTableSearchProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export function AdminTableSearch({
  value,
  onChange,
  placeholder,
}: AdminTableSearchProps) {
  return (
    <label className="relative block w-full">
      <span className="sr-only">Zoeken</span>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink/40" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-mist bg-white py-2.5 pr-3 pl-9 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-teal"
      />
    </label>
  )
}

export function searchEmptyMessage(search: string, emptyMessage: string) {
  const term = search.trim()
  if (!term) return emptyMessage
  return `Geen resultaten voor "${term}".`
}
