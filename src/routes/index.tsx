import AppLayout from '@/components/layout/app-layout'
import HomePage from '@/pages/home'
import { Outlet, useRoutes } from 'react-router'

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
          element: <HomePage />,
        },
      ],
    },
  ])
}
