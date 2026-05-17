import { api } from './api'

export const authService = {
  async login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password })
    return data // { token, user }
  },

  async register({ name, email, password }) {
    const { data } = await api.post('/auth/register', { name, email, password })
    return data
  },

  async forgotPassword(email) {
    const { data } = await api.post('/auth/forgot-password', { email })
    return data
  },

  async resetPassword({ token, newPassword }) {
    const { data } = await api.post('/auth/reset-password', { token, newPassword })
    return data
  },
}