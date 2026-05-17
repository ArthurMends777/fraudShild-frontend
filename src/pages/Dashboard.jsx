import { useState, useEffect } from 'react'
import { useApp } from '../context/useApp'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { ShieldCheck, AlertTriangle, Search, TrendingUp } from 'lucide-react'
import { dashboardService } from '../services/dashboardService'
import './Dashboard.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const resultLabel = {
  TRUE: 'Confiável',
  SUSPECT: 'Suspeito',
  FALSE: 'Alto Risco',
}

const resultClass = {
  TRUE: 'safe',
  SUSPECT: 'warning',
  FALSE: 'danger',
}

export default function Dashboard() {
  const { user, darkMode } = useApp()
  const [dashData, setDashData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    dashboardService.getDashboard()
      .then(setDashData)
      .catch(() => setError('Erro ao carregar dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  const textColor = darkMode ? '#F8FAFC' : '#1F2937'
  const gridColor = darkMode ? 'rgba(248,250,252,0.06)' : 'rgba(31,41,55,0.08)'

  const stats = dashData ? [
    { label: 'Total de análises', value: dashData.stats.total,      icon: Search,        color: '#00CAD5' },
    { label: 'Confiáveis',        value: dashData.stats.confiaveis,  icon: ShieldCheck,   color: '#22C55E' },
    { label: 'Suspeitos',         value: dashData.stats.suspeitos,   icon: AlertTriangle, color: '#F59E0B' },
    { label: 'Alto risco',        value: dashData.stats.altoRisco,   icon: TrendingUp,    color: '#EF4444' },
  ] : []

  // Gráfico de barras — byType do backend
  const byTypeLabels = dashData ? Object.keys(dashData.byType) : []
  const byTypeValues = dashData ? Object.values(dashData.byType) : []
  const barData = {
    labels: byTypeLabels,
    datasets: [{
      label: 'Detecções',
      data: byTypeValues,
      backgroundColor: [
        'rgba(0, 202, 213, 0.7)',
        'rgba(37, 99, 235, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(239, 68, 68, 0.7)',
        'rgba(34, 197, 94, 0.7)',
        'rgba(30, 58, 138, 0.7)',
      ],
      borderRadius: 8,
    }]
  }

  // Gráfico de rosca — stats
  const doughnutData = {
    labels: ['Confiável', 'Suspeito', 'Alto Risco'],
    datasets: [{
      data: dashData
        ? [dashData.stats.confiaveis, dashData.stats.suspeitos, dashData.stats.altoRisco]
        : [0, 0, 0],
      backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
      borderWidth: 0,
      cutout: '70%',
    }]
  }

  const byMonthEntries = dashData
    ? Object.entries(dashData.byMonth).sort(([a], [b]) => a.localeCompare(b))
    : []
  const lineLabels = byMonthEntries.map(([key]) => {
    const [year, month] = key.split('-')
    return new Date(year, month - 1).toLocaleString('pt-BR', { month: 'short' })
  })
  const lineValues = byMonthEntries.map(([, v]) => v)
  const lineData = {
    labels: lineLabels,
    datasets: [{
      label: 'Análises',
      data: lineValues,
      borderColor: '#00CAD5',
      backgroundColor: 'rgba(0, 202, 213, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#00CAD5',
      pointBorderColor: '#00CAD5',
      pointRadius: 4,
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: textColor, font: { family: 'Saira', size: 11 } }
      }
    },
    scales: {
      x: {
        ticks: { color: textColor, font: { family: 'Saira', size: 10 } },
        grid: { color: gridColor }
      },
      y: {
        ticks: { color: textColor, font: { family: 'Saira', size: 10 } },
        grid: { color: gridColor }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: textColor, font: { family: 'Saira', size: 11 }, padding: 16 }
      }
    }
  }

  if (loading) return <div className="dashboard"><p>Carregando...</p></div>
  if (error)   return <div className="dashboard"><p className="error-msg">{error}</p></div>

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Bem-vindo, {user?.name || 'Usuário'}!</p>
      </div>

      <div className="stats-grid">
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

      <div className="charts-row">
        <div className="chart-card wide">
          <h3>Tipos de golpes detectados</h3>
          <div className="chart-container">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Classificação de risco</h3>
          <div className="chart-container">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card full">
          <h3>Análises ao longo do tempo</h3>
          <div className="chart-container">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h3>Análises recentes</h3>
        {dashData.recentAnalyses.length === 0 ? (
          <div className="empty-state">
            <Search size={40} />
            <p>Nenhuma análise realizada ainda. Acesse a página de análise para começar!</p>
          </div>
        ) : (
          <div className="recent-list">
            {dashData.recentAnalyses.map(item => (
              <div key={item.id} className="recent-item">
                <div className={`risk-badge ${resultClass[item.result]}`}>
                  {resultLabel[item.result]}
                </div>
                <div className="recent-info">
                  <span className="recent-type">{item.type}</span>
                  <span className="recent-content">{item.content.substring(0, 80)}...</span>
                </div>
                <span className="recent-date">
                  {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
