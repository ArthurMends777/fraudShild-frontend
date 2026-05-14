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

export default function Dashboard() {
  const { user, analysisHistory, darkMode } = useApp()

  const totalAnalyses = analysisHistory.length
  const safeCount = analysisHistory.filter(a => a.risk === 'safe').length
  const warningCount = analysisHistory.filter(a => a.risk === 'warning').length
  const dangerCount = analysisHistory.filter(a => a.risk === 'danger').length

  const textColor = darkMode ? '#F8FAFC' : '#1F2937'
  const gridColor = darkMode ? 'rgba(248,250,252,0.06)' : 'rgba(31,41,55,0.08)'

  const stats = [
    { label: 'Total de analises', value: totalAnalyses, icon: Search, color: '#00CAD5' },
    { label: 'Confiaveis', value: safeCount, icon: ShieldCheck, color: '#22C55E' },
    { label: 'Suspeitos', value: warningCount, icon: AlertTriangle, color: '#F59E0B' },
    { label: 'Alto risco', value: dangerCount, icon: TrendingUp, color: '#EF4444' },
  ]

  const barData = {
    labels: ['Phishing', 'Fake News', 'Golpe PIX', 'Fraude', 'Spam', 'Malware'],
    datasets: [{
      label: 'Deteccoes',
      data: [23, 35, 18, 12, 28, 8],
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

  const doughnutData = {
    labels: ['Confiavel', 'Suspeito', 'Alto Risco'],
    datasets: [{
      data: [safeCount || 45, warningCount || 30, dangerCount || 25],
      backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
      borderWidth: 0,
      cutout: '70%',
    }]
  }

  const lineData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [{
      label: 'Analises',
      data: [120, 190, 150, 280, 220, 350],
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

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Bem-vindo, {user?.name || 'Usuario'}!</p>
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
          <h3>Classificacao de risco</h3>
          <div className="chart-container">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card full">
          <h3>Analises ao longo do tempo</h3>
          <div className="chart-container">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h3>Analises recentes</h3>
        {analysisHistory.length === 0 ? (
          <div className="empty-state">
            <Search size={40} />
            <p>Nenhuma analise realizada ainda. Acesse a pagina de analise para comecar!</p>
          </div>
        ) : (
          <div className="recent-list">
            {analysisHistory.slice(0, 5).map(item => (
              <div key={item.id} className="recent-item">
                <div className={`risk-badge ${item.risk}`}>
                  {item.risk === 'safe' ? 'Confiavel' : item.risk === 'warning' ? 'Suspeito' : 'Alto Risco'}
                </div>
                <div className="recent-info">
                  <span className="recent-type">{item.type}</span>
                  <span className="recent-content">{item.content.substring(0, 80)}...</span>
                </div>
                <span className="recent-date">
                  {new Date(item.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
