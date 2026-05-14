import { api } from './api'

export const historyService = {
  async getHistory({ search, type, result, page = 1, limit = 10 } = {}) {
    const params = {}
    if (search) params.search = search
    if (type && type !== 'all')   params.type   = type
    if (result && result !== 'all') params.result = result
    params.page  = page
    params.limit = limit

    const { data } = await api.get('/history', { params })
    return data // { items, summary, pagination }
  },

  async clearHistory() {
    const { data } = await api.delete('/history')
    return data
  },
}