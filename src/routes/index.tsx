import AppLayout from '@/components/layout/app-layout'
import AircoPage from '@/pages/airco'
import KetelPage from '@/pages/ketel'
import {
  AIRCO_TOPIC,
  defaultSectionForTopic,
  KETEL_TOPIC,
  topicSectionPath,
} from '@/lib/topics'
import { Navigate, Outlet, useRoutes } from 'react-router'

const aircoStart = topicSectionPath(
  AIRCO_TOPIC,
  defaultSectionForTopic(AIRCO_TOPIC),
)
const ketelStart = topicSectionPath(
  KETEL_TOPIC,
  defaultSectionForTopic(KETEL_TOPIC),
)

export default function AppRouter() {
  return useRoutes([
    {
      path: '/',
      element: (
        <AppLayout>
          <Outlet />
        </AppLayout>
      ),
      children: [
        {
          index: true,
          element: <Navigate to={aircoStart} replace />,
        },
        {
          path: 'airco',
          element: <Navigate to={aircoStart} replace />,
        },
        {
          path: 'airco/:section',
          element: <AircoPage />,
        },
        {
          path: 'ketel',
          element: <Navigate to={ketelStart} replace />,
        },
        {
          path: 'ketel/:section',
          element: <KetelPage />,
        },
      ],
    },
  ])
}
