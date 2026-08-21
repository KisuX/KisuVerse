import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useLanguage } from '../LanguageContext'
import { useHomeFeed } from '../useHomeFeed'
import { apiFetch, fromMediaCard } from '../api'
import MovieRow from '../components/MovieRow'
import { IconPlay } from '../components/icons'
import logoBg from '../assets/bg-kisuverse.png'

function HomePage() {
  const { t } = useLanguage()
  const { token } = useAuth()
  const { topRated, comingSoon, popular, genres, loading } = useHomeFeed()

  const [recentlyAdded, setRecentlyAdded] = useState([])
  const [extraLoading, setExtraLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setExtraLoading(true)
      const response = await apiFetch('/media/search?query=&sortBy=RecentlyAddedDesc&pageSize=12', token)
      setExtraLoading(false)
      if (response.ok) setRecentlyAdded((await response.json()).Items.map(fromMediaCard))
    }

    load()
  }, [token])

  const featured = useMemo(() => {
    const withBackdrop = topRated.filter((m) => m.backdropUrl)
    if (withBackdrop.length === 0) return null
    return withBackdrop[Math.floor(Math.random() * withBackdrop.length)]
  }, [topRated])

  return (
    <div>
      <section className="relative overflow-hidden rounded-2xl mb-12 h-64 sm:h-80 flex items-end">
        {featured ? (
          <img src={featured.backdropUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <img
            src={logoBg}
            alt=""
            className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[56rem] opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/50 to-transparent" />
        <div className="relative p-6 sm:p-8 text-cream max-w-xl">
          <p className="text-xs uppercase tracking-widest text-gold mb-1 font-semibold">
            {featured ? t('home.featured') : t('home.title')}
          </p>
          <h1 className="text-3xl sm:text-5xl tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
            {featured ? featured.title : t('home.subtitle')}
          </h1>
          {featured && (
            <Link
              to={`/movie/${featured.id}`}
              className="inline-flex items-center gap-1.5 mt-4 bg-gold text-primary-dark rounded-full px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
            >
              <IconPlay width={16} height={16} /> {t('home.viewDetails')}
            </Link>
          )}
        </div>
      </section>

      <MovieRow title={t('home.popular')} movies={popular} loading={loading} />
      <MovieRow title={t('home.topRated')} movies={topRated} loading={loading} linkTo="/top-rated" />
      <MovieRow title={t('home.recentlyAdded')} movies={recentlyAdded} loading={extraLoading} />
      <MovieRow title={t('home.comingSoon')} movies={comingSoon} loading={loading} linkTo="/coming-soon" />

      <section>
        <h2 className="text-2xl text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>{t('home.categories')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {genres.map((genre) => (
            <Link
              key={genre.Id}
              to={`/category/${genre.Id}`}
              className="bg-primary-dark text-cream rounded-xl px-4 py-5 text-center font-medium hover:bg-primary transition tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {genre.Name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
