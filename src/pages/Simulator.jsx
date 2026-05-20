import { useState, useEffect } from 'react'
import { Gamepad2, ShieldCheck, XCircle, Clock, Trophy, ChevronRight, RefreshCw } from 'lucide-react'
import { simulatorService } from '../services/simulatorService'
import './Simulator.css'

export default function Simulator() {
  const [session, setSession]           = useState(null)
  const [scenarios, setScenarios]       = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback]         = useState(null) // { correct, explanation, isScam }
  const [loading, setLoading]           = useState(true)
  const [answering, setAnswering]       = useState(false)
  const [cooldown, setCooldown]         = useState(null) // { daysRemaining }
  const [stats, setStats]               = useState(null)
  const [sessionDone, setSessionDone]   = useState(false)

  useEffect(() => {
    loadSession()
    simulatorService.getStats().then(setStats).catch(() => {})
  }, [])

  const loadSession = async () => {
    setLoading(true)
    setCooldown(null)
    try {
      const data = await simulatorService.startSession()
      setSession(data)
      setScenarios(data.scenarios)
      // Retoma da primeira pergunta não respondida
      const firstPending = data.scenarios.findIndex(s => !s.answered)
      setCurrentIndex(firstPending >= 0 ? firstPending : 0)
      if (data.completedAt) setSessionDone(true)
    } catch (err) {
      if (err.response?.data?.error === 'COOLDOWN') {
        setCooldown({ daysRemaining: err.response.data.daysRemaining })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = async (answer) => {
    if (answering || feedback) return
    setAnswering(true)
    try {
      const result = await simulatorService.answer({
        sessionId: session.sessionId,
        scenarioId: scenarios[currentIndex].id,
        answer,
      })
      setFeedback(result)
      setSession(prev => ({ ...prev, score: result.score }))
      if (result.sessionCompleted) {
        setSessionDone(true)
        simulatorService.getStats().then(setStats).catch(() => {})
      }
    } catch (err) {
      console.error(err)
    } finally {
      setAnswering(false)
    }
  }

  const handleNext = () => {
    setFeedback(null)
    setCurrentIndex(prev => prev + 1)
  }

  const currentScenario = scenarios[currentIndex]
  const progress = session ? ((currentIndex) / session.total) * 100 : 0

  if (loading) {
    return (
      <div className="simulator-page">
        <div className="page-header"><h1>Simulador Educativo</h1></div>
        <div className="simulator-loading"><RefreshCw size={32} className="spin" /><p>Carregando sessão...</p></div>
      </div>
    )
  }

  if (cooldown) {
    return (
      <div className="simulator-page">
        <div className="page-header">
          <h1>Simulador Educativo</h1>
          <p>Teste sua habilidade de identificar golpes e fake news</p>
        </div>
        <div className="simulator-cooldown">
          <Clock size={48} />
          <h2>Próxima sessão em {cooldown.daysRemaining} dia{cooldown.daysRemaining > 1 ? 's' : ''}</h2>
          <p>Você completou sua sessão recentemente. Volte em {cooldown.daysRemaining} dia{cooldown.daysRemaining > 1 ? 's' : ''} para um novo desafio!</p>
          {stats && (
            <div className="cooldown-stats">
              <div className="cooldown-stat">
                <span className="cooldown-stat-value">{stats.lastScore}/{stats.lastTotal}</span>
                <span className="cooldown-stat-label">Última sessão</span>
              </div>
              <div className="cooldown-stat">
                <span className="cooldown-stat-value">{stats.accuracy}%</span>
                <span className="cooldown-stat-label">Precisão geral</span>
              </div>
              <div className="cooldown-stat">
                <span className="cooldown-stat-value">{stats.totalSessions}</span>
                <span className="cooldown-stat-label">Sessões completas</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (sessionDone) {
    const score = session?.score ?? 0
    const total = session?.total ?? 5
    const pct   = Math.round((score / total) * 100)
    const isGood = pct >= 80

    return (
      <div className="simulator-page">
        <div className="page-header">
          <h1>Simulador Educativo</h1>
          <p>Teste sua habilidade de identificar golpes e fake news</p>
        </div>
        <div className="simulator-done">
          <div className={`done-icon ${isGood ? 'good' : 'bad'}`}>
            {isGood ? <Trophy size={48} /> : <ShieldCheck size={48} />}
          </div>
          <h2>{isGood ? 'Excelente!' : 'Continue praticando!'}</h2>
          <p className="done-score">{score} de {total} acertos ({pct}%)</p>
          <p className="done-desc">
            {pct >= 80
              ? 'Você demonstrou ótimo conhecimento sobre segurança digital. Seu nível foi atualizado!'
              : pct >= 50
              ? 'Bom desempenho! Continue praticando para melhorar ainda mais.'
              : 'Não desanime! Cada erro é uma oportunidade de aprendizado.'}
          </p>
          {stats && (
            <div className="cooldown-stats">
              <div className="cooldown-stat">
                <span className="cooldown-stat-value">{stats.accuracy}%</span>
                <span className="cooldown-stat-label">Precisão geral</span>
              </div>
              <div className="cooldown-stat">
                <span className="cooldown-stat-value">{stats.totalSessions}</span>
                <span className="cooldown-stat-label">Sessões completas</span>
              </div>
            </div>
          )}
          <p className="done-next">Próxima sessão disponível em 4 dias.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="simulator-page">
      <div className="page-header">
        <h1>Simulador Educativo</h1>
        <p>Teste sua habilidade de identificar golpes e fake news</p>
      </div>

      <div className="simulator-header">
        <span className="sim-progress-label">Cenário {currentIndex + 1} de {session?.total}</span>
        <div className="sim-progress-bar">
          <div className="sim-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="sim-score-label">Acertos: {session?.score ?? 0}/{currentIndex}</span>
      </div>

      {currentScenario && (
        <div className="scenario-card">
          <div className="scenario-category">
            <span className="category-badge">{currentScenario.category?.toUpperCase()}</span>
            <span className="difficulty-badge">{currentScenario.difficulty}</span>
          </div>

          <div className="scenario-content">
            <p>{currentScenario.content}</p>
          </div>

          {!feedback ? (
            <>
              <p className="scenario-question">Este conteúdo é um golpe ou fake news?</p>
              <div className="scenario-buttons">
                <button
                  className="btn-scam"
                  onClick={() => handleAnswer(true)}
                  disabled={answering}
                >
                  <XCircle size={18} />
                  Sim, é golpe/fake news
                </button>
                <button
                  className="btn-safe"
                  onClick={() => handleAnswer(false)}
                  disabled={answering}
                >
                  <ShieldCheck size={18} />
                  Não, é confiável
                </button>
              </div>
            </>
          ) : (
            <div className={`scenario-feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
              <div className="feedback-header">
                {feedback.correct
                  ? <><ShieldCheck size={20} /> Correto!</>
                  : <><XCircle size={20} /> Incorreto!</>}
              </div>
              <p className="feedback-explanation">{feedback.explanation}</p>
              <p className="feedback-answer">
                Este conteúdo {feedback.isScam ? 'É um golpe/fake news' : 'É confiável'}
              </p>
              {!sessionDone && currentIndex + 1 < (session?.total ?? 5) && (
                <button className="btn-next" onClick={handleNext}>
                  Próximo <ChevronRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Stats no rodapé */}
      {stats && (
        <div className="simulator-stats">
          <div className="sim-stat">
            <Gamepad2 size={16} />
            <span>{stats.totalSessions} sessões completas</span>
          </div>
          <div className="sim-stat">
            <Trophy size={16} />
            <span>{stats.accuracy}% de precisão geral</span>
          </div>
        </div>
      )}
    </div>
  )
}
