import { Bar, Doughnut } from 'react-chartjs-2'
import { useApp } from '../context/useApp'
import { Users, Search, TrendingUp, AlertTriangle, Activity } from 'lucide-react'
import './Admin.css'

export default function Admin() {
  const { darkMode } = useApp()
  const textColor = darkMode ? '#F8FAFC' : '#1F2937'
  const gridColor = darkMode ? 'rgba(248,250,252,0.06)' : 'rgba(31,41,55,0.08)'

  const adminStats = [
    { label: 'Total de usuarios', value: '1.247', icon: Users, color: '#00CAD5' },
    { label: 'Analises hoje', value: '342', icon: Search, color: '#2563EB' },
    { label: 'Golpes detectados', value: '89', icon: AlertTriangle, color: '#EF4444' },
    { label: 'Taxa de deteccao', value: '98.2%', icon: TrendingUp, color: '#22C55E' },
  ]

  const threatData = {
    labels: ['Phishing', 'Fake News', 'Golpe PIX', 'Malware', 'Engenharia Social', 'Spam'],
    datasets: [{
      label: 'Ameacas detectadas',
      data: [156, 234, 89, 45, 67, 198],
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

  const statusData = {
    labels: ['Ativo', 'Inativo', 'Bloqueado'],
    datasets: [{
      data: [890, 245, 112],
      backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
      borderWidth: 0,
      cutout: '70%',
    }]
  }

  const recentActivity = [
    { user: 'Maria Silva', action: 'Realizou analise de texto', time: 'Ha 2 min', type: 'analysis' },
    { user: 'Joao Santos', action: 'Novo cadastro realizado', time: 'Ha 5 min', type: 'register' },
    { user: 'Ana Oliveira', action: 'Detectou golpe de phishing', time: 'Ha 8 min', type: 'alert' },
    { user: 'Carlos Lima', action: 'Analisou link suspeito', time: 'Ha 12 min', type: 'analysis' },
    { user: 'Fernanda Costa', action: 'Completou simulador', time: 'Ha 15 min', type: 'simulator' },
  ]

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: textColor, font: { family: 'Saira', size: 11 } } }
    },
    scales: {
      x: { ticks: { color: textColor, font: { family: 'Saira', size: 10 } }, grid: { color: gridColor } },
      y: { ticks: { color: textColor, font: { family: 'Saira', size: 10 } }, grid: { color: gridColor } }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Saira', size: 11 }, padding: 16 } }
    }
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Administracao</h1>
        <p>Painel de monitoramento do sistema</p>
      </div>

      <div className="admin-stats">
        {adminStats.map((s, i) => (
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
          <h3>Ameacas por categoria</h3>
          <div className="chart-container">
            <Bar data={threatData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Status dos usuarios</h3>
          <div className="chart-container">
            <Doughnut data={statusData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="admin-activity">
        <h3>
          <Activity size={18} />
          Atividade recente
        </h3>
        <div className="activity-list">
          {recentActivity.map((item, i) => (
            <div key={i} className="activity-item">
              <div className="activity-avatar">{item.user.charAt(0)}</div>
              <div className="activity-info">
                <span className="activity-user">{item.user}</span>
                <span className="activity-action">{item.action}</span>
              </div>
              <span className="activity-time">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
