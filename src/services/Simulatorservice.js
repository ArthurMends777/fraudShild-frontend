import { api } from './api'

export const simulatorService = {
  async startSession() {
    const { data } = await api.get('/simulator')
    return data 
  },

  async answer({ sessionId, scenarioId, answer }) {
    const { data } = await api.post('/simulator/answer', { sessionId, scenarioId, answer })
    return data 
  },

  async getStats() {
    const { data } = await api.get('/simulator/stats')
    return data 
  },
}