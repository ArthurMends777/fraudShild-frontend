import { useState } from 'react'
import { useApp } from '../context/useApp'
import { Search, Link2, Image, FileText, Upload, ShieldCheck, AlertTriangle, XCircle, Loader, RefreshCw, CheckCircle, AlertOctagon } from 'lucide-react'
import { api } from '../services/api'
import Tesseract from 'tesseract.js'
import './Analysis.css'

const mapNivel = (nivel) => {
  switch (nivel) {
    case 'confiavel':  return { risk: 'safe',    color: '#22C55E', result: 'TRUE'    }
    case 'suspeito':   return { risk: 'warning',  color: '#F59E0B', result: 'SUSPECT' }
    case 'alto_risco': return { risk: 'danger',   color: '#EF4444', result: 'FALSE'   }
    default:           return { risk: 'warning',  color: '#F59E0B', result: 'SUSPECT' }
  }
}

const tabType = { text: 'TEXT', link: 'URL', image: 'IMAGE' }

export default function Analysis() {
  const [activeTab, setActiveTab]       = useState('text')
  const [content, setContent]           = useState('')
  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [result, setResult]             = useState(null)
  const [analyzing, setAnalyzing]       = useState(false)
  const [ocrProgress, setOcrProgress]   = useState(0)
  const [error, setError]               = useState('')
  const [lastTexto, setLastTexto]       = useState('')
  const [lastType, setLastType]         = useState('text')
  const [explicar, setExplicar]         = useState(true)
  const { addAnalysis } = useApp()

  const tabs = [
    { id: 'text',  icon: FileText, label: 'Texto / Notícia' },
    { id: 'link',  icon: Link2,    label: 'Link' },
    { id: 'image', icon: Image,    label: 'Imagem' },
  ]

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
    setResult(null)
    setError('')
  }

  const extractTextFromImage = async (file) => {
    const { data: { text } } = await Tesseract.recognize(file, 'por+eng', {
      logger: m => {
        if (m.status === 'recognizing text') setOcrProgress(Math.round(m.progress * 100))
      }
    })
    return text.trim()
  }

  const runAnalysis = async (texto, type) => {
    setError('')
    setResult(null)
    setAnalyzing(true)
    try {
      const { data } = await api.post('/analisar', {
        texto,
        explicar,
        type: tabType[type],
        sourceUrl: type === 'link' ? texto : undefined,
      })
      const { risk, color, result: analResult } = mapNivel(data.classificacao.nivel)
      const mapped = {
        risk,
        color,
        label:      data.classificacao.label,
        emoji:      data.classificacao.emoji,
        observacao: data.classificacao.observacao,
        score:      Math.round(data.probabilidade_fake * 100),
        alertas:    data.alertas,
        palavras:   data.palavras_chave,
        evidencias: data.evidencias,
        textoOcr:   type === 'image' ? texto : null,
      }
      setResult(mapped)
      addAnalysis({
        type:    tabType[type],
        content: type === 'image' ? `[Imagem] ${texto.substring(0, 200)}` : texto,
        risk:    analResult,
        score:   mapped.score,
      })
    } catch (err) {
      setError(err.response?.data?.erro || 'Serviço de análise indisponível. Verifique se o servidor ML está rodando.')
    } finally {
      setAnalyzing(false)
      setOcrProgress(0)
    }
  }

  const handleAnalyze = async () => {
    let texto = content.trim()
    if (activeTab === 'image') {
      if (!imageFile) return
      setAnalyzing(true)
      setOcrProgress(0)
      try {
        texto = await extractTextFromImage(imageFile)
        if (!texto) {
          setError('Não foi possível extrair texto da imagem. Tente uma imagem com texto mais legível.')
          setAnalyzing(false)
          return
        }
      } catch {
        setError('Erro ao processar imagem.')
        setAnalyzing(false)
        return
      }
      setAnalyzing(false)
    } else {
      if (!texto) return
    }
    setLastTexto(texto)
    setLastType(activeTab)
    await runAnalysis(texto, activeTab)
  }

  const handleReanalyze = () => {
    if (lastTexto) runAnalysis(lastTexto, lastType)
  }

  const handleClear = () => {
    setContent('')
    setImageFile(null)
    setImagePreview(null)
    setResult(null)
    setError('')
    setLastTexto('')
  }

  const getRiskIcon = (risk) => {
    if (risk === 'safe')    return <ShieldCheck size={28} />
    if (risk === 'warning') return <AlertTriangle size={28} />
    return <XCircle size={28} />
  }

  const getScoreConfiabilidade = (score) => {
    if (score >= 0.4)  return { label: 'Fontes confiáveis encontradas',      color: '#22C55E', icon: <CheckCircle size={14} /> }
    if (score <= -0.3) return { label: 'Fontes suspeitas predominantes',       color: '#EF4444', icon: <AlertOctagon size={14} /> }
    return               { label: 'Resultados mistos — verifique as fontes', color: '#F59E0B', icon: <AlertTriangle size={14} /> }
  }

  return (
    <div className="analysis-page">
      <div className="page-header">
        <h1>Análise de conteúdo</h1>
        <p>Cole um texto, link ou envie uma imagem para verificar</p>
      </div>

      <div className="analysis-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`analysis-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.id); setResult(null); setError('') }}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="analysis-input-area">
        {activeTab === 'image' ? (
          <div className="image-upload-area">
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button className="remove-image" onClick={() => { setImageFile(null); setImagePreview(null); setResult(null) }}>
                  <XCircle size={20} />
                </button>
              </div>
            ) : (
              <label className="upload-label">
                <Upload size={40} />
                <span>Clique ou arraste uma imagem</span>
                <span className="upload-hint">PNG, JPG ou captura de tela — o texto será extraído automaticamente</span>
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              </label>
            )}
          </div>
        ) : (
          <textarea
            className="analysis-textarea"
            placeholder={activeTab === 'text'
              ? 'Cole aqui o texto, notícia ou mensagem que deseja analisar...'
              : 'Cole aqui o link que deseja verificar...'}
            value={content}
            onChange={e => { setContent(e.target.value); setResult(null) }}
            rows={8}
          />
        )}

        {error && <p className="error-msg" style={{ marginTop: 8 }}>{error}</p>}

        {/* Toggle modo de análise */}
        <div className="analysis-mode">
          <span className="analysis-mode-label">Modo de análise:</span>
          <div className="analysis-mode-options">
            <button
              type="button"
              className={`mode-btn ${!explicar ? 'active' : ''}`}
              onClick={() => setExplicar(false)}
            >
              <span className="mode-icon">⚡</span>
              <div>
                <span className="mode-title">Rápida</span>
                <span className="mode-desc">Resultado em segundos, sem explicação detalhada</span>
              </div>
            </button>
            <button
              type="button"
              className={`mode-btn ${explicar ? 'active' : ''}`}
              onClick={() => setExplicar(true)}
            >
              <span className="mode-icon">🔬</span>
              <div>
                <span className="mode-title">Detalhada</span>
                <span className="mode-desc">Palavras-chave explicadas pelo modelo (mais lento)</span>
              </div>
            </button>
          </div>
        </div>

        <div className="analysis-actions">
          <button
            className="btn-analyze"
            onClick={handleAnalyze}
            disabled={analyzing || (!content.trim() && activeTab !== 'image') || (activeTab === 'image' && !imageFile)}
          >
            {analyzing ? (
              <>
                <Loader size={18} className="spin" />
                {activeTab === 'image' && ocrProgress < 100
                  ? `Extraindo texto... ${ocrProgress}%`
                  : 'Analisando...'}
              </>
            ) : (
              <>
                <Search size={18} />
                Analisar conteúdo
              </>
            )}
          </button>
          <button className="btn-clear" onClick={handleClear}>Limpar</button>
        </div>
      </div>

      {result && (
        <div className="analysis-result" style={{ borderColor: result.color }}>

          {/* Banner de alto risco */}
          {result.risk === 'danger' && (
            <div className="danger-banner">
              <AlertOctagon size={20} />
              <span>Atenção! Este conteúdo apresenta alto risco de golpe ou desinformação. Não compartilhe, não clique em links e não forneça dados pessoais.</span>
            </div>
          )}

          <div className="result-header">
            <div className="result-icon" style={{ background: `${result.color}15`, color: result.color }}>
              {getRiskIcon(result.risk)}
            </div>
            <div className="result-title">
              <h3 style={{ color: result.color }}>{result.emoji} {result.label}</h3>
              <div className="risk-meter-wrapper">
                <div className="risk-meter">
                  <div className="risk-meter-fill" style={{ width: `${result.score}%`, background: result.color }}/>
                </div>
                <div className="risk-meter-labels">
                  <span style={{ color: '#22C55E' }}>Confiável</span>
                  <span style={{ color: '#F59E0B' }}>Suspeito</span>
                  <span style={{ color: '#EF4444' }}>Alto risco</span>
                </div>
                <span className="risk-score">Probabilidade de fraude: <strong>{result.score}%</strong></span>
              </div>
            </div>
            {/* Botão analisar novamente */}
            <button className="btn-reanalyze" onClick={handleReanalyze} disabled={analyzing} title="Analisar novamente">
              <RefreshCw size={16} className={analyzing ? 'spin' : ''} />
              <span>Reanalisar</span>
            </button>
          </div>

          {result.observacao && (
            <div className="result-observation">
              <p>{result.observacao}</p>
            </div>
          )}

          {/* Texto extraído da imagem */}
          {result.textoOcr && (
            <div className="result-section">
              <h4>Texto extraído da imagem</h4>
              <p className="ocr-text">{result.textoOcr}</p>
            </div>
          )}

          {/* Alertas */}
          {result.alertas?.length > 0 && (
            <div className="result-section">
              <h4>Alertas detectados</h4>
              <div className="pattern-tags">
                {result.alertas.map((a, i) => (
                  <span key={i} className="pattern-tag" style={{ borderColor: result.color, color: result.color }}>
                    ⚠ {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Palavras-chave do LIME */}
          {result.palavras?.length > 0 && (
            <div className="result-section">
              <h4>Palavras-chave da análise</h4>
              <div className="keywords-list">
                {result.palavras.map((p, i) => (
                  <span key={i} className={`keyword-tag ${p.tipo}`} title={`Contribuição: ${p.contribuicao}`}>
                    {p.palavra}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Evidências da web */}
          {result.evidencias && !result.evidencias.erro && explicar && (
            <div className="result-section">
              <div className="evidencias-header">
                <h4>Evidências na web</h4>
                {/* Score de confiabilidade */}
                {(result.evidencias.encontrou_desmentido || result.evidencias.encontrou_confirmacao) && (() => {
                  const sc = getScoreConfiabilidade(result.evidencias.score_confiabilidade)
                  return (
                    <span className="score-confiabilidade" style={{ color: sc.color, borderColor: sc.color }}>
                      {sc.icon} {sc.label}
                    </span>
                  )
                })()}
              </div>
              <p className="evidencias-obs">{result.evidencias.observacao}</p>
              {result.evidencias.fontes?.length > 0 && (
                <div className="fontes-list">
                  {result.evidencias.fontes.map((f, i) => (
                    <a
                      key={i}
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`fonte-item ${f.confiavel ? 'confiavel' : f.suspeita ? 'suspeita' : ''}`}
                    >
                      <div className="fonte-header">
                        <span className="fonte-titulo">{f.titulo}</span>
                        {f.confiavel && <span className="fonte-badge confiavel">✓ Fonte confiável</span>}
                        {f.suspeita  && <span className="fonte-badge suspeita">⚠ Fonte suspeita</span>}
                      </div>
                      <span className="fonte-desc">{f.descricao}</span>
                      <span className="fonte-url">{f.url}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="result-tips">
            <h4>Dicas de segurança</h4>
            <ul>
              <li>Nunca compartilhe dados pessoais em sites ou mensagens não verificados</li>
              <li>Verifique a fonte da informação em veículos confiáveis</li>
              <li>Desconfie de ofertas que parecem boas demais para ser verdade</li>
              <li>Em caso de dúvida, consulte nosso chatbot para mais orientações</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
