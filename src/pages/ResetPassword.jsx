import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react'
import Chatbot from '../components/Chatbot'
import { authService } from '../services/authService'
import './Auth.css'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const { token: routeToken } = useParams()
  const navigate = useNavigate()
  const token = useMemo(
    () => routeToken || searchParams.get('token') || searchParams.get('resetToken') || '',
    [routeToken, searchParams]
  )

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!token) {
      setError('Link de redefinicao invalido ou expirado.')
      return
    }

    if (password.length < 8) {
      setError('A nova senha deve ter no minimo 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas nao coincidem.')
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword({ token, newPassword: password })
      setMessage('Senha redefinida com sucesso. Voce ja pode entrar com a nova senha.')
      setPassword('')
      setConfirmPassword('')
      window.setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao redefinir senha. Solicite um novo link e tente novamente.')
    } finally {
      setLoading(false)
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
          <h1>Redefinir senha</h1>
          <p>Crie uma nova senha para acessar sua conta</p>
        </div>

        {!token && (
          <p className="error-msg">
            Link de redefinicao invalido. Solicite um novo e-mail de recuperacao.
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nova senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={!token || loading}
            />
            <button
              type="button"
              className="toggle-pass"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              disabled={!token || loading}
            />
            <button
              type="button"
              className="toggle-pass"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Ocultar confirmacao' : 'Mostrar confirmacao'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="error-msg">{error}</p>}
          {message && <p className="success-msg">{message}</p>}

          <button type="submit" className="btn-submit" disabled={!token || loading}>
            {loading ? 'Redefinindo...' : 'Redefinir senha'}
          </button>
        </form>

        <p className="auth-switch">
          Lembrou a senha? <Link to="/login">Entrar</Link>
        </p>
      </div>

      <Chatbot />
    </div>
  )
}
