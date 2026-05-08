import { useState } from 'react'
import { Gamepad2, ShieldCheck, XCircle, ArrowRight, RotateCcw } from 'lucide-react'
import './Simulator.css'

const scenarios = [
  {
    id: 1,
    category: 'Phishing',
    message: 'Prezado cliente, detectamos uma atividade suspeita em sua conta. Para evitar o bloqueio, atualize seus dados clicando no link: http://banco-seguro.xyz/atualizar. Voce tem 24 horas para resolver.',
    isScam: true,
    explanation: 'Este e um exemplo classico de phishing. Sinais de alerta: URL suspeita (dominio .xyz), senso de urgencia (24 horas), solicitacao de dados pessoais via link. Bancos nunca pedem atualizacao de dados por e-mail ou SMS.',
    tips: ['Verifique o dominio do link', 'Bancos nao pedem dados por e-mail', 'Desconfie de prazos urgentes']
  },
  {
    id: 2,
    category: 'Fake News',
    message: 'URGENTE: Cientistas descobriram que beber agua morna com limao em jejum cura qualquer doenca. A industria farmaceutica esconde isso ha anos! Compartilhe antes que apaguem!',
    isScam: true,
    explanation: 'Fake news tipica com apelo emocional. Sinais: uso de palavras como "URGENTE", "cura qualquer doenca" (generalizacao impossivel), teoria da conspiracao ("industria esconde"), pedido para compartilhar.',
    tips: ['Desconfie de curas milagrosas', 'Verifique fontes cientificas', '"Antes que apaguem" e sinal classico']
  },
  {
    id: 3,
    category: 'Golpe PIX',
    message: 'Oi, tudo bem? Sou eu, troquei de numero. Me salva? Preciso que voce faca um PIX urgente de R$500 para pagar uma conta que vence hoje. Te devolvo amanha sem falta! Chave: 11999887766',
    isScam: true,
    explanation: 'Golpe classico de PIX por WhatsApp. Sinais: pessoa desconhecida dizendo que trocou de numero, pedido de dinheiro urgente, promessa de devolucao, pressao emocional.',
    tips: ['Ligue para o numero antigo da pessoa', 'Nunca faca PIX por pressao', 'Confirme a identidade por video']
  },
  {
    id: 4,
    category: 'E-mail Legitimo',
    message: 'Sua fatura do cartao de credito no valor de R$1.247,32 esta disponivel para consulta no aplicativo do banco. Acesse o app oficial para visualizar. Em caso de duvidas, ligue para nossa central: 0800-123-4567.',
    isScam: false,
    explanation: 'Esta mensagem apresenta caracteristicas de comunicacao legitima. Nao contem links suspeitos, nao pede dados pessoais, indica o app oficial e fornece telefone da central de atendimento.',
    tips: ['Mensagens legitimas direcionam ao app oficial', 'Fornecem canais oficiais de contato', 'Nao pedem dados pessoais']
  },
  {
    id: 5,
    category: 'Sorteio Falso',
    message: 'PARABENS! Voce foi selecionado para ganhar um iPhone 15 Pro Max! Para resgatar seu premio, envie seus dados completos (CPF, endereco e numero do cartao) para o e-mail: premios@oferta-gratis.com',
    isScam: true,
    explanation: 'Golpe de falso premio. Sinais: voce nao participou de nenhum sorteio, pedem dados sensiveis (CPF, cartao), e-mail com dominio suspeito, oferta boa demais para ser verdade.',
    tips: ['Voce nao ganha sorteios que nao participou', 'Nunca envie CPF ou cartao por e-mail', 'Verifique o dominio do e-mail']
  },
  {
    id: 6,
    category: 'Noticia Real',
    message: 'O Banco Central anunciou hoje a manutencao da taxa Selic em 13,75% ao ano, conforme esperado pelo mercado. A decisao foi divulgada apos reuniao do Copom e esta disponivel no site oficial do BC.',
    isScam: false,
    explanation: 'Esta noticia apresenta caracteristicas de informacao confiavel: cita fonte oficial (Banco Central), evento verificavel (reuniao do Copom), linguagem neutra e sem apelo emocional.',
    tips: ['Noticias confiaveis citam fontes oficiais', 'Linguagem neutra e informativa', 'Eventos verificaveis em multiplas fontes']
  }
]

