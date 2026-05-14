import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'
import AppLayout from '../components/AppLayout'
import Dashboard from '../pages/Dashboard'
import Analysis from '../pages/Analysis'
import Simulator from '../pages/Simulator'
import History from '../pages/History'
import Admin from '../pages/Admin'
import UsersPage from '../pages/UsersPage'
import Settings from '../pages/Settings'

function ProtectedRoute({ children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analise" element={<Analysis />} />
        <Route path="simulador" element={<Simulator />} />
        <Route path="historico" element={<History />} />
        <Route path="admin" element={<Admin />} />
        <Route path="usuarios" element={<UsersPage />} />
        <Route path="configuracoes" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}