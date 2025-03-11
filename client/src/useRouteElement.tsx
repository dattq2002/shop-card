import { useRoutes } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/login'
import SideBarLayout from './layouts/sidebar_layout'
import Contact from './pages/contact'
import Account from './pages/account/Account'
import Card from './pages/card'
import Promotion from './pages/promotion'

export default function useRouteElement() {
  const routeElement = useRoutes([
    {
      path: '/',
      element: (
        <SideBarLayout>
          <Contact />
        </SideBarLayout>
      )
    },
    {
      path: '/account',
      element: (
        <SideBarLayout>
          <Account />
        </SideBarLayout>
      )
    },
    {
      path: '/promotion',
      element: (
        <SideBarLayout>
          <Promotion />
        </SideBarLayout>
      )
    },
    {
      path: '/card',
      element: (
        <SideBarLayout>
          <Card />
        </SideBarLayout>
      )
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/login',
      element: <Login />
    }
  ])
  return routeElement
}
