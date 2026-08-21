import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api'
import { useLanguage } from '../LanguageContext'
import Spinner from '../components/Spinner'
import logoBg from '../assets/bg-kisuverse.png'

function CategoriesPage() {
  const { t } = useLanguage()
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const response = await apiFetch('/media/genres', null)
      setLoading(false)
      if (!response.ok) return
      setGenres(await response.json())
    }

    load()
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <div>
      <section className="relative overflow-hidden mb-10 text-center py-6">
        <img
          src={logoBg}
          alt=""
          className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[56rem] opacity-80"
        />
        <h1 className="relative text-3xl sm:text-4xl text-primary tracking-wide mt-16" style={{ fontFamily: 'var(--font-display)' }}>
          {t('categories.title')}
        </h1>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.Id}
            to={`/category/${genre.Id}`}
            className="bg-primary-dark text-cream rounded-xl px-4 py-8 text-center text-lg tracking-wide hover:bg-primary transition"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {genre.Name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoriesPage
