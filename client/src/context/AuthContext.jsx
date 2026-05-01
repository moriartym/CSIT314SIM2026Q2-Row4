import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [userAccount, setUserAccount] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3001/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.success) setUserAccount(data.data)
        else setUserAccount(null)
      })
      .catch(() => setUserAccount(null))
      .finally(() => setLoading(false))
  }, [])

  const login = (userData) => setUserAccount(userData)

  const logout = async () => {
    await fetch('http://localhost:3001/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    setUserAccount(null)
  }

  return (
    <AuthContext.Provider value={{ userAccount, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
