import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { apiFetch, fromMediaCard } from '../api'
import { useAuth } from '../AuthContext'
import { useLanguage } from '../LanguageContext'
import { useHomeFeed } from '../useHomeFeed'
import MovieRow from '../components/MovieRow'
import MovieGrid from '../components/MovieGrid'

function CategoryPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const { t } = useLanguage()
  const { topRated, comingSoon, popular, genres, loading } = useHomeFeed(id)

  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [gridLoading, setGridLoading] = useState(true)

  const genreName = genres.find((g) => String(g.Id) === id)?.Name

  const heroBackdrop = useMemo(() => {
    const withBackdrop = topRated.filter((m) => m.backdropUrl)
    if (withBackdrop.length === 0) return null
    return withBackdrop[Math.floor(Math.random() * withBackdrop.length)].backdropUrl
  }, [topRated])

  useEffect(() => {
    setPage(1)
  }, [id])

  useEffect(() => {
    async function loadAll() {
      setGridLoading(true)
      const response = await apiFetch(`/media/search?query=&genreId=${id}&page=${page}&pageSize=20&sortBy=TitleAsc`, token)
      setGridLoading(false)
      if (!response.ok) return
      const data = await response.json()
      setMovies(data.Items.map(fromMediaCard))
      setTotalPages(data.TotalPages)
    }

    loadAll()
  }, [id, page, token])

  return (
    <div>
      <section className="relative overflow-hidden mb-8 rounded-2xl h-40 sm:h-56 flex items-end">
        {heroBackdrop && (
          <img src={heroBackdrop} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/50 to-cream/10" />
        <h1 className="relative text-3xl sm:text-4xl text-primary tracking-wide p-2" style={{ fontFamily: 'var(--font-display)' }}>
          {genreName || t('category.fallback')}
        </h1>
      </section>

      <MovieRow title={t('home.popular')} movies={popular} loading={loading} />
      <MovieRow title={t('home.topRated')} movies={topRated} loading={loading} />
      <MovieRow title={t('home.comingSoon')} movies={comingSoon} loading={loading} />

      <section>
        <h2 className="text-2xl text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>{t('category.all')}</h2>
        <MovieGrid movies={movies} emptyMessage={t('category.empty')} loading={gridLoading} />

        {totalPages > 1 && !gridLoading && (
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
      </section>
    </div>
  )
}

export default CategoryPage
