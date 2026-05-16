import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { BASE_URL } from '../services/api'
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
  { path: '/app/dashboard',     icon: LayoutDashboard, label: 'Dashboard',    adminOnly: false },
  { path: '/app/analise',       icon: Search,          label: 'Analise',      adminOnly: false },
  { path: '/app/simulador',     icon: Gamepad2,        label: 'Simulador',    adminOnly: false },
  { path: '/app/historico',     icon: History,         label: 'Historico',    adminOnly: false },
  { path: '/app/admin',         icon: ShieldCheck,     label: 'Administracao',adminOnly: true  },
  { path: '/app/usuarios',      icon: Users,           label: 'Usuarios',     adminOnly: true  },
  { path: '/app/configuracoes', icon: Settings,        label: 'Configuracoes',adminOnly: false },
]

function UserAvatar({ user, size = 36, className = 'user-avatar' }) {
  const avatarSrc = user?.profileImage
    ? user.profileImage.startsWith('http')
      ? user.profileImage
      : `${BASE_URL}${user.profileImage}`
    : null

  if (avatarSrc) {
    return (
      <img
        src={avatarSrc}
        alt={user.name}
        className={`${className} ${className}-img`}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
      />
    )
  }
  return (
    <div className={className} style={{ width: size, height: size }}>
      {user?.name?.charAt(0).toUpperCase()}
    </div>
  )
}

export { UserAvatar }

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout, darkMode, toggleDarkMode } = useApp()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'
  const visibleItems = navItems.filter(item => !item.adminOnly || isAdmin)

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

      {user && (
        <div className={`sidebar-user ${collapsed ? 'collapsed' : ''}`}>
          <UserAvatar user={user} size={36} />
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
              {isAdmin && <span className="user-role-badge">Admin</span>}
            </div>
          )}
        </div>
      )}

      <nav className="sidebar-nav">
        {visibleItems.map(item => (
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
