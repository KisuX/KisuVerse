import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiFetch, tmdbImage } from '../api'
import { useLanguage } from '../LanguageContext'
import Spinner from '../components/Spinner'
import MovieGrid from '../components/MovieGrid'
import MovieRow from '../components/MovieRow'
import { IconArrowLeft, IconCalendar, IconMapPin } from '../components/icons'

const KNOWN_DEPARTMENTS = ['Acting', 'Directing', 'Writing', 'Production']

function dedupeCredits(items) {
  const seen = new Set()
  return items
    .filter((m) => {
      const key = `${m.MediaId}-${m.Department}-${m.Job || ''}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((m) => ({
      id: m.MediaId,
      title: m.Title,
      posterUrl: m.PosterUrl,
      role: m.Character || m.Job || '',
      rating: m.AverageRating || 0,
      releaseDate: m.ReleaseDate,
      department: m.Department || 'Other'
    }))
}

function mergeCreditsByMovie(items) {
  const map = new Map()
  for (const c of items) {
    const existing = map.get(c.id)
    if (existing) {
      if (c.role && !existing.roles.includes(c.role)) existing.roles.push(c.role)
    } else {
      map.set(c.id, { ...c, roles: c.role ? [c.role] : [] })
    }
  }
  return [...map.values()].map((c) => {
    const year = c.releaseDate ? new Date(c.releaseDate).getFullYear() : null
    const roleText = c.roles.join(', ')
    return {
      ...c,
      subtitle: roleText && year ? `${roleText} · ${year}` : roleText || year || ''
    }
  })
}

function calculateAge(birthday, deathDay) {
  if (!birthday) return null
  const start = new Date(birthday)
  const end = deathDay ? new Date(deathDay) : new Date()
  let age = end.getFullYear() - start.getFullYear()
  const monthDiff = end.getMonth() - start.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < start.getDate())) {
    age -= 1
  }
  return age
}

function PersonDetailPage() {
  const { id } = useParams()
  const { t } = useLanguage()
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const response = await apiFetch(`/person/${id}`, null)
      setLoading(false)
      if (!response.ok) {
        setPerson(null)
        return
      }
      setPerson(await response.json())
    }

    load()
  }, [id])

  useEffect(() => {
    setFilter('all')
    setSortBy('newest')
  }, [id])

  const credits = useMemo(() => (person ? dedupeCredits(person.Movies) : []), [person])

  const departmentCounts = useMemo(() => {
    const counts = {}
    credits.forEach((c) => {
      counts[c.department] = (counts[c.department] || 0) + 1
    })
    return counts
  }, [credits])

  const otherCount = Object.entries(departmentCounts)
    .filter(([dept]) => !KNOWN_DEPARTMENTS.includes(dept))
    .reduce((sum, [, count]) => sum + count, 0)

  const knownFor = useMemo(() => {
    return mergeCreditsByMovie(credits).sort((a, b) => b.rating - a.rating).slice(0, 10)
  }, [credits])

  const years = credits.map((c) => new Date(c.releaseDate).getFullYear()).filter((y) => y > 1900)
  const careerStart = years.length ? Math.min(...years) : null
  const careerEnd = years.length ? Math.max(...years) : null
  const age = person ? calculateAge(person.Birthday, person.DeathDay) : null

  const tabs = useMemo(() => {
    const list = [{ key: 'all', label: t('person.tab.all'), count: credits.length }]
    KNOWN_DEPARTMENTS.filter((d) => departmentCounts[d]).forEach((dept) => {
      list.push({ key: dept.toLowerCase(), label: t(`person.tab.${dept.toLowerCase()}`), count: departmentCounts[dept] })
    })
    if (otherCount > 0) {
      list.push({ key: 'other', label: t('person.tab.other'), count: otherCount })
    }
    return list
  }, [credits.length, departmentCounts, otherCount, t])

  const filmography = useMemo(() => {
    let list = credits
    if (filter === 'other') {
      list = list.filter((c) => !KNOWN_DEPARTMENTS.includes(c.department))
    } else if (filter !== 'all') {
      list = list.filter((c) => c.department.toLowerCase() === filter)
    }

    const sorted = mergeCreditsByMovie(list)
    if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate))
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title))
    } else {
      sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
    }
    return sorted
  }, [credits, filter, sortBy])

  if (loading) {
    return <Spinner />
  }

  if (!person) {
    return <p className="text-gray-500 text-center py-16">{t('person.notFound')}</p>
  }

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1 text-secondary hover:underline text-sm mb-4">
        <IconArrowLeft width={16} height={16} /> {t('detail.back')}
      </Link>

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-dark to-primary text-cream p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {person.ProfileImagePath ? (
            <img
              src={tmdbImage(person.ProfileImagePath, 'w300')}
              alt={person.Name}
              className="w-36 sm:w-48 rounded-xl shadow-xl ring-4 ring-gold/30 mx-auto sm:mx-0 flex-shrink-0"
            />
          ) : (
            <div className="w-36 sm:w-48 aspect-[2/3] rounded-xl bg-cream/10 ring-4 ring-gold/30 flex items-center justify-center text-cream/50 text-4xl mx-auto sm:mx-0 flex-shrink-0">?</div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>{person.Name}</h1>
            {person.KnownForDepartment && (
              <p className="text-gold text-xs font-semibold uppercase tracking-widest mt-1.5">{person.KnownForDepartment}</p>
            )}

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
              {KNOWN_DEPARTMENTS.filter((d) => departmentCounts[d]).map((dept) => (
                <span key={dept} className="bg-cream/10 border border-cream/20 text-cream text-xs font-medium px-3 py-1 rounded-full">
                  {departmentCounts[dept]} {t(`person.credits.${dept.toLowerCase()}`)}
                </span>
              ))}
              {otherCount > 0 && (
                <span className="bg-cream/10 border border-cream/20 text-cream text-xs font-medium px-3 py-1 rounded-full">
                  {otherCount} {t('person.credits.other')}
                </span>
              )}
              {careerStart && (
                <span className="bg-gold/20 border border-gold/30 text-gold text-xs font-medium px-3 py-1 rounded-full">
                  {t('person.active')} {careerStart}{careerEnd !== careerStart ? `–${careerEnd}` : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="bg-cream rounded-xl shadow p-5">
          <h3 className="text-xs font-bold text-primary-dark uppercase tracking-widest mb-3">{t('person.personalInfo')}</h3>
          {person.Birthday || person.PlaceOfBirth ? (
            <div className="space-y-3 text-sm text-gray-700">
              {person.Birthday && (
                <div className="flex items-start gap-2.5">
                  <IconCalendar width={17} height={17} className="text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{t('person.birthday')}</p>
                    <p className="font-medium text-primary-dark">
                      {person.Birthday}{person.DeathDay ? ` – ${person.DeathDay}` : ''}
                      {age != null && <span className="text-gray-500 font-normal"> ({age} {t('person.yearsOld')})</span>}
                    </p>
                  </div>
                </div>
              )}
              {person.PlaceOfBirth && (
                <div className="flex items-start gap-2.5">
                  <IconMapPin width={17} height={17} className="text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{t('person.placeOfBirth')}</p>
                    <p className="font-medium text-primary-dark">{person.PlaceOfBirth}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">{t('person.noInfo')}</p>
          )}
        </div>

        <div className="sm:col-span-2 bg-cream rounded-xl shadow p-5">
          <h3 className="text-xs font-bold text-primary-dark uppercase tracking-widest mb-3">{t('person.biography')}</h3>
          {person.Biography ? (
            <p className="text-gray-800 leading-relaxed">{person.Biography}</p>
          ) : (
            <p className="text-gray-400 italic text-sm">{t('person.noBiography')}</p>
          )}
        </div>
      </div>

      {knownFor.length > 0 && (
        <MovieRow title={t('person.knownFor')} movies={knownFor} />
      )}

      {credits.length > 0 ? (
        <div className="mt-4 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-2xl text-primary" style={{ fontFamily: 'var(--font-display)' }}>{t('person.filmography')}</h2>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="newest">{t('person.sortNewest')}</option>
              <option value="oldest">{t('person.sortOldest')}</option>
              <option value="rating">{t('search.sortRating')}</option>
              <option value="title">{t('search.sortTitle')}</option>
            </select>
          </div>

          {tabs.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    filter === tab.key
                      ? 'bg-primary text-white'
                      : 'bg-cream text-gray-600 border hover:bg-gray-50'
                  }`}
                >
                  {tab.label} <span className="opacity-70">({tab.count})</span>
                </button>
              ))}
            </div>
          )}

          <MovieGrid movies={filmography} emptyMessage={t('person.noMovies')} />
        </div>
      ) : (
        <p className="text-gray-500 mt-10">{t('person.noMovies')}</p>
      )}
    </div>
  )
}

export default PersonDetailPage
