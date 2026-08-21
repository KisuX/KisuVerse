const API_BASE = 'http://localhost:5160/api'

export async function apiFetch(path, token, options = {}) {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  }

  return fetch(`${API_BASE}${path}`, { ...options, headers })
}

export async function refreshAccessToken(refreshToken) {
  const response = await apiFetch('/auth/refresh', null, {
    method: 'POST',
    body: JSON.stringify({ RefreshToken: refreshToken })
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
const USER_ID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'

export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function getRolesFromToken(token) {
  if (!token) return []
  const payload = decodeJwt(token)
  if (!payload) return []
  const roles = payload[ROLE_CLAIM]
  if (!roles) return []
  return Array.isArray(roles) ? roles : [roles]
}

export function getUserIdFromToken(token) {
  if (!token) return null
  const payload = decodeJwt(token)
  if (!payload) return null
  const id = payload[USER_ID_CLAIM]
  return id ? Number(id) : null
}

export function tmdbImage(path, size = 'w342') {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : ''
}

export function fromMediaList(m) {
  return {
    id: m.Id,
    title: m.Title,
    posterUrl: m.PosterUrl,
    subtitle: m.ReleaseDate,
    rating: m.Rating
  }
}

export function fromMediaCard(m) {
  return {
    id: m.Id,
    title: m.Title,
    posterUrl: tmdbImage(m.PosterPath),
    backdropUrl: tmdbImage(m.BackdropPath, 'original'),
    subtitle: m.ReleaseYear ?? '',
    rating: m.AverageRating ?? 0
  }
}
