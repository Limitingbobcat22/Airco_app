import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router'
import { Modal } from '@/components/ui/modal'

type UnsavedChangesContextValue = {
  setDirty: (dirty: boolean) => void
  /** true = direct navigeren; false = bevestiging geopend */
  requestNavigation: (href: string, destinationLabel: string) => boolean
}

const UnsavedChangesContext =
  createContext<UnsavedChangesContextValue | null>(null)

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [dirty, setDirty] = useState(false)
  const [pending, setPending] = useState<{
    href: string
    label: string
  } | null>(null)

  const requestNavigation = useCallback(
    (href: string, destinationLabel: string) => {
      if (!dirty) return true
      setPending({ href, label: destinationLabel })
      return false
    },
    [dirty],
  )

  const confirmLeave = () => {
    if (!pending) return
    const { href } = pending
    setPending(null)
    setDirty(false)
    navigate(href)
  }

  const cancelLeave = () => setPending(null)

  const value = useMemo(
    () => ({ setDirty, requestNavigation }),
    [requestNavigation],
  )

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
      <Modal
        isOpen={pending != null}
        onClose={cancelLeave}
        title="Niet-opgeslagen wijzigingen"
        description="Bevestig of u wilt weggaan"
        className="max-w-md"
      >
        <div className="space-y-5 px-1 py-2">
          <div>
            <h2 className="font-display text-2xl text-ink">Wijzigingen kwijt?</h2>
            <p className="mt-2 text-sm text-ink/70">
              U heeft aanpassingen gedaan. Weet u zeker dat u naar{' '}
              <span className="font-semibold text-ink">
                {pending?.label ?? '…'}
              </span>{' '}
              wilt navigeren? Niet-opgeslagen wijzigingen gaan verloren.
            </p>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={cancelLeave}
              className="rounded-xl border border-mist bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-foam"
            >
              Annuleren
            </button>
            <button
              type="button"
              onClick={confirmLeave}
              className="rounded-xl bg-deep px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal"
            >
              Naar {pending?.label ?? '…'}
            </button>
          </div>
        </div>
      </Modal>
    </UnsavedChangesContext.Provider>
  )
}

export function useUnsavedChanges() {
  const ctx = useContext(UnsavedChangesContext)
  if (!ctx) {
    throw new Error('useUnsavedChanges must be used within UnsavedChangesProvider')
  }
  return ctx
}
