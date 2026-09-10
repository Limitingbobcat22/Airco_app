import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { Modal } from '@/components/ui/modal'
import { useAuth } from '@/hooks/use-auth'
import { listOffertes } from '@/lib/api/offertes'
import { ADMIN_OFFERTES_PATH } from '@/lib/constants/nav-items'

export default function UnreadOffertesAlert() {
  const { lastLoginAt, token, user } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (lastLoginAt == null || !token || !user?.isAdmin) {
      setIsOpen(false)
      setUnreadCount(0)
      return
    }

    let cancelled = false
    let openTimer = 0

    void queryClient
      .fetchQuery({
        queryKey: ['offertes'],
        queryFn: () => listOffertes(token),
      })
      .then((offertes) => {
        if (cancelled) return
        const count = offertes.filter((row) => !row.read).length
        if (count > 0) {
          setUnreadCount(count)
          openTimer = window.setTimeout(() => {
            if (!cancelled) setIsOpen(true)
          }, 250)
        }
      })
      .catch(() => {
        // Inloggen is gelukt; geen extra foutmelding tonen.
      })

    return () => {
      cancelled = true
      window.clearTimeout(openTimer)
    }
  }, [lastLoginAt, token, user, queryClient])

  const close = () => setIsOpen(false)

  const goToOffertes = () => {
    close()
    navigate(ADMIN_OFFERTES_PATH)
  }

  const offerteLabel = unreadCount === 1 ? 'nieuwe offerte' : 'nieuwe offertes'

  return (
    <Modal
      title="Nieuwe offertes"
      description="Er staan ongelezen offertes open"
      isOpen={isOpen}
      onClose={close}
      className="max-w-md"
    >
      <div className="space-y-5 px-1 py-2">
        <div>
          <h2 className="font-display text-2xl text-ink">Nieuwe offertes</h2>
          <p className="mt-2 text-sm text-ink/70">
            U heeft {unreadCount} {offerteLabel} open staan. Check Offertes
            beheer.
          </p>
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={close}
            className="rounded-xl border border-mist bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-foam"
          >
            Sluiten
          </button>
          <button
            type="button"
            onClick={goToOffertes}
            className="rounded-xl bg-deep px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal"
          >
            Naar offertes beheer
          </button>
        </div>
      </div>
    </Modal>
  )
}
