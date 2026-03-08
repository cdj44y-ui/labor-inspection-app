const AUTH_TOKEN_KEY = 'labor_auth_token'
const AUTH_USER_KEY = 'labor_auth_user'
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export function getToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    return null
  }
}

export function getUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setAuth(token, user) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

export function authFetch(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (token) headers.Authorization = `Bearer ${token}`
  return fetch(`${API_BASE}${path}`, { ...options, headers })
}

export { API_BASE }
