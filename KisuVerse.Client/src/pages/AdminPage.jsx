import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuthFetch } from '../useAuthFetch'
import { useLanguage } from '../LanguageContext'
import Spinner from '../components/Spinner'
import ConfirmDialog from '../components/ConfirmDialog'

const TABS = ['stats', 'users', 'media', 'reviews']

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 text-center">
      <p className="text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  )
}

function AdminPage() {
  const authFetch = useAuthFetch()
  const { t } = useLanguage()
  const [tab, setTab] = useState('stats')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [media, setMedia] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingDelete, setPendingDelete] = useState(null)

  const loadTab = useCallback(async (activeTab) => {
    setLoading(true)

    if (activeTab === 'stats') {
      const res = await authFetch('/admin/stats')
      if (res.ok) setStats(await res.json())
    } else if (activeTab === 'users') {
      const res = await authFetch('/admin/users')
      if (res.ok) setUsers(await res.json())
    } else if (activeTab === 'media') {
      const res = await authFetch('/media')
      if (res.ok) setMedia(await res.json())
    } else if (activeTab === 'reviews') {
      const res = await authFetch('/admin/reviews')
      if (res.ok) setReviews(await res.json())
    }

    setLoading(false)
  }, [authFetch])

  useEffect(() => {
    loadTab(tab)
  }, [tab, loadTab])

  async function confirmDelete() {
    if (!pendingDelete) return

    if (pendingDelete.type === 'media') {
      const res = await authFetch(`/admin/media/${pendingDelete.id}`, { method: 'DELETE' })
      if (res.ok) setMedia((prev) => prev.filter((m) => m.Id !== pendingDelete.id))
    } else if (pendingDelete.type === 'review') {
      const res = await authFetch(`/admin/reviews/${pendingDelete.id}`, { method: 'DELETE' })
      if (res.ok) setReviews((prev) => prev.filter((r) => r.Id !== pendingDelete.id))
    }

    setPendingDelete(null)
  }

  return (
    <div>
      <h1 className="text-3xl text-primary mb-6" style={{ fontFamily: 'var(--font-display)' }}>{t('admin.title')}</h1>

      <div className="flex gap-2 mb-6 border-b overflow-x-auto">
        {TABS.map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition ${tab === key ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-primary'}`}
          >
            {t(`admin.tab.${key}`)}
          </button>
        ))}
      </div>

      {loading && <Spinner />}

      {!loading && tab === 'stats' && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard label={t('admin.stats.users')} value={stats.TotalUsers} />
          <StatCard label={t('admin.stats.movies')} value={stats.TotalMovies} />
          <StatCard label={t('admin.stats.reviews')} value={stats.TotalReviews} />
          <StatCard label={t('admin.stats.favorites')} value={stats.TotalFavorites} />
          <StatCard label={t('admin.stats.watchlist')} value={stats.TotalWatchlist} />
          <StatCard label={t('admin.stats.watched')} value={stats.TotalWatched} />
        </div>
      )}

      {!loading && tab === 'users' && (
        users.length === 0 ? <p className="text-gray-500">{t('admin.empty')}</p> : (
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="p-3">{t('admin.users.email')}</th>
                  <th className="p-3">{t('admin.users.joined')}</th>
                  <th className="p-3">{t('admin.users.roles')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.Id} className="border-b last:border-0">
                    <td className="p-3 text-primary-dark">{u.Email}</td>
                    <td className="p-3 text-gray-500">{new Date(u.CreatedAt).toLocaleDateString('en-US')}</td>
                    <td className="p-3">
                      {u.Roles.length > 0 ? u.Roles.join(', ') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {!loading && tab === 'media' && (
        media.length === 0 ? <p className="text-gray-500">{t('admin.empty')}</p> : (
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {media.map((m) => (
                  <tr key={m.Id} className="border-b last:border-0">
                    <td className="p-3">
                      <Link to={`/movie/${m.Id}`} className="text-primary-dark font-medium hover:text-primary hover:underline">
                        {m.Title}
                      </Link>
                    </td>
                    <td className="p-3 text-gray-500">{m.ReleaseDate}</td>
                    <td className="p-3 text-gold">★ {m.Rating?.toFixed(1)}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setPendingDelete({ type: 'media', id: m.Id })}
                        className="text-red-600 hover:underline text-xs font-medium"
                      >
                        {t('admin.media.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {!loading && tab === 'reviews' && (
        reviews.length === 0 ? <p className="text-gray-500">{t('admin.empty')}</p> : (
          <div className="flex flex-col gap-3">
            {reviews.map((r) => (
              <div key={r.Id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link to={`/movie/${r.MediaId}`} className="font-semibold text-primary-dark hover:text-primary hover:underline">
                      {r.MediaTitle}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {r.DisplayName} · ★ {r.Rating} · {new Date(r.CreatedAt).toLocaleDateString('en-US')}
                    </p>
                  </div>
                  <button
                    onClick={() => setPendingDelete({ type: 'review', id: r.Id })}
                    className="text-red-600 hover:underline text-xs font-medium flex-shrink-0"
                  >
                    {t('admin.media.delete')}
                  </button>
                </div>
                <p className="text-sm text-gray-700 mt-2">{r.Comment}</p>
              </div>
            ))}
          </div>
        )
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title={pendingDelete?.type === 'media' ? t('admin.confirmDeleteMediaTitle') : t('admin.confirmDeleteReviewTitle')}
        message={pendingDelete?.type === 'media' ? t('admin.confirmDeleteMediaMessage') : t('admin.confirmDeleteReviewMessage')}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}

export default AdminPage
