import { useState, useEffect } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import { useApp } from '../context/useApp'
import { Users, Search, TrendingUp, AlertTriangle, Activity } from 'lucide-react'
import { adminService } from '../services/adminService'
import './Admin.css'

const resultLabel = { TRUE: 'Confiável', SUSPECT: 'Suspeito', FALSE: 'Alto Risco' }
const resultClass  = { TRUE: 'safe', SUSPECT: 'warning', FALSE: 'danger' }

export default function Admin() {
  const { darkMode } = useApp()
  const [dashData, setDashData] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    adminService.getStats()
      .then(setDashData)
      .catch(() => setError('Erro ao carregar painel admin.'))
      .finally(() => setLoading(false))
  }, [])

  const textColor = darkMode ? '#F8FAFC' : '#1F2937'
  const gridColor = darkMode ? 'rgba(248,250,252,0.06)' : 'rgba(31,41,55,0.08)'

  const stats = dashData ? [
    { label: 'Total de usuários',  value: dashData.stats.totalUsers,    icon: Users,         color: '#00CAD5' },
    { label: 'Análises hoje',      value: dashData.stats.analysesToday,  icon: Search,        color: '#2563EB' },
    { label: 'Golpes detectados',  value: dashData.stats.scamsDetected,  icon: AlertTriangle, color: '#EF4444' },
    { label: 'Taxa de detecção',   value: dashData.stats.detectionRate,  icon: TrendingUp,    color: '#22C55E' },
  ] : []

  const byTypeLabels = dashData ? dashData.byType.map(b => b.type) : []
  const byTypeValues = dashData ? dashData.byType.map(b => b._count.id) : []
  const threatData = {
    labels: byTypeLabels,
    datasets: [{
      label: 'Detecções',
      data: byTypeValues,
      backgroundColor: [
        'rgba(0, 202, 213, 0.7)',
        'rgba(37, 99, 235, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(239, 68, 68, 0.7)',
        'rgba(30, 58, 138, 0.7)',
        'rgba(34, 197, 94, 0.7)',
      ],
      borderRadius: 8,
    }]
  }

  const statusLabels = dashData ? dashData.userStatus.map(s => s.role) : []
  const statusValues = dashData ? dashData.userStatus.map(s => s._count.id) : []
  const statusData = {
    labels: statusLabels,
    datasets: [{
      data: statusValues,
      backgroundColor: ['#22C55E', '#F59E0B', '#EF4444', '#2563EB'],
      borderWidth: 0,
      cutout: '70%',
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textColor, font: { family: 'Saira', size: 11 } } } },
    scales: {
      x: { ticks: { color: textColor, font: { family: 'Saira', size: 10 } }, grid: { color: gridColor } },
      y: { ticks: { color: textColor, font: { family: 'Saira', size: 10 } }, grid: { color: gridColor } }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Saira', size: 11 }, padding: 16 } } }
  }

  if (loading) return <div className="admin-page"><p>Carregando...</p></div>
  if (error)   return <div className="admin-page"><p className="error-msg">{error}</p></div>

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Administração</h1>
        <p>Painel de monitoramento do sistema</p>
      </div>

      <div className="admin-stats">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-icon" style={{ background: `${s.color}15`, color: s.color }}>
              <s.icon size={22} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">{s.value}</span>
              <span className="stat-card-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-charts">
        <div className="chart-card wide">
          <h3>Detecções por tipo</h3>
          <div className="chart-container">
            <Bar data={threatData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Usuários por função</h3>
          <div className="chart-container">
            <Doughnut data={statusData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="admin-activity">
        <h3><Activity size={18} /> Atividade recente</h3>
        <div className="activity-list">
          {dashData.recentActivity.map(item => (
            <div key={item.id} className="activity-item">
              <div className="activity-avatar">{item.user.name.charAt(0)}</div>
              <div className="activity-info">
                <span className="activity-user">{item.user.name}</span>
                <span className="activity-action">
                  Análise de <strong>{item.type}</strong> —{' '}
                  <span className={resultClass[item.result]}>{resultLabel[item.result]}</span>
                </span>
              </div>
              <span className="activity-time">
                {new Date(item.createdAt).toLocaleString('pt-BR', {
                  day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
