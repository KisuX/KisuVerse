import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthFetch } from '../useAuthFetch'
import { useAuth } from '../AuthContext'
import { useLanguage } from '../LanguageContext'
import ConfirmDialog from '../components/ConfirmDialog'
import Spinner from '../components/Spinner'
import { IconUser, IconHeart, IconBookmark, IconCheck } from '../components/icons'

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-cream rounded-xl shadow p-4 flex items-center gap-3">
      <div className="text-gold">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-primary-dark">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  )
}

function ProfilePage() {
  const authFetch = useAuthFetch()
  const { logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [deleteError, setDeleteError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      const response = await authFetch('/profile')
      setLoading(false)
      if (!response.ok) return
      setProfile(await response.json())
    }

    loadProfile()
  }, [authFetch])

  async function handleChangePassword(e) {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')
    setPasswordLoading(true)

    const response = await authFetch('/profile/password', {
      method: 'PUT',
      body: JSON.stringify({ CurrentPassword: currentPassword, NewPassword: newPassword })
    })

    setPasswordLoading(false)

    if (!response.ok) {
      const errors = await response.json().catch(() => null)
      setPasswordError(Array.isArray(errors) ? errors.join(' ') : t('profile.passwordError'))
      return
    }

    setCurrentPassword('')
    setNewPassword('')
    setPasswordSuccess(t('profile.passwordSuccess'))
  }

  async function handleDeleteAccount() {
    setConfirmOpen(false)
    setDeleteError('')

    const response = await authFetch('/profile', { method: 'DELETE' })

    if (response.status === 409) {
      const message = await response.text()
      setDeleteError(message || t('profile.deleteConflict'))
      return
    }

    if (!response.ok) {
      setDeleteError(t('profile.deleteError'))
      return
    }

    logout()
    navigate('/')
  }

  if (loading) {
    return <Spinner />
  }

  if (!profile) {
    return <p className="text-center text-gray-500 py-16">{t('profile.loadError')}</p>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary-dark text-gold rounded-full p-3">
          <IconUser width={28} height={28} />
        </div>
        <div>
          <h1 className="text-2xl text-primary" style={{ fontFamily: 'var(--font-display)' }}>{profile.DisplayName}</h1>
          <p className="text-sm text-gray-500">{profile.Email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <StatCard icon={<IconCheck width={20} height={20} />} label={t('nav.watched')} value={profile.WatchedCount} />
        <StatCard icon={<IconHeart width={20} height={20} className="fill-current" />} label={t('nav.favorites')} value={profile.FavoriteCount} />
        <StatCard icon={<IconBookmark width={20} height={20} className="fill-current" />} label={t('nav.watchlist')} value={profile.WatchlistCount} />
        <StatCard icon={<IconUser width={20} height={20} />} label={t('profile.reviews')} value={profile.ReviewCount} />
      </div>

      <div className="bg-cream rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-bold text-primary-dark mb-4">{t('profile.changePassword')}</h2>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-3 max-w-sm">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={t('profile.currentPassword')}
            className="border rounded-lg px-3 py-2.5 bg-cream focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t('profile.newPassword')}
            className="border rounded-lg px-3 py-2.5 bg-cream focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
          {passwordSuccess && <p className="text-green-600 text-sm">{passwordSuccess}</p>}
          <button
            type="submit"
            disabled={passwordLoading}
            className="bg-primary text-white rounded-lg px-3 py-2.5 font-medium hover:opacity-90 transition disabled:opacity-60 self-start"
          >
            {passwordLoading ? t('profile.saving') : t('profile.savePassword')}
          </button>
        </form>
      </div>

      <div className="bg-cream rounded-xl shadow p-6 border border-red-200">
        <h2 className="text-lg font-bold text-red-600 mb-2">{t('profile.dangerZone')}</h2>
        <p className="text-sm text-gray-500 mb-4">{t('profile.deleteWarning')}</p>
        {deleteError && <p className="text-red-600 text-sm mb-3">{deleteError}</p>}
        <button
          onClick={() => setConfirmOpen(true)}
          className="px-4 py-2 text-sm rounded-full bg-red-600 text-white hover:opacity-90 transition"
        >
          {t('profile.deleteAccount')}
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={t('profile.deleteAccount')}
        message={t('profile.deleteConfirm')}
        onConfirm={handleDeleteAccount}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}

export default ProfilePage
