import { api } from './api'

export const settingsService = {
  async getProfile() {
    const { data } = await api.get('/settings/profile')
    return data
  },

  async updateProfile({ name, profileImage, digitalLevel }) {
    const { data } = await api.put('/settings/profile', { name, profileImage, digitalLevel })
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