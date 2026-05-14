import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Chatbot from '../components/Chatbot'
import { authService } from '../services/authService'
import './Auth.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotError, setForgotError] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  const { login } = useApp()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authService.login({ email, password })
      login(data.user, data.token)
      navigate('/app/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setForgotError('')
    setForgotLoading(true)
    try {
      await authService.forgotPassword(forgotEmail)
      setForgotSent(true)
    } catch (err) {
      setForgotError(err.response?.data?.error || 'Erro ao enviar e-mail.')
    } finally {
      setForgotLoading(false)
    }
  }

  const closeForgot = () => {
    setShowForgot(false)
    setForgotSent(false)
    setForgotEmail('')
    setForgotError('')
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <ShieldCheck size={32} />
            <span>FraudShield</span>
          </Link>
          <h1>Bem-vindo de volta</h1>
          <p>Entre na sua conta para continuar</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="button" className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="button" className="forgot-link" onClick={() => setShowForgot(true)}>
            Esqueceu a senha?
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-switch">
          Não tem conta? <Link to="/register">Criar conta</Link>
        </p>
      </div>

      {showForgot && (
        <div className="modal-overlay" onClick={closeForgot}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Esqueceu a senha?</h2>
            <p>Digite seu e-mail para receber o link de recuperação</p>
            {forgotSent ? (
              <div className="success-msg">
                E-mail enviado! Verifique sua caixa de entrada.
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <div className="input-group">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                {forgotError && <p className="error-msg">{forgotError}</p>}
                <button type="submit" className="btn-submit" disabled={forgotLoading}>
                  {forgotLoading ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Chatbot />
    </div>
  )
}
