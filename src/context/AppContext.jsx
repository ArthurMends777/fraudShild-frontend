import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fraudshield_user')
    return saved ? JSON.parse(saved) : null
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

  const login = (name, email) => {
    setUser({ name, email })
  }

  const logout = () => {
    setUser(null)
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

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
