import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Chatbot from '../components/Chatbot'
import './Auth.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetDone, setResetDone] = useState(false)
  const { login } = useApp()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && password) {
      const name = email.split('@')[0]
      login(name, email)
      navigate('/app/dashboard')
    }
  }

  const handleForgotSubmit = (e) => {
    e.preventDefault()
    if (forgotEmail) {
      setForgotSent(true)
      setTimeout(() => {
        setForgotSent(false)
        setShowForgot(false)
        setShowReset(true)
      }, 2000)
    }
  }

  const handleResetSubmit = (e) => {
    e.preventDefault()
    if (newPassword && newPassword === confirmPassword) {
      setResetDone(true)
      setTimeout(() => {
        setShowReset(false)
        setResetDone(false)
      }, 2000)
    }
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
          <button type="button" className="forgot-link" onClick={() => setShowForgot(true)}>
            Esqueceu a senha?
          </button>
          <button type="submit" className="btn-submit">
            Entrar
          </button>
        </form>

        <p className="auth-switch">
          Nao tem conta? <Link to="/register">Criar conta</Link>
        </p>
      </div>

      {showForgot && (
        <div className="modal-overlay" onClick={() => setShowForgot(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Esqueceu a senha?</h2>
            <p>Digite seu e-mail para receber o link de recuperacao</p>
            {forgotSent ? (
              <div className="success-msg">
                E-mail enviado com sucesso! Verifique sua caixa de entrada.
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
                <button type="submit" className="btn-submit">Enviar</button>
              </form>
            )}
          </div>
        </div>
      )}

      {showReset && (
        <div className="modal-overlay" onClick={() => setShowReset(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Redefinir senha</h2>
            <p>Digite sua nova senha</p>
            {resetDone ? (
              <div className="success-msg">
                Senha redefinida com sucesso!
              </div>
            ) : (
              <form onSubmit={handleResetSubmit}>
                <div className="input-group">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    placeholder="Nova senha"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-submit">Redefinir</button>
              </form>
            )}
          </div>
        </div>
      )}

      <Chatbot />
    </div>
  )
}
