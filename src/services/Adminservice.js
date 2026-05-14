import { api } from './api'

export const adminService = {
  async getStats() {
    const { data } = await api.get('/admin/stats')
    return data // { stats, byType, userStatus, recentActivity }
  },

  async getUsers({ search, role, page = 1, limit = 10 } = {}) {
    const params = { page, limit }
    if (search) params.search = search
    if (role && role !== 'all') params.role = role
    const { data } = await api.get('/admin/users', { params })
    return data // { users, pagination }
  },

  async updateUserRole(userId, role) {
    const { data } = await api.put(`/admin/users/${userId}/role`, { role })
    return data
  },

  async deleteUser(userId) {
    const { data } = await api.delete(`/admin/users/${userId}`)
    return data
  },
}