import { useState, useEffect, useRef } from 'react'
import { apiFetch, fromMediaCard } from '../api'
import { useAuth } from '../AuthContext'
import { useLanguage } from '../LanguageContext'
import MovieGrid from './MovieGrid'

function PaginatedMovieList({ title, queryString }) {
  const { token } = useAuth()
  const { t } = useLanguage()
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [heroBackdrop, setHeroBackdrop] = useState(null)
  const heroPickedRef = useRef(false)

  useEffect(() => {
    setPage(1)
    setHeroBackdrop(null)
    heroPickedRef.current = false
  }, [queryString])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const response = await apiFetch(`/media/search?${queryString}&page=${page}&pageSize=20`, token)
      setLoading(false)
      if (!response.ok) return
      const data = await response.json()
      const items = data.Items.map(fromMediaCard)
      setMovies(items)
      setTotalPages(data.TotalPages)

      if (!heroPickedRef.current) {
        const withBackdrop = items.filter((m) => m.backdropUrl)
        if (withBackdrop.length > 0) {
          setHeroBackdrop(withBackdrop[Math.floor(Math.random() * withBackdrop.length)].backdropUrl)
          heroPickedRef.current = true
        }
      }
    }

    load()
  }, [queryString, page, token])

  return (
    <div>
      <section className="relative overflow-hidden mb-8 rounded-2xl h-40 sm:h-56 flex items-end">
        {heroBackdrop && (
          <img src={heroBackdrop} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/50 to-cream/10" />
        <h1 className="relative text-3xl sm:text-4xl text-primary tracking-wide p-2" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h1>
      </section>

      <MovieGrid movies={movies} emptyMessage={t('grid.empty')} loading={loading} />

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

export default PaginatedMovieList
