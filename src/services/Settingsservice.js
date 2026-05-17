import { api } from './api'

function compressImage(file, maxSize = 800, quality = 0.85) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        if (width > height) { height = Math.round((height * maxSize) / width); width = maxSize }
        else { width = Math.round((width * maxSize) / height); height = maxSize }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => resolve(blob), file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality)
    }
    img.src = url
  })
}

export const settingsService = {
  async getProfile() {
    const { data } = await api.get('/settings/profile')
    return data
  },

  async updateProfile({ name, profileImage, digitalLevel }) {
    const { data } = await api.put('/settings/profile', { name, profileImage, digitalLevel })
    return data
  },

  async uploadAvatar(file) {
    const compressed = await compressImage(file, 800, 0.85)
    const formData = new FormData()
    formData.append('avatar', compressed, file.name)
    const { data } = await api.post('/settings/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async changePassword({ currentPassword, newPassword }) {
    const { data } = await api.put('/settings/password', { currentPassword, newPassword })
    return data
  },

  async updatePreferences(prefs) {
    // prefs: { theme?, notifEmail?, notifAnalysis?, notifSecurity?, notifNewsletter? }
    const { data } = await api.put('/settings/preferences', prefs)
    return data
  },
}