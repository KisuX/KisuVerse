import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiFetch } from '../api'
import { useAuth } from '../AuthContext'
import { useLanguage } from '../LanguageContext'
import { IconFilm } from '../components/icons'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useLanguage()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const response = await apiFetch('/auth/login', null, {
      method: 'POST',
      body: JSON.stringify({ Email: email, Password: password })
    })

    setLoading(false)

    if (!response.ok) {
      setError(t('auth.loginError'))
      return
    }

    const data = await response.json()
    login(data)
    navigate('/')
  }

  return (
    <div className="max-w-sm mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8">
      <div className="flex flex-col items-center mb-6">
        <IconFilm className="text-primary" width={32} height={32} />
        <h1 className="text-2xl text-primary mt-2" style={{ fontFamily: 'var(--font-display)' }}>{t('auth.loginTitle')}</h1>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.email')}
          className="border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.password')}
          className="border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white rounded-lg px-3 py-2.5 font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? t('auth.loggingIn') : t('auth.loginButton')}
        </button>
        <Link to="/register" className="text-sm text-secondary text-center hover:underline mt-1">{t('auth.noAccount')}</Link>
      </form>
    </div>
  )
}

export default LoginPage
