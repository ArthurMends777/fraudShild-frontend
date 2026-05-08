import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  LayoutDashboard,
  Search,
  Gamepad2,
  History,
  ShieldCheck,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react'
import './Sidebar.css'

const navItems = [
  { path: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/app/analise', icon: Search, label: 'Analise' },
  { path: '/app/simulador', icon: Gamepad2, label: 'Simulador' },
  { path: '/app/historico', icon: History, label: 'Historico' },
  { path: '/app/admin', icon: ShieldCheck, label: 'Administracao' },
  { path: '/app/usuarios', icon: Users, label: 'Usuarios' },
  { path: '/app/configuracoes', icon: Settings, label: 'Configuracoes' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout, darkMode, toggleDarkMode } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <ShieldCheck size={28} className="logo-icon" />
          {!collapsed && <span className="logo-text">FraudShield</span>}
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {!collapsed && user && (
        <div className="sidebar-user">
          <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleDarkMode} title={darkMode ? 'Modo Claro' : 'Modo Escuro'}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          {!collapsed && <span>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>}
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  )
}
