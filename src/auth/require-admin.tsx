import { Navigate, useLocation } from 'react-router'
import { useAuth } from '@/hooks/use-auth'
import {
  AIRCO_TOPIC,
  defaultSectionForTopic,
  topicSectionPath,
} from '@/lib/topics'

/** Alleen ingelogde admins mogen ketel-routes zien. */
export default function RequireAdmin({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoggedIn, user } = useAuth()
  const location = useLocation()
  const isAdmin = isLoggedIn && Boolean(user?.isAdmin)

  if (!isAdmin) {
    return (
      <Navigate
        to={topicSectionPath(AIRCO_TOPIC, defaultSectionForTopic(AIRCO_TOPIC))}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return children
}
