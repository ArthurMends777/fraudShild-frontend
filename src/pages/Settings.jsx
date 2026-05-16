import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/useApp'
import { User, Mail, Lock, Bell, Palette, Save, Eye, EyeOff, Camera } from 'lucide-react'
import { settingsService } from '../services/settingsService'
import { BASE_URL } from '../services/api'
import './Settings.css'

export default function Settings() {
  const { user, darkMode, toggleDarkMode, login, token } = useApp()

  // Perfil
  const [name, setName]                 = useState(user?.name || '')
  const [profileImage, setProfileImage] = useState(user?.profileImage || null)
  const [avatarLoading, setAvatarLoading]   = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg]         = useState({ text: '', error: false })
  const fileInputRef                        = useRef(null)

  // Senha
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword]       = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMsg, setPasswordMsg]         = useState({ text: '', error: false })

  // Notificações
  const [notifications, setNotifications] = useState({
    email:      user?.notifEmail      ?? true,
    analysis:   user?.notifAnalysis   ?? true,
    security:   user?.notifSecurity   ?? true,
    newsletter: user?.notifNewsletter ?? false,
  })
  const [notifLoading, setNotifLoading] = useState(false)

  useEffect(() => {
    settingsService.getProfile().then(profile => {
      setName(profile.name)
      setProfileImage(profile.profileImage || null)
      setNotifications({
        email:      profile.notifEmail,
        analysis:   profile.notifAnalysis,
        security:   profile.notifSecurity,
        newsletter: profile.notifNewsletter,
      })
    })
  }, [])

  const showMsg = (setter, text, error = false) => {
    setter({ text, error })
    setTimeout(() => setter({ text: '', error: false }), 3000)
  }

  // Upload de avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview local imediato enquanto faz upload
    const localUrl = URL.createObjectURL(file)
    setProfileImage(localUrl)
    setAvatarLoading(true)

    try {
      const { profileImage: savedUrl } = await settingsService.uploadAvatar(file)
      setProfileImage(savedUrl)
      login({ ...user, profileImage: savedUrl }, token)
      showMsg(setProfileMsg, 'Foto atualizada com sucesso!')
    } catch (err) {
      setProfileImage(user?.profileImage || null) // reverte preview
      showMsg(setProfileMsg, err.response?.data?.error || 'Erro ao enviar foto.', true)
    } finally {
      setAvatarLoading(false)
      e.target.value = '' // reseta o input para permitir selecionar a mesma foto novamente
    }
  }

  // Salvar perfil
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setProfileLoading(true)
    try {
      const updated = await settingsService.updateProfile({ name: name.trim() })
      login({ ...user, name: updated.name }, token)
      showMsg(setProfileMsg, 'Perfil salvo com sucesso!')
    } catch (err) {
      showMsg(setProfileMsg, err.response?.data?.error || 'Erro ao salvar perfil.', true)
    } finally {
      setProfileLoading(false)
    }
  }

  // Alterar senha
  const handleSavePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      showMsg(setPasswordMsg, 'As senhas não coincidem.', true)
      return
    }
    if (newPassword.length < 8) {
      showMsg(setPasswordMsg, 'A nova senha deve ter no mínimo 8 caracteres.', true)
      return
    }
    setPasswordLoading(true)
    try {
      await settingsService.changePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      showMsg(setPasswordMsg, 'Senha alterada com sucesso!')
    } catch (err) {
      showMsg(setPasswordMsg, err.response?.data?.error || 'Erro ao alterar senha.', true)
    } finally {
      setPasswordLoading(false)
    }
  }

  // Notificações
  const handleNotifChange = async (key, value) => {
    const updated = { ...notifications, [key]: value }
    setNotifications(updated)
    setNotifLoading(true)
    try {
      await settingsService.updatePreferences({
        notifEmail:      updated.email,
        notifAnalysis:   updated.analysis,
        notifSecurity:   updated.security,
        notifNewsletter: updated.newsletter,
      })
    } catch {
      setNotifications(notifications)
    } finally {
      setNotifLoading(false)
    }
  }

  // Tema
  const handleThemeToggle = async () => {
    toggleDarkMode()
    try {
      await settingsService.updatePreferences({ theme: darkMode ? 'light' : 'dark' })
    } catch {}
  }

  // Resolve URL da foto — pode ser blob (preview local) ou path do servidor
  const avatarSrc = profileImage
    ? profileImage.startsWith('blob:') || profileImage.startsWith('http')
      ? profileImage
      : `${BASE_URL}${profileImage}`
    : null

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Configurações</h1>
        <p>Gerencie sua conta e preferências</p>
      </div>

      <div className="settings-grid">

        {/* Perfil */}
        <div className="settings-card">
          <div className="settings-card-header">
            <User size={20} />
            <h3>Perfil</h3>
          </div>
          <form onSubmit={handleSaveProfile}>

            {/* Avatar */}
            <div className="avatar-upload">
              <div className="avatar-preview">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Foto de perfil"
                    className="avatar-img"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                  />
                ) : null}
                <div className="avatar-placeholder" style={{ display: avatarSrc ? 'none' : 'flex' }}>
                  {user?.name?.charAt(0).toUpperCase() || <User size={32} />}
                </div>
                <button
                  type="button"
                  className={`avatar-camera-btn ${avatarLoading ? 'loading' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading}
                  title="Alterar foto"
                >
                  {avatarLoading ? '...' : <Camera size={14} />}
                </button>
              </div>
              <div className="avatar-info">
                <button
                  type="button"
                  className="avatar-change-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading}
                >
                  {avatarLoading ? 'Enviando...' : 'Alterar foto'}
                </button>
                <p className="avatar-hint">JPG, PNG ou WEBP · máx. 2MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>

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
                <input type="email" value={user?.email || ''} disabled />
              </div>
              <span className="field-hint">O e-mail não pode ser alterado</span>
            </div>

            {profileMsg.text && (
              <p className={profileMsg.error ? 'error-msg' : 'success-msg'}>{profileMsg.text}</p>
            )}
            <button type="submit" className="btn-save" disabled={profileLoading}>
              <Save size={16} />
              {profileLoading ? 'Salvando...' : 'Salvar perfil'}
            </button>
          </form>
        </div>

        {/* Segurança */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Lock size={20} />
            <h3>Segurança</h3>
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
                  placeholder="Mínimo 8 caracteres"
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
            {passwordMsg.text && (
              <p className={passwordMsg.error ? 'error-msg' : 'success-msg'}>{passwordMsg.text}</p>
            )}
            <button type="submit" className="btn-save" disabled={passwordLoading}>
              <Save size={16} />
              {passwordLoading ? 'Salvando...' : 'Alterar senha'}
            </button>
          </form>
        </div>

        {/* Notificações */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Bell size={20} />
            <h3>Notificações {notifLoading && <span className="saving-indicator">salvando...</span>}</h3>
          </div>
          <div className="toggle-list">
            {[
              { key: 'email',      label: 'Notificações por e-mail',  desc: 'Receba alertas sobre suas análises' },
              { key: 'analysis',   label: 'Alertas de análise',        desc: 'Notificações de conteúdo de alto risco' },
              { key: 'security',   label: 'Alertas de segurança',      desc: 'Avisos sobre novos golpes detectados' },
              { key: 'newsletter', label: 'Newsletter',                 desc: 'Receba dicas semanais de segurança' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="toggle-item">
                <div className="toggle-info">
                  <span className="toggle-label">{label}</span>
                  <span className="toggle-desc">{desc}</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={e => handleNotifChange(key, e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Aparência */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Palette size={20} />
            <h3>Aparência</h3>
          </div>
          <div className="toggle-list">
            <div className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-label">Modo escuro</span>
                <span className="toggle-desc">Alterne entre tema claro e escuro</span>
              </div>
              <label className="switch">
                <input type="checkbox" checked={darkMode} onChange={handleThemeToggle} />
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
                <span>Confiável</span>
              </div>
              <div className="swatch-labeled">
                <div className="swatch" style={{ background: '#F59E0B' }}></div>
                <span>Suspeito</span>
              </div>
              <div className="swatch-labeled">
                <div className="swatch" style={{ background: '#EF4444' }}></div>
                <span>Alto Risco</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
