import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { Modal } from '@/components/ui/modal'
import { useAuth } from '@/hooks/use-auth'
import { listOnderhoudOffertes } from '@/lib/api/onderhoud-offertes'
import { listOffertes } from '@/lib/api/offertes'
import {
  ADMIN_OFFERTES_PATH,
  ADMIN_ONDERHOUD_OFFERTES_PATH,
} from '@/lib/constants/nav-items'

type UnreadNotice = {
  id: 'airco' | 'onderhoud'
  title: string
  description: string
  action: string
  href: string
}

function countLabel(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural
}

function aircoNotice(count: number): UnreadNotice {
  const label = countLabel(count, 'nieuwe offerte-airco', "nieuwe offerte-airco's")
  return {
    id: 'airco',
    title: 'Nieuwe offerte-airco',
    description: `U heeft ${count} ${label} open staan. Check Offertes beheer.`,
    action: 'Naar offertes beheer',
    href: ADMIN_OFFERTES_PATH,
  }
}

function onderhoudNotice(count: number): UnreadNotice {
  const label = countLabel(
    count,
    'nieuwe onderhoud-offerte',
    'nieuwe onderhoud-offertes',
  )
  return {
    id: 'onderhoud',
    title: 'Nieuwe onderhoud-offerte',
    description: `U heeft ${count} ${label} open staan. Check Onderhoud-offerte.`,
    action: 'Naar onderhoud-offerte',
    href: ADMIN_ONDERHOUD_OFFERTES_PATH,
  }
}

export default function UnreadAanvragenAlert() {
  const { lastLoginAt, token, user } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [items, setItems] = useState<UnreadNotice[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (lastLoginAt == null || !token || !user?.isAdmin) {
      setIsOpen(false)
      setItems([])
      return
    }

    let cancelled = false
    let openTimer = 0

    void Promise.allSettled([
      queryClient.fetchQuery({
        queryKey: ['offertes'],
        queryFn: () => listOffertes(token),
      }),
      queryClient.fetchQuery({
        queryKey: ['onderhoud-offertes'],
        queryFn: () => listOnderhoudOffertes(token),
      }),
    ]).then(([aircoResult, onderhoudResult]) => {
      if (cancelled) return
      const next: UnreadNotice[] = []
      if (aircoResult.status === 'fulfilled') {
        const count = aircoResult.value.filter((row) => !row.read).length
        if (count > 0) next.push(aircoNotice(count))
      }
      if (onderhoudResult.status === 'fulfilled') {
        const count = onderhoudResult.value.filter((row) => !row.read).length
        if (count > 0) next.push(onderhoudNotice(count))
      }
      if (next.length === 0) return
      setItems(next)
      openTimer = window.setTimeout(() => {
        if (!cancelled) setIsOpen(true)
      }, 250)
    })

    return () => {
      cancelled = true
      window.clearTimeout(openTimer)
    }
  }, [lastLoginAt, token, user, queryClient])

  const close = () => setIsOpen(false)

  const goTo = (href: string) => {
    close()
    navigate(href)
  }

  return (
    <Modal
      title="Nieuwe aanvragen"
      description="Er staan ongelezen aanvragen open"
      isOpen={isOpen}
      onClose={close}
      className="max-w-md"
    >
      <div className="space-y-5 px-1 py-2">
        <div>
          <h2 className="font-display text-2xl text-ink">Nieuwe aanvragen</h2>
          <p className="mt-2 text-sm text-ink/70">
            Er staan ongelezen aanvragen open.
          </p>
        </div>
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-mist bg-white px-4 py-3"
            >
              <p className="text-sm font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-ink/70">{item.description}</p>
              <button
                type="button"
                onClick={() => goTo(item.href)}
                className="mt-3 rounded-xl bg-[#74b8f8] px-4 py-2 text-sm font-semibold text-ink transition hover:bg-[#5aa6ef]"
              >
                {item.action}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={close}
            className="rounded-xl border border-mist bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-foam"
          >
            Sluiten
          </button>
        </div>
      </div>
    </Modal>
  )
}
