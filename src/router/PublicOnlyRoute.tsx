import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getToken } from '../auth'

export default function PublicOnlyRoute() {
  const { user } = useAuth()
  const token = getToken()
  return token ? <Navigate to="/chatroom" replace /> : <Outlet />
}