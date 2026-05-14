import { useState, useEffect, useCallback } from 'react'
import { History as HistoryIcon, Search, Trash2, FileText, Link2, Image, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { historyService } from '../services/historyService'
import './History.css'

const resultLabel = { TRUE: 'Confiável', SUSPECT: 'Suspeito', FALSE: 'Alto Risco' }
const resultClass  = { TRUE: 'safe', SUSPECT: 'warning', FALSE: 'danger' }

const getTypeIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'text':  return <FileText size={16} />
    case 'url':   return <Link2 size={16} />
    case 'image': return <Image size={16} />
    default:      return <FileText size={16} />
  }
}

export default function History() {
  const [items, setItems]           = useState([])
  const [summary, setSummary]       = useState({ total: 0, confiaveis: 0, suspeitos: 0, altoRisco: 0 })
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterRisk, setFilterRisk] = useState('all')
  const [page, setPage]             = useState(1)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await historyService.getHistory({
        search: searchTerm || undefined,
        type:   filterType !== 'all' ? filterType   : undefined,
        result: filterRisk !== 'all' ? filterRisk   : undefined,
        page,
        limit: 10,
      })
      setItems(data.items)
      setSummary(data.summary)
      setPagination(data.pagination)
    } catch {
      setError('Erro ao carregar histórico.')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filterType, filterRisk, page])

  useEffect(() => {
    setPage(1)
  }, [searchTerm, filterType, filterRisk])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleClearHistory = async () => {
    if (!confirm('Tem certeza que deseja apagar todo o histórico?')) return
    try {
      await historyService.clearHistory()
      setItems([])
      setSummary({ total: 0, confiaveis: 0, suspeitos: 0, altoRisco: 0 })
      setPagination({ page: 1, pages: 1, total: 0 })
    } catch {
      setError('Erro ao limpar histórico.')
    }
  }

  return (
    <div className="history-page">
      <div className="page-header">
        <h1>Histórico de análises</h1>
        <p>Veja todas as suas verificações anteriores</p>
      </div>

      <div className="history-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar no histórico..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={16} />
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">Todos os tipos</option>
            <option value="TEXT">Texto</option>
            <option value="URL">Link</option>
            <option value="IMAGE">Imagem</option>
          </select>
          <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)}>
            <option value="all">Todos os riscos</option>
            <option value="TRUE">Confiável</option>
            <option value="SUSPECT">Suspeito</option>
            <option value="FALSE">Alto Risco</option>
          </select>
        </div>

        {summary.total > 0 && (
          <button className="btn-clear-history" onClick={handleClearHistory}>
            <Trash2 size={16} />
            Limpar histórico
          </button>
        )}
      </div>

      <div className="history-summary">
        <div className="summary-item">
          <span className="summary-value">{summary.total}</span>
          <span className="summary-label">Total</span>
        </div>
        <div className="summary-item">
          <span className="summary-value safe">{summary.confiaveis}</span>
          <span className="summary-label">Confiáveis</span>
        </div>
        <div className="summary-item">
          <span className="summary-value warning">{summary.suspeitos}</span>
          <span className="summary-label">Suspeitos</span>
        </div>
        <div className="summary-item">
          <span className="summary-value danger">{summary.altoRisco}</span>
          <span className="summary-label">Alto Risco</span>
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><p>Carregando...</p></div>
      ) : error ? (
        <div className="empty-state"><p className="error-msg">{error}</p></div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <HistoryIcon size={48} />
          <h3>Nenhuma análise encontrada</h3>
          <p>
            {summary.total === 0
              ? 'Você ainda não realizou nenhuma análise. Acesse a página de análise para começar!'
              : 'Nenhuma análise corresponde aos filtros selecionados.'}
          </p>
        </div>
      ) : (
        <>
          <div className="history-list">
            {items.map(item => (
              <div key={item.id} className="history-item">
                <div className="history-item-left">
                  <div className="history-type-icon">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="history-item-info">
                    <div className="history-item-top">
                      <span className="history-item-type">{item.type}</span>
                      <span className={`risk-badge ${resultClass[item.result]}`}>
                        {resultLabel[item.result]}
                      </span>
                    </div>
                    <p className="history-item-content">{item.content}</p>
                    <span className="history-item-date">
                      {new Date(item.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <div className="history-item-score">
                  <span className="score-number">{Math.round((item.confidence ?? 0) * 100)}%</span>
                  <span className="score-text">Confiança</span>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
              >
                <ChevronLeft size={16} /> Anterior
              </button>
              <span className="pagination-info">
                Página {pagination.page} de {pagination.pages}
              </span>
              <button
                className="pagination-btn"
                onClick={() => setPage(p => p + 1)}
                disabled={page === pagination.pages}
              >
                Próxima <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