export default function Simulator() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(0)

  const current = scenarios[currentIndex]

  const handleAnswer = (answer) => {
    setUserAnswer(answer)
    setShowResult(true)
    setCompleted(prev => prev + 1)
    if (answer === current.isScam) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setUserAnswer(null)
      setShowResult(false)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setUserAnswer(null)
    setShowResult(false)
    setScore(0)
    setCompleted(0)
  }

  const isCorrect = userAnswer === current.isScam
  const isFinished = completed === scenarios.length && showResult && currentIndex === scenarios.length - 1

  return (
    <div className="simulator-page">
      <div className="page-header">
        <h1>Simulador educativo</h1>
        <p>Teste sua habilidade de identificar golpes e fake news</p>
      </div>

      <div className="simulator-progress">
        <div className="progress-info">
          <span>Cenario {currentIndex + 1} de {scenarios.length}</span>
          <span>Acertos: {score}/{completed}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentIndex + (showResult ? 1 : 0)) / scenarios.length) * 100}%` }}></div>
        </div>
      </div>

      {isFinished ? (
        <div className="simulator-final">
          <div className="final-icon">
            <Gamepad2 size={48} />
          </div>
          <h2>Simulacao concluida!</h2>
          <div className="final-score">
            <span className="score-value">{score}/{scenarios.length}</span>
            <span className="score-label">Acertos</span>
          </div>
          <p className="final-message">
            {score === scenarios.length
              ? 'Excelente! Voce identificou todos os cenarios corretamente!'
              : score >= scenarios.length / 2
              ? 'Bom trabalho! Continue praticando para melhorar!'
              : 'Continue estudando sobre seguranca digital. Pratica leva a perfeicao!'}
          </p>
          <button className="btn-restart" onClick={handleRestart}>
            <RotateCcw size={18} />
            Jogar novamente
          </button>
        </div>
      ) : (
        <>
          <div className="scenario-card">
            <div className="scenario-header">
              <span className="scenario-category">{current.category}</span>
            </div>
            <div className="scenario-content">
              <p>{current.message}</p>
            </div>

            {!showResult && (
              <div className="scenario-question">
                <h3>Este conteudo e um golpe ou fake news?</h3>
                <div className="answer-buttons">
                  <button className="btn-answer scam" onClick={() => handleAnswer(true)}>
                    <XCircle size={18} />
                    Sim, e golpe/fake news
                  </button>
                  <button className="btn-answer safe" onClick={() => handleAnswer(false)}>
                    <ShieldCheck size={18} />
                    Nao, e confiavel
                  </button>
                </div>
              </div>
            )}
          </div>

          {showResult && (
            <div className={`result-card ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="result-status">
                {isCorrect ? (
                  <>
                    <ShieldCheck size={24} />
                    <span>Resposta correta!</span>
                  </>
                ) : (
                  <>
                    <XCircle size={24} />
                    <span>Resposta incorreta</span>
                  </>
                )}
              </div>

              <div className="result-actual">
                <span>Este conteudo e: </span>
                <strong style={{ color: current.isScam ? '#EF4444' : '#22C55E' }}>
                  {current.isScam ? 'Golpe / Fake News' : 'Confiavel'}
                </strong>
              </div>

              <div className="result-detail">
                <h4>Explicacao</h4>
                <p>{current.explanation}</p>
              </div>

              <div className="result-detail">
                <h4>Como identificar</h4>
                <ul>
                  {current.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              {currentIndex < scenarios.length - 1 && (
                <button className="btn-next" onClick={handleNext}>
                  Proximo cenario
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
