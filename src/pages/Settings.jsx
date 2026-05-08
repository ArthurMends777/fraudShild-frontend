import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { User, Mail, Lock, Bell, Palette, Save, Eye, EyeOff } from 'lucide-react'
import './Settings.css'

export default function Settings() {
  const { user, updateUserName, darkMode, toggleDarkMode } = useApp()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    analysis: true,
    security: true,
    newsletter: false,
  })
  const [saved, setSaved] = useState(false)

  const handleSaveProfile = (e) => {
    e.preventDefault()
    if (name.trim()) {
      updateUserName(name.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const handleSavePassword = (e) => {
    e.preventDefault()
    if (newPassword && newPassword === confirmPassword) {
      setSaved(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Configuracoes</h1>
        <p>Gerencie sua conta e preferencias</p>
      </div>

      {saved && (
        <div className="saved-notification">
          Alteracoes salvas com sucesso!
        </div>
      )}

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-card-header">
            <User size={20} />
            <h3>Perfil</h3>
          </div>
          <form onSubmit={handleSaveProfile}>
            <div className="settings-field">
              <label>Nome</label>
              <div className="input-group">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
            </div>
            <div className="settings-field">
              <label>E-mail</label>
              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Seu e-mail"
                  disabled
                />
              </div>
              <span className="field-hint">O e-mail nao pode ser alterado</span>
            </div>
            <button type="submit" className="btn-save">
              <Save size={16} />
              Salvar perfil
            </button>
          </form>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <Lock size={20} />
            <h3>Seguranca</h3>
          </div>
          <form onSubmit={handleSavePassword}>
            <div className="settings-field">
              <label>Senha atual</label>
              <div className="input-group">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Senha atual"
                />
                <button type="button" className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="settings-field">
              <label>Nova senha</label>
              <div className="input-group">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Nova senha"
                />
              </div>
            </div>
            <div className="settings-field">
              <label>Confirmar nova senha</label>
              <div className="input-group">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirmar nova senha"
                />
              </div>
            </div>
            <button type="submit" className="btn-save">
              <Save size={16} />
              Alterar senha
            </button>
          </form>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <Bell size={20} />
            <h3>Notificacoes</h3>
          </div>
          <div className="toggle-list">
            <div className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-label">Notificacoes por e-mail</span>
                <span className="toggle-desc">Receba alertas sobre suas analises</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={e => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-label">Alertas de analise</span>
                <span className="toggle-desc">Notificacoes de conteudo de alto risco</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications.analysis}
                  onChange={e => setNotifications(prev => ({ ...prev, analysis: e.target.checked }))}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-label">Alertas de seguranca</span>
                <span className="toggle-desc">Avisos sobre novos golpes detectados</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications.security}
                  onChange={e => setNotifications(prev => ({ ...prev, security: e.target.checked }))}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-label">Newsletter</span>
                <span className="toggle-desc">Receba dicas semanais de seguranca</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications.newsletter}
                  onChange={e => setNotifications(prev => ({ ...prev, newsletter: e.target.checked }))}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <Palette size={20} />
            <h3>Aparencia</h3>
          </div>
          <div className="toggle-list">
            <div className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-label">Modo escuro</span>
                <span className="toggle-desc">Alterne entre tema claro e escuro</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="theme-preview">
            <h4>Cores do sistema</h4>
            <div className="color-swatches">
              <div className="swatch" style={{ background: '#00CAD5' }} title="#00CAD5"></div>
              <div className="swatch" style={{ background: '#2563EB' }} title="#2563EB"></div>
              <div className="swatch" style={{ background: '#1E3A8A' }} title="#1E3A8A"></div>
              <div className="swatch" style={{ background: '#071025' }} title="#071025"></div>
              <div className="swatch" style={{ background: '#0B152D' }} title="#0B152D"></div>
            </div>
            <h4>Cores de resultado</h4>
            <div className="color-swatches">
              <div className="swatch-labeled">
                <div className="swatch" style={{ background: '#22C55E' }}></div>
                <span>Confiavel</span>
              </div>
              <div className="swatch-labeled">
                <div className="swatch" style={{ background: '#F59E0B' }}></div>
                <span>Suspeito</span>
              </div>
              <div className="swatch-labeled">
                <div className="swatch" style={{ background: '#EF4444' }}></div>
                <span>Cuidado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
