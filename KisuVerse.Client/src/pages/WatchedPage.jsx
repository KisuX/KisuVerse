import { useState, useEffect, useMemo } from 'react'
import { tmdbImage } from '../api'
import { useAuthFetch } from '../useAuthFetch'
import { useLanguage } from '../LanguageContext'
import MovieGrid from '../components/MovieGrid'
import { IconCheck } from '../components/icons'

const PAGE_SIZE = 20

function fromWatchedMedia(m) {
  return {
    id: m.Id,
    title: m.Title,
    posterUrl: tmdbImage(m.PosterPath),
    subtitle: `Watched ${new Date(m.WatchedAt).toLocaleDateString()}`,
    rating: m.AverageRating ?? 0,
    watchedAt: m.WatchedAt
  }
}

function WatchedPage() {
  const authFetch = useAuthFetch()
  const { t } = useLanguage()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('watched')
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function fetchWatched() {
      setLoading(true)
      const response = await authFetch('/watched/mywatched')
      setLoading(false)
      if (!response.ok) return
      const data = await response.json()
      setMovies(data.map(fromWatchedMedia))
    }

    fetchWatched()
  }, [authFetch])

  useEffect(() => {
    setPage(1)
  }, [sortBy])

  const sortedMovies = useMemo(() => {
    const copy = [...movies]
    if (sortBy === 'title') {
      copy.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'rating') {
      copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    } else {
      copy.sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt))
    }
    return copy
  }, [movies, sortBy])

  const totalPages = Math.max(1, Math.ceil(sortedMovies.length / PAGE_SIZE))
  const pageMovies = sortedMovies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="flex items-center gap-2 text-3xl text-primary" style={{ fontFamily: 'var(--font-display)' }}>
          <IconCheck width={26} height={26} /> {t('watched.title')}
        </h1>

        {movies.length > 0 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="watched">{t('watched.sortWatched')}</option>
            <option value="title">{t('search.sortTitle')}</option>
            <option value="rating">{t('search.sortRating')}</option>
          </select>
        )}
      </div>

      <MovieGrid movies={pageMovies} emptyMessage={t('watched.empty')} loading={loading} />

      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-full border text-sm disabled:opacity-40 hover:bg-white transition"
          >
            {t('pagination.prev')}
          </button>
          <span className="text-sm text-gray-600">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-full border text-sm disabled:opacity-40 hover:bg-white transition"
          >
            {t('pagination.next')}
          </button>
        </div>
      )}
    </div>
  )
}

export default WatchedPage
