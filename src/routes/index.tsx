import { createBrowserRouter, RouteObject } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import ProfilePage from '../pages/ProfilePage'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
]

const router = createBrowserRouter(routes)

export default router
