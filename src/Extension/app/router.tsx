import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage/HomePage'
import SettingsPage from '../pages/SettingsPage/SettingsPage'
import Layout from '../widgets/Layout';


const router = createBrowserRouter([
  {
    path: 'index.html/',
    element: <Layout/>,
    children: [
      {
        index: true,
        element: <HomePage/>,
      },
      {
        path: 'settings',
        element: <SettingsPage/>,
      }
    ]
  }
])

export default router;