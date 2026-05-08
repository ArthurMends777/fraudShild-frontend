import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ShieldCheck, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import Chatbot from '../components/Chatbot'
import './Auth.css'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useApp()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name && email && password && password === confirmPassword) {
      login(name, email)
      navigate('/app/dashboard')
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
          <h1>Criar conta</h1>
          <p>Comece a se proteger agora</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <User size={18} className="input-icon" />
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
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
              placeholder="Criar senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="button" className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-submit">
            Criar conta
          </button>
        </form>

        <p className="auth-switch">
          Ja tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>

      <Chatbot />
    </div>
  )
}
