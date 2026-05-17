import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Search, Brain, MessageCircle, ArrowRight, Zap, Lock, Eye } from 'lucide-react'
import Chatbot from '../components/Chatbot'
import './Landing.css'

const features = [
  {
    icon: Search,
    title: 'Analise de conteudo',
    desc: 'Analise textos, links e imagens para detectar golpes e fake news em segundos.'
  },
  {
    icon: Brain,
    title: 'Inteligencia Artificial',
    desc: 'Algoritmos de machine learning classificam riscos automaticamente.'
  },
  {
    icon: MessageCircle,
    title: 'Chatbot inteligente',
    desc: 'Tire duvidas sobre seguranca digital com nosso assistente virtual.'
  },
  {
    icon: Eye,
    title: 'Detector por imagem',
    desc: 'Envie prints e capturas de tela para analise com tecnologia OCR.'
  },
  {
    icon: Zap,
    title: 'Simulador educativo',
    desc: 'Aprenda a identificar golpes com exemplos simulados interativos.'
  },
  {
    icon: Lock,
    title: 'Seguranca completa',
    desc: 'Proteja-se com dicas, orientacoes e historico completo de verificacoes.'
  }
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-logo">
          <ShieldCheck size={28} />
          <span>FraudShield</span>
        </div>
        <nav className="landing-nav">
          <a href="#features">Recursos</a>
          <a href="#about">Sobre</a>
          <button className="btn-outline" onClick={() => navigate('/login')}>
            Entrar
          </button>
          <button className="btn-primary" onClick={() => navigate('/register')}>
            Comecar gratis
          </button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Sistema Inteligente de Seguranca</div>
          <h1>Proteja-se contra <span className="gradient-text">golpes digitais</span> e <span className="gradient-text">fake news</span></h1>
          <p>Analise mensagens, noticias, links e conteudos digitais para identificar possiveis golpes ou informacoes falsas com inteligencia artificial.</p>
          <div className="hero-actions">
            <button className="btn-primary btn-lg" onClick={() => navigate('/register')}>
              Comecar gratis
              <ArrowRight size={18} />
            </button>
            <button className="btn-outline btn-lg" onClick={() => navigate('/login')}>
              Ja tenho conta
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">50K+</span>
              <span className="stat-label">Analises realizadas</span>
            </div>
            <div className="stat">
              <span className="stat-value">98%</span>
              <span className="stat-label">Precisao</span>
            </div>
            <div className="stat">
              <span className="stat-value">10K+</span>
              <span className="stat-label">Usuarios ativos</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="shield-graphic">
            <ShieldCheck size={120} />
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay"></div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <h2>Recursos <span className="gradient-text">poderosos</span></h2>
        <p className="section-desc">Tudo que voce precisa para se proteger no mundo digital</p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">
                <f.icon size={24} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-content">
          <h2>Por que <span className="gradient-text">FraudShield</span>?</h2>
          <p>Com o crescimento da comunicacao digital, aumentou significativamente o numero de golpes online e disseminacao de fake news. Nossa plataforma utiliza inteligencia artificial para proteger voce.</p>
          <div className="about-items">
            <div className="about-item">
              <div className="about-dot safe"></div>
              <span>Verificacao rapida e precisa</span>
            </div>
            <div className="about-item">
              <div className="about-dot warning"></div>
              <span>Classificacao automatica de risco</span>
            </div>
            <div className="about-item">
              <div className="about-dot danger"></div>
              <span>Alertas de conteudo perigoso</span>
            </div>
          </div>
          <button className="btn-primary" onClick={() => navigate('/register')}>
            Proteja-se agora
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <ShieldCheck size={24} />
            <span>FraudShield</span>
          </div>
          <p>ExpoTech - Sistema Inteligente de Deteccao de Golpes e Fake News</p>
        </div>
      </footer>

      <Chatbot />
    </div>
  )
}
