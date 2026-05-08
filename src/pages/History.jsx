import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { History as HistoryIcon, Search, Trash2, FileText, Link2, Image, Filter } from 'lucide-react'
import './History.css'

export default function History() {
  const { analysisHistory, clearHistory } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterRisk, setFilterRisk] = useState('all')

  const filtered = analysisHistory.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.type.toLowerCase() === filterType
    const matchesRisk = filterRisk === 'all' || item.risk === filterRisk
    return matchesSearch && matchesType && matchesRisk
  })

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'texto': return <FileText size={16} />
      case 'link': return <Link2 size={16} />
      case 'imagem': return <Image size={16} />
      default: return <FileText size={16} />
    }
  }

  const getRiskLabel = (risk) => {
    switch (risk) {
      case 'safe': return 'Confiavel'
      case 'warning': return 'Suspeito'
      case 'danger': return 'Alto Risco'
      default: return risk
    }
  }

  return (
    <div className="history-page">
      <div className="page-header">
        <h1>Historico de analises</h1>
        <p>Veja todas as suas verificacoes anteriores</p>
      </div>

      <div className="history-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar no historico..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={16} />
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">Todos os tipos</option>
            <option value="texto">Texto</option>
            <option value="link">Link</option>
            <option value="imagem">Imagem</option>
          </select>
          <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)}>
            <option value="all">Todos os riscos</option>
            <option value="safe">Confiavel</option>
            <option value="warning">Suspeito</option>
            <option value="danger">Alto Risco</option>
          </select>
        </div>

        {analysisHistory.length > 0 && (
          <button className="btn-clear-history" onClick={clearHistory}>
            <Trash2 size={16} />
            Limpar historico
          </button>
        )}
      </div>

      <div className="history-summary">
        <div className="summary-item">
          <span className="summary-value">{analysisHistory.length}</span>
          <span className="summary-label">Total</span>
        </div>
        <div className="summary-item">
          <span className="summary-value safe">{analysisHistory.filter(a => a.risk === 'safe').length}</span>
          <span className="summary-label">Confiaveis</span>
        </div>
        <div className="summary-item">
          <span className="summary-value warning">{analysisHistory.filter(a => a.risk === 'warning').length}</span>
          <span className="summary-label">Suspeitos</span>
        </div>
        <div className="summary-item">
          <span className="summary-value danger">{analysisHistory.filter(a => a.risk === 'danger').length}</span>
          <span className="summary-label">Alto Risco</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <HistoryIcon size={48} />
          <h3>Nenhuma analise encontrada</h3>
          <p>
            {analysisHistory.length === 0
              ? 'Voce ainda nao realizou nenhuma analise. Acesse a pagina de analise para comecar!'
              : 'Nenhuma analise corresponde aos filtros selecionados.'}
          </p>
        </div>
      ) : (
        <div className="history-list">
          {filtered.map(item => (
            <div key={item.id} className="history-item">
              <div className="history-item-left">
                <div className="history-type-icon">
                  {getTypeIcon(item.type)}
                </div>
                <div className="history-item-info">
                  <div className="history-item-top">
                    <span className="history-item-type">{item.type}</span>
                    <span className={`risk-badge ${item.risk}`}>{getRiskLabel(item.risk)}</span>
                  </div>
                  <p className="history-item-content">{item.content}</p>
                  <span className="history-item-date">
                    {new Date(item.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              <div className="history-item-score">
                <span className="score-number">{item.score}%</span>
                <span className="score-text">Risco</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
