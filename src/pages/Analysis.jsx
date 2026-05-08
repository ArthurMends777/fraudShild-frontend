import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Search, Link2, Image, FileText, Upload, ShieldCheck, AlertTriangle, XCircle, Loader } from 'lucide-react'
import './Analysis.css'

const suspiciousPatterns = [
  'urgente', 'ganhe', 'premio', 'gratis', 'clique aqui', 'deposite',
  'transfira', 'pix', 'senha', 'dados pessoais', 'cartao', 'credito',
  'verificar conta', 'suspensa', 'bloqueada', 'atualizar cadastro',
  'oferta imperdivel', 'tempo limitado', 'aja agora', 'nao perca',
  'confirmacao', 'voce ganhou', 'selecionado', 'sorteado', 'parabens',
  'link', 'http', 'www', 'bit.ly', 'encurtador'
]

const fakeNewsPatterns = [
  'compartilhe', 'viralizar', 'midia esconde', 'ninguem fala',
  'verdade que', 'descobriram', 'chocante', 'absurdo', 'inacreditavel',
  'governo esconde', 'conspiracao', 'proibido', 'censurado',
  'urgente repassem', 'antes que apaguem', 'fato comprovado'
]

function analyzeContent(content, type) {
  const lower = content.toLowerCase()
  let score = 0
  const found = []

  suspiciousPatterns.forEach(p => {
    if (lower.includes(p)) {
      score += 10
      found.push(p)
    }
  })

  fakeNewsPatterns.forEach(p => {
    if (lower.includes(p)) {
      score += 15
      found.push(p)
    }
  })

  if (type === 'link') {
    if (lower.includes('bit.ly') || lower.includes('tinyurl') || lower.includes('encurtador')) score += 20
    if (!lower.includes('https://')) score += 10
    if (lower.match(/\d{4,}/)) score += 10
  }

  if (content.length < 20) score = Math.min(score, 20)
  score = Math.min(score, 100)

  let risk, label, color, explanation
  if (score <= 25) {
    risk = 'safe'
    label = 'Conteudo confiavel'
    color = '#22C55E'
    explanation = 'O conteudo analisado nao apresenta indicadores significativos de golpe ou desinformacao. Ainda assim, mantenha-se atento.'
  } else if (score <= 60) {
    risk = 'warning'
    label = 'Possivelmente suspeito'
    color = '#F59E0B'
    explanation = 'O conteudo apresenta alguns indicadores de possivel golpe ou fake news. Recomendamos verificar em fontes confiaveis antes de agir.'
  } else {
    risk = 'danger'
    label = 'Alto risco de golpe ou fake news'
    color = '#EF4444'
    explanation = 'O conteudo apresenta fortes indicadores de golpe ou desinformacao. Nao clique em links, nao forneca dados pessoais e denuncie.'
  }

  return { risk, label, color, score, found, explanation }
}

export default function Analysis() {
  const [activeTab, setActiveTab] = useState('text')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [result, setResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const { addAnalysis } = useApp()

  const tabs = [
    { id: 'text', icon: FileText, label: 'Texto / Noticia' },
    { id: 'link', icon: Link2, label: 'Link' },
    { id: 'image', icon: Image, label: 'Imagem' },
  ]

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = () => {
    const contentToAnalyze = activeTab === 'image' ? (imageFile?.name || 'imagem_analisada') : content
    if (!contentToAnalyze.trim() && activeTab !== 'image') return
    if (activeTab === 'image' && !imageFile) return

    setAnalyzing(true)
    setTimeout(() => {
      const analysisResult = analyzeContent(
        activeTab === 'image' ? 'imagem suspeita compartilhe urgente' : content,
        activeTab
      )

      setResult(analysisResult)
      addAnalysis({
        type: activeTab === 'text' ? 'Texto' : activeTab === 'link' ? 'Link' : 'Imagem',
        content: contentToAnalyze,
        risk: analysisResult.risk,
        score: analysisResult.score
      })
      setAnalyzing(false)
    }, 2000)
  }

  const handleClear = () => {
    setContent('')
    setImageFile(null)
    setImagePreview(null)
    setResult(null)
  }

  return (
    <div className="analysis-page">
      <div className="page-header">
        <h1>Analise de conteudo</h1>
        <p>Cole um texto, link ou envie uma imagem para verificar</p>
      </div>

      <div className="analysis-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`analysis-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.id); setResult(null); }}
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
                <button className="remove-image" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                  <XCircle size={20} />
                </button>
              </div>
            ) : (
              <label className="upload-label">
                <Upload size={40} />
                <span>Clique ou arraste uma imagem</span>
                <span className="upload-hint">PNG, JPG ou captura de tela</span>
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              </label>
            )}
          </div>
        ) : (
          <textarea
            className="analysis-textarea"
            placeholder={activeTab === 'text' 
              ? 'Cole aqui o texto, noticia ou mensagem que deseja analisar...'
              : 'Cole aqui o link que deseja verificar...'}
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
          />
        )}

        <div className="analysis-actions">
          <button className="btn-analyze" onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? (
              <>
                <Loader size={18} className="spin" />
                Analisando...
              </>
            ) : (
              <>
                <Search size={18} />
                Analisar conteudo
              </>
            )}
          </button>
          <button className="btn-clear" onClick={handleClear}>
            Limpar
          </button>
        </div>
      </div>

      {result && (
        <div className="analysis-result" style={{ borderColor: result.color }}>
          <div className="result-header">
            <div className="result-icon" style={{ background: `${result.color}15`, color: result.color }}>
              {result.risk === 'safe' ? <ShieldCheck size={28} /> : 
               result.risk === 'warning' ? <AlertTriangle size={28} /> : 
               <XCircle size={28} />}
            </div>
            <div className="result-title">
              <h3 style={{ color: result.color }}>{result.label}</h3>
              <div className="risk-meter">
                <div className="risk-meter-fill" style={{ width: `${result.score}%`, background: result.color }}></div>
              </div>
              <span className="risk-score">Probabilidade de risco: {result.score}%</span>
            </div>
          </div>

          <div className="result-explanation">
            <h4>Explicacao</h4>
            <p>{result.explanation}</p>
          </div>

          {result.found.length > 0 && (
            <div className="result-patterns">
              <h4>Padroes detectados</h4>
              <div className="pattern-tags">
                {result.found.map((p, i) => (
                  <span key={i} className="pattern-tag" style={{ borderColor: result.color, color: result.color }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="result-tips">
            <h4>Dicas de seguranca</h4>
            <ul>
              <li>Nunca compartilhe dados pessoais em sites ou mensagens nao verificados</li>
              <li>Verifique a fonte da informacao em veiculos confiaveis</li>
              <li>Desconfie de ofertas que parecem boas demais para ser verdade</li>
              <li>Em caso de duvida, consulte nosso chatbot para mais orientacoes</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
