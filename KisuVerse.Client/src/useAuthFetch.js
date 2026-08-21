import { useCallback } from 'react'
import { useAuth } from './AuthContext'
import { apiFetch, refreshAccessToken } from './api'

export function useAuthFetch() {
  const { token, refreshToken, updateTokens, logout } = useAuth()

  return useCallback(async (path, options = {}) => {
    let response = await apiFetch(path, token, options)

    if (response.status === 401 && refreshToken) {
      const refreshed = await refreshAccessToken(refreshToken)

      if (!refreshed) {
        logout()
        return response
      }

      updateTokens(refreshed.Token, refreshed.RefreshToken)
      response = await apiFetch(path, refreshed.Token, options)
    }

    return response
  }, [token, refreshToken, updateTokens, logout])
}
