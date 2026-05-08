import { useState } from 'react'
import { Search, MoreVertical, UserPlus, Shield, Ban, CheckCircle } from 'lucide-react'
import './UsersPage.css'

const mockUsers = [
  { id: 1, name: 'Maria Silva', email: 'maria@email.com', role: 'Admin', status: 'active', analyses: 47, joined: '2024-01-15' },
  { id: 2, name: 'Joao Santos', email: 'joao@email.com', role: 'Usuario', status: 'active', analyses: 23, joined: '2024-02-20' },
  { id: 3, name: 'Ana Oliveira', email: 'ana@email.com', role: 'Usuario', status: 'active', analyses: 56, joined: '2024-01-08' },
  { id: 4, name: 'Carlos Lima', email: 'carlos@email.com', role: 'Moderador', status: 'inactive', analyses: 12, joined: '2024-03-10' },
  { id: 5, name: 'Fernanda Costa', email: 'fernanda@email.com', role: 'Usuario', status: 'active', analyses: 34, joined: '2024-02-28' },
  { id: 6, name: 'Ricardo Alves', email: 'ricardo@email.com', role: 'Usuario', status: 'blocked', analyses: 0, joined: '2024-04-05' },
  { id: 7, name: 'Juliana Mendes', email: 'juliana@email.com', role: 'Usuario', status: 'active', analyses: 18, joined: '2024-03-22' },
  { id: 8, name: 'Pedro Souza', email: 'pedro@email.com', role: 'Moderador', status: 'active', analyses: 91, joined: '2024-01-03' },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = mockUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="status-badge active"><CheckCircle size={12} /> Ativo</span>
      case 'inactive': return <span className="status-badge inactive"><Ban size={12} /> Inativo</span>
      case 'blocked': return <span className="status-badge blocked"><Shield size={12} /> Bloqueado</span>
      default: return null
    }
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Usuarios</h1>
        <p>Gerenciamento de usuarios do sistema</p>
      </div>

      <div className="users-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="users-filter">
          <option value="all">Todos</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
          <option value="blocked">Bloqueados</option>
        </select>

        <button className="btn-add-user">
          <UserPlus size={16} />
          Novo usuario
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Funcao</th>
              <th>Status</th>
              <th>Analises</th>
              <th>Cadastro</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-cell-avatar">{user.name.charAt(0)}</div>
                    <div className="user-cell-info">
                      <span className="user-cell-name">{user.name}</span>
                      <span className="user-cell-email">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td><span className="role-badge">{user.role}</span></td>
                <td>{getStatusBadge(user.status)}</td>
                <td className="analyses-count">{user.analyses}</td>
                <td className="join-date">{new Date(user.joined).toLocaleDateString('pt-BR')}</td>
                <td>
                  <button className="btn-more"><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
