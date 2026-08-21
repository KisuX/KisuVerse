import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch, tmdbImage } from '../api'
import { useAuth } from '../AuthContext'
import { useAuthFetch } from '../useAuthFetch'
import { useLanguage } from '../LanguageContext'
import { IconSearch } from './icons'

function HeaderSearch({ onNavigate }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [importingId, setImportingId] = useState(null)
  const navigate = useNavigate()
  const { token } = useAuth()
  const authFetch = useAuthFetch()
  const { t } = useLanguage()

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    const timeout = setTimeout(async () => {
      const response = await apiFetch(`/media/tmdb-search?query=${encodeURIComponent(q)}`, null)
      setLoading(false)
      if (!response.ok) return
      const data = await response.json()
      setResults((data.results ?? []).slice(0, 8))
    }, 400)

    return () => clearTimeout(timeout)
  }, [query])

  async function handleSelect(movie) {
    if (!token) {
      setOpen(false)
      navigate('/login')
      onNavigate?.()
      return
    }

    setImportingId(movie.id)
    const response = await authFetch(`/media/tmdb-import/${movie.id}`, { method: 'POST' })
    setImportingId(null)

    if (!response.ok) return

    const media = await response.json()
    setQuery('')
    setResults([])
    setOpen(false)
    navigate(`/movie/${media.Id}`)
    onNavigate?.()
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/50" width={16} height={16} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={t('nav.searchPlaceholder')}
          className="w-full bg-white/10 focus:bg-white text-cream focus:text-gray-900 placeholder-cream/50 focus:placeholder-gray-400 rounded-full pl-9 pr-3 py-2 text-sm outline-none transition"
        />
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto z-40">
          {loading && <p className="text-sm text-gray-500 p-4">{t('search.searching')}</p>}
          {!loading && results.length === 0 && (
            <p className="text-sm text-gray-500 p-4">{t('search.noResults')}</p>
          )}
          {!loading && results.map((movie) => (
            <button
              key={movie.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(movie)}
              disabled={importingId === movie.id}
              className="w-full flex items-center gap-3 p-2.5 hover:bg-cream/50 transition text-left disabled:opacity-50"
            >
              {movie.poster_path ? (
                <img src={tmdbImage(movie.poster_path, 'w92')} alt="" className="w-9 h-[52px] object-cover rounded flex-shrink-0" />
              ) : (
                <div className="w-9 h-[52px] rounded bg-gray-200 flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-primary-dark truncate">{movie.title}</p>
                <p className="text-xs text-gray-500">{movie.release_date ? movie.release_date.slice(0, 4) : ''}</p>
              </div>
              {importingId === movie.id && <span className="text-xs text-gray-400 flex-shrink-0">{t('search.adding')}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default HeaderSearch
