import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { getRolesFromToken, getUserIdFromToken } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'))

  const login = useCallback((authResponse) => {
    localStorage.setItem('token', authResponse.Token)
    localStorage.setItem('refreshToken', authResponse.RefreshToken)
    setToken(authResponse.Token)
    setRefreshToken(authResponse.RefreshToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setToken(null)
    setRefreshToken(null)
  }, [])

  const updateTokens = useCallback((newToken, newRefreshToken) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('refreshToken', newRefreshToken)
    setToken(newToken)
    setRefreshToken(newRefreshToken)
  }, [])

  const isAdmin = useMemo(() => getRolesFromToken(token).includes('Admin'), [token])
  const userId = useMemo(() => getUserIdFromToken(token), [token])

  return (
    <AuthContext.Provider value={{ token, refreshToken, userId, isAdmin, login, logout, updateTokens }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
