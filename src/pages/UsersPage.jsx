import { useState, useEffect, useCallback } from 'react'
import { Search, MoreVertical, Shield, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { adminService } from '../services/adminService'
import { UserAvatar } from '../components/Sidebar'
import './UsersPage.css'

const ROLES = ['user', 'admin', 'moderador']

export default function UsersPage() {
  const [users, setUsers]           = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [page, setPage]             = useState(1)
  const [openMenu, setOpenMenu]     = useState(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminService.getUsers({ search: searchTerm || undefined, role: filterRole, page, limit: 10 })
      setUsers(data.users)
      setPagination(data.pagination)
    } catch {
      setError('Erro ao carregar usuários.')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filterRole, page])

  useEffect(() => { setPage(1) }, [searchTerm, filterRole])
  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleRoleChange = async (userId, role) => {
    try {
      await adminService.updateUserRole(userId, role)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
    } catch {
      alert('Erro ao atualizar função.')
    }
    setOpenMenu(null)
  }

  const handleDelete = async (userId) => {
    if (!confirm('Tem certeza que deseja remover este usuário?')) return
    try {
      await adminService.deleteUser(userId)
      setUsers(prev => prev.filter(u => u.id !== userId))
      setPagination(prev => ({ ...prev, total: prev.total - 1 }))
    } catch {
      alert('Erro ao remover usuário.')
    }
    setOpenMenu(null)
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':     return 'role-badge admin'
      case 'moderador': return 'role-badge moderador'
      default:          return 'role-badge'
    }
  }

  return (
    <div className="users-page" onClick={() => setOpenMenu(null)}>
      <div className="page-header">
        <h1>Usuários</h1>
        <p>Gerenciamento de usuários do sistema</p>
      </div>

      <div className="users-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar usuário..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="users-filter">
          <option value="all">Todas as funções</option>
          <option value="user">Usuário</option>
          <option value="moderador">Moderador</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className="error-msg">{error}</p>
      ) : (
        <>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Função</th>
                  <th>Análises</th>
                  <th>Cadastro</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <UserAvatar user={user} size={34} className="user-cell-avatar" />
                        <div className="user-cell-info">
                          <span className="user-cell-name">{user.name}</span>
                          <span className="user-cell-email">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className={getRoleBadgeClass(user.role)}>{user.role}</span></td>
                    <td className="analyses-count">{user._count.analyses}</td>
                    <td className="join-date">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="action-menu-wrapper">
                        <button className="btn-more" onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}>
                          <MoreVertical size={16} />
                        </button>
                        {openMenu === user.id && (
                          <div className="action-menu">
                            <p className="action-menu-title">Alterar função</p>
                            {ROLES.filter(r => r !== user.role).map(role => (
                              <button key={role} className="action-menu-item" onClick={() => handleRoleChange(user.id, role)}>
                                <Shield size={14} /> Tornar {role}
                              </button>
                            ))}
                            <hr />
                            <button className="action-menu-item danger" onClick={() => handleDelete(user.id)}>
                              <Trash2 size={14} /> Remover usuário
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                <ChevronLeft size={16} /> Anterior
              </button>
              <span className="pagination-info">Página {pagination.page} de {pagination.pages}</span>
              <button className="pagination-btn" onClick={() => setPage(p => p + 1)} disabled={page === pagination.pages}>
                Próxima <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
