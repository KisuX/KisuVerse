import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch, fromMediaCard, tmdbImage } from '../api'
import { useAuth } from '../AuthContext'
import { useLanguage } from '../LanguageContext'
import MovieGrid from '../components/MovieGrid'
import { IconSearch } from '../components/icons'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 60 }, (_, i) => currentYear + 2 - i)

function SearchPage() {
  const { token } = useAuth()
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [genreId, setGenreId] = useState('')
  const [year, setYear] = useState('')
  const [minRating, setMinRating] = useState('')
  const [sortBy, setSortBy] = useState('TitleAsc')
  const [genres, setGenres] = useState([])
  const [movies, setMovies] = useState([])
  const [people, setPeople] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadGenres() {
      const response = await apiFetch('/media/genres', null)
      if (response.ok) setGenres(await response.json())
    }
    loadGenres()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [query, genreId, year, minRating, sortBy])

  useEffect(() => {
    async function load() {
      setLoading(true)

      const params = new URLSearchParams()
      params.set('query', query)
      params.set('sortBy', sortBy)
      params.set('page', String(page))
      params.set('pageSize', '20')
      if (genreId) params.set('genreId', genreId)
      if (year) params.set('year', year)
      if (minRating) params.set('minRating', minRating)

      const [mediaRes, peopleRes] = await Promise.all([
        apiFetch(`/media/search?${params.toString()}`, token),
        query.trim().length >= 2 ? apiFetch(`/person/search?query=${encodeURIComponent(query)}`, token) : null
      ])

      setLoading(false)

      if (mediaRes.ok) {
        const data = await mediaRes.json()
        setMovies(data.Items.map(fromMediaCard))
        setTotalPages(data.TotalPages)
      }

      if (peopleRes && peopleRes.ok) {
        setPeople(await peopleRes.json())
      } else {
        setPeople([])
      }
    }

    load()
  }, [query, genreId, year, minRating, sortBy, page, token])

  const selectClass = 'border rounded-lg px-3 py-2 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-primary/30'

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl text-primary mb-6 tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
        {t('search.title')}
      </h1>

      <div className="flex flex-col gap-3 mb-8">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={18} height={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('nav.searchPlaceholder')}
            className="w-full border rounded-full pl-10 pr-4 py-2.5 bg-cream focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select value={genreId} onChange={(e) => setGenreId(e.target.value)} className={selectClass}>
            <option value="">{t('search.allGenres')}</option>
            {genres.map((g) => (
              <option key={g.Id} value={g.Id}>{g.Name}</option>
            ))}
          </select>

          <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
            <option value="">{t('search.allYears')}</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select value={minRating} onChange={(e) => setMinRating(e.target.value)} className={selectClass}>
            <option value="">{t('search.anyRating')}</option>
            {[9, 8, 7, 6, 5].map((r) => (
              <option key={r} value={r}>{r}+</option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
            <option value="TitleAsc">{t('search.sortTitle')}</option>
            <option value="RatingDesc">{t('search.sortRating')}</option>
            <option value="ReleaseDateDesc">{t('search.sortNewest')}</option>
          </select>
        </div>
      </div>

      {people.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl text-primary mb-3" style={{ fontFamily: 'var(--font-display)' }}>{t('search.people')}</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {people.slice(0, 10).map((p) => (
              <Link to={`/person/${p.Id}`} key={p.Id} className="min-w-[90px] text-center flex-shrink-0 group">
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gray-200 shadow group-hover:ring-2 group-hover:ring-primary transition">
                  {p.ProfileImagePath ? (
                    <img src={tmdbImage(p.ProfileImagePath, 'w200')} alt={p.Name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">?</div>
                  )}
                </div>
                <p className="text-xs font-medium mt-1.5 text-primary-dark group-hover:text-primary truncate">{p.Name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

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

export default SearchPage
