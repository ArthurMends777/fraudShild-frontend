import { createContext, useState, useEffect } from 'react'
import { api } from '../services/api'

export const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fraudshield_user')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('fraudshield_token') || null
  })

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('fraudshield_darkmode')
    return saved !== null ? JSON.parse(saved) : true
  })

  const [analysisHistory, setAnalysisHistory] = useState(() => {
    const saved = localStorage.getItem('fraudshield_history')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem('fraudshield_token', token)
    } else {
      delete api.defaults.headers.common['Authorization']
      localStorage.removeItem('fraudshield_token')
    }
  }, [token])

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-mode')
    } else {
      document.body.classList.add('light-mode')
    }
    localStorage.setItem('fraudshield_darkmode', JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    if (user) {
      localStorage.setItem('fraudshield_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('fraudshield_user')
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('fraudshield_history', JSON.stringify(analysisHistory))
  }, [analysisHistory])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const updateUserName = (newName) => {
    setUser(prev => prev ? { ...prev, name: newName } : null)
  }

  const addAnalysis = (analysis) => {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...analysis
    }
    setAnalysisHistory(prev => [entry, ...prev])
    return entry
  }

  const clearHistory = () => {
    setAnalysisHistory([])
  }

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <AppContext.Provider value={{
      user,
      token,
      login,
      logout,
      updateUserName,
      darkMode,
      toggleDarkMode,
      analysisHistory,
      addAnalysis,
      clearHistory
    }}>
      {children}
    </AppContext.Provider>
  )
}