import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiFetch } from '../api'
import { useLanguage } from '../LanguageContext'
import { IconFilm } from '../components/icons'

function RegisterPage() {
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const response = await apiFetch('/auth/register', null, {
      method: 'POST',
      body: JSON.stringify({ Email: email, DisplayName: displayName, Password: password })
    })

    setLoading(false)

    if (!response.ok) {
      setError(t('auth.registerError'))
      return
    }

    navigate('/login')
  }

  return (
    <div className="max-w-sm mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8">
      <div className="flex flex-col items-center mb-6">
        <IconFilm className="text-primary" width={32} height={32} />
        <h1 className="text-2xl text-primary mt-2" style={{ fontFamily: 'var(--font-display)' }}>{t('auth.registerTitle')}</h1>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder={t('auth.displayName')}
          maxLength={30}
          className="border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
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
          {loading ? t('auth.registering') : t('auth.registerButton')}
        </button>
        <Link to="/login" className="text-sm text-secondary text-center hover:underline mt-1">{t('auth.haveAccount')}</Link>
      </form>
    </div>
  )
}

export default RegisterPage
