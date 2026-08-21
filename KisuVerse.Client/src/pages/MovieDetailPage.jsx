import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useAuthFetch } from '../useAuthFetch'
import { useLanguage } from '../LanguageContext'
import Spinner from '../components/Spinner'
import StarRating from '../components/StarRating'
import { IconArrowLeft, IconHeart, IconBookmark, IconCheck, IconPlay, IconStar } from '../components/icons'

function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function MovieDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, userId } = useAuth()
  const authFetch = useAuthFetch()
  const { t } = useLanguage()
  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [similar, setSimilar] = useState([])
  const [importingId, setImportingId] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [crewExpanded, setCrewExpanded] = useState(false)

  const loadMovie = useCallback(async () => {
    const response = await authFetch(`/media/${id}`)
    if (!response.ok) {
      setMovie(null)
      return
    }
    setMovie(await response.json())
  }, [id, authFetch])

  const loadReviews = useCallback(async () => {
    const response = await authFetch(`/reviews/${id}`)
    if (!response.ok) return
    setReviews(await response.json())
  }, [id, authFetch])

  const loadSimilar = useCallback(async () => {
    const response = await authFetch(`/media/${id}/similar`)
    if (!response.ok) return
    setSimilar(await response.json())
  }, [id, authFetch])

  useEffect(() => {
    loadMovie()
    loadReviews()
    loadSimilar()
  }, [loadMovie, loadReviews, loadSimilar])

  async function handleSimilarClick(tmdbId) {
    if (!token) {
      navigate('/login')
      return
    }

    setImportingId(tmdbId)
    const response = await authFetch(`/media/tmdb-import/${tmdbId}`, { method: 'POST' })
    setImportingId(null)

    if (!response.ok) return

    const imported = await response.json()
    navigate(`/movie/${imported.Id}`)
  }

  async function toggleFavorite() {
    const method = movie.IsFavorite ? 'DELETE' : 'POST'
    const response = await authFetch(`/media/${id}/favorite`, { method })
    if (response.ok) {
      setMovie((prev) => ({ ...prev, IsFavorite: !prev.IsFavorite }))
    }
  }

  async function toggleWatchlist() {
    const method = movie.IsInWatchlist ? 'DELETE' : 'POST'
    const response = await authFetch(`/watchlist/${id}`, { method })
    if (response.ok) {
      setMovie((prev) => ({ ...prev, IsInWatchlist: !prev.IsInWatchlist }))
    }
  }

  async function toggleWatched() {
    const method = movie.IsWatched ? 'DELETE' : 'POST'
    const response = await authFetch(`/watched/${id}`, { method })
    if (response.ok) {
      setMovie((prev) => ({ ...prev, IsWatched: !prev.IsWatched }))
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault()

    const path = editingReviewId ? `/reviews/${editingReviewId}` : `/reviews/${id}`
    const method = editingReviewId ? 'PUT' : 'POST'

    const response = await authFetch(path, {
      method,
      body: JSON.stringify({ Rating: Number(rating), Comment: comment })
    })

    if (response.ok) {
      setComment('')
      setRating(5)
      setEditingReviewId(null)
      loadReviews()
    }
  }

  function startEdit(review) {
    setEditingReviewId(review.Id)
    setRating(review.Rating)
    setComment(review.Comment)
  }

  async function deleteReview(reviewId) {
    const response = await authFetch(`/reviews/${reviewId}`, { method: 'DELETE' })
    if (response.ok) {
      setEditingReviewId(null)
      loadReviews()
    }
  }

  if (!movie) {
    return <Spinner label={t('detail.loadingMovie')} />
  }

  const myReview = reviews.find((r) => r.UserId === userId)
  const director = movie.Crew.find((c) => c.Job === 'Director')
  const otherCrew = movie.Crew.filter((c) => c.Job !== 'Director')

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1 text-secondary hover:underline text-sm mb-4">
        <IconArrowLeft width={16} height={16} /> {t('detail.back')}
      </Link>

      <div className="relative rounded-2xl overflow-hidden bg-primary-dark h-72 sm:h-[28rem] mb-[-88px] sm:mb-[-136px]">
        {movie.BackdropUrl && (
          <img src={movie.BackdropUrl} alt="" className="w-full h-full object-cover opacity-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/40 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-6 px-2">
        {movie.PosterUrl ? (
          <img
            src={movie.PosterUrl}
            alt={movie.Title}
            className="w-48 sm:w-72 rounded-xl shadow-2xl ring-4 ring-cream flex-shrink-0 mx-auto md:mx-0"
          />
        ) : (
          <div className="w-48 sm:w-72 aspect-[2/3] rounded-xl shadow-2xl ring-4 ring-cream flex-shrink-0 mx-auto md:mx-0 bg-gray-200 flex items-center justify-center text-gray-400 text-sm px-2 text-center">
            {movie.Title}
          </div>
        )}

        <div className="flex-1 pt-2 md:pt-24 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark" style={{ fontFamily: 'var(--font-display)' }}>
            {movie.Title}
          </h1>
          {movie.OriginalTitle && movie.OriginalTitle !== movie.Title && (
            <p className="text-gray-500 italic mt-1">{movie.OriginalTitle}</p>
          )}

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1 font-semibold text-gold bg-primary-dark/5 px-2 py-1 rounded">
              <IconStar width={14} height={14} className="fill-current" /> {movie.Rating.toFixed(1)}
            </span>
            <span>({movie.VoteCount} {t('detail.votes')})</span>
            <span>•</span>
            <span>{movie.ReleaseDate}</span>
            <span>•</span>
            <span>{movie.Duration} {t('detail.minutes')}</span>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
            {movie.Genres.map((genre) => (
              <span key={genre} className="bg-secondary/10 text-secondary text-xs font-medium px-3 py-1 rounded-full">
                {genre}
              </span>
            ))}
          </div>

          {director && (
            <p className="text-sm text-gray-600 mt-3">
              <strong className="text-primary-dark">{t('detail.director')}:</strong>{' '}
              <Link to={`/person/${director.Id}`} className="hover:text-primary hover:underline">{director.Name}</Link>
            </p>
          )}

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-5">
            {movie.TrailerUrl && (
              <a
                href={movie.TrailerUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium bg-primary-dark text-white rounded-full px-4 py-2 hover:opacity-90 transition"
              >
                <IconPlay width={16} height={16} /> {t('detail.trailer')}
              </a>
            )}

            {token && (
              <>
                <button
                  onClick={toggleFavorite}
                  className={`flex items-center gap-1.5 text-sm font-medium rounded-full px-4 py-2 border transition ${movie.IsFavorite ? 'bg-primary text-white border-primary' : 'border-primary text-primary hover:bg-primary/5'}`}
                >
                  <IconHeart width={16} height={16} className={movie.IsFavorite ? 'fill-current' : ''} />
                  {movie.IsFavorite ? t('detail.favorited') : t('detail.favorite')}
                </button>
                <button
                  onClick={toggleWatchlist}
                  className={`flex items-center gap-1.5 text-sm font-medium rounded-full px-4 py-2 border transition ${movie.IsInWatchlist ? 'bg-secondary text-white border-secondary' : 'border-secondary text-secondary hover:bg-secondary/5'}`}
                >
                  <IconBookmark width={16} height={16} className={movie.IsInWatchlist ? 'fill-current' : ''} />
                  {movie.IsInWatchlist ? t('detail.inList') : t('detail.addToList')}
                </button>
                <button
                  onClick={toggleWatched}
                  className={`flex items-center gap-1.5 text-sm font-medium rounded-full px-4 py-2 border transition ${movie.IsWatched ? 'bg-gray-700 text-white border-gray-700' : 'border-gray-400 text-gray-600 hover:bg-gray-100'}`}
                >
                  <IconCheck width={16} height={16} />
                  {movie.IsWatched ? t('detail.watched') : t('detail.markWatched')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="mt-8 text-gray-800 leading-relaxed max-w-3xl">{movie.Overview}</p>

      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-1 text-sm text-gray-600">
        <p><strong className="text-primary-dark">{t('detail.country')}:</strong> {movie.Country}</p>
        <p><strong className="text-primary-dark">{t('detail.language')}:</strong> {movie.Language}</p>
        <p><strong className="text-primary-dark">{t('detail.studio')}:</strong> {movie.ProductionCompany}</p>
      </div>

      {movie.Cast.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>{t('detail.cast')}</h2>
          <div className="flex gap-4 overflow-x-auto pb-3">
            {movie.Cast.map((actor) => (
              <Link to={`/person/${actor.Id}`} key={actor.Id} className="min-w-[110px] text-center flex-shrink-0 group">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-200 shadow group-hover:ring-2 group-hover:ring-primary transition">
                  {actor.ProfileImagePath ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${actor.ProfileImagePath}`}
                      alt={actor.Name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">?</div>
                  )}
                </div>
                <p className="text-sm font-semibold mt-2 text-primary-dark group-hover:text-primary">{actor.Name}</p>
                <p className="text-xs text-gray-500">{actor.Character}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {otherCrew.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>{t('detail.crew')}</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {(crewExpanded ? otherCrew : otherCrew.slice(0, 8)).map((member) => (
              <Link
                key={`${member.Id}-${member.Job}`}
                to={`/person/${member.Id}`}
                className="text-gray-700 hover:text-primary hover:underline"
              >
                <span className="text-primary-dark font-medium">{member.Name}</span>
                <span className="text-gray-400"> — {member.Job}</span>
              </Link>
            ))}
          </div>
          {otherCrew.length > 8 && (
            <button
              type="button"
              onClick={() => setCrewExpanded((v) => !v)}
              className="text-secondary text-sm font-medium hover:underline mt-3"
            >
              {crewExpanded ? t('detail.showLess') : t('detail.showMore').replace('{n}', otherCrew.length - 8)}
            </button>
          )}
        </div>
      )}

      {similar.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>{t('detail.similar')}</h2>
          <div className="flex gap-4 overflow-x-auto pb-3">
            {similar.slice(0, 12).map((s) => (
              <button
                key={s.Id}
                type="button"
                onClick={() => handleSimilarClick(s.Id)}
                disabled={importingId === s.Id}
                className="w-36 flex-shrink-0 text-left group disabled:opacity-50"
              >
                <div className="relative aspect-[2/3] bg-gray-200 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition">
                  {s.PosterUrl ? (
                    <img src={s.PosterUrl} alt={s.Title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs px-2 text-center">{s.Title}</div>
                  )}
                  {importingId === s.Id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs">{t('search.adding')}</div>
                  )}
                </div>
                <p className="text-sm font-semibold mt-2 text-primary-dark truncate group-hover:text-primary">{s.Title}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 pb-8">
        <h2 className="text-2xl text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          {t('detail.reviews')} {reviews.length > 0 && <span className="text-gray-400 text-lg">({reviews.length})</span>}
        </h2>

        {!token && (
          <p className="text-sm text-gray-500 mb-6 bg-cream rounded-lg p-4">
            {t('detail.loginToReview')} <Link to="/login" className="text-secondary font-medium hover:underline">{t('detail.loginLink')}</Link>.
          </p>
        )}

        {token && (editingReviewId || !myReview) && (
          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3 max-w-md mb-8 bg-cream rounded-xl shadow-sm p-4">
            <StarRating value={Number(rating)} onChange={setRating} />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('detail.commentPlaceholder')}
              maxLength={1000}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              rows={3}
            />
            <div className="flex items-center gap-2">
              <button type="submit" className="bg-primary text-white rounded-full px-5 py-2 text-sm font-medium hover:opacity-90 transition">
                {editingReviewId ? t('detail.update') : t('detail.writeReview')}
              </button>
              {editingReviewId && (
                <button
                  type="button"
                  onClick={() => { setEditingReviewId(null); setRating(5); setComment('') }}
                  className="text-sm text-gray-500"
                >
                  {t('detail.cancel')}
                </button>
              )}
              <span className="ml-auto text-xs text-gray-400">{comment.length}/1000</span>
            </div>
          </form>
        )}

        {token && myReview && !editingReviewId && (
          <p className="text-sm text-gray-500 mb-6">{t('detail.alreadyReviewed')}</p>
        )}

        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div key={review.Id} className="bg-cream rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm flex-shrink-0 uppercase">
                    {review.DisplayName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-primary-dark">{review.DisplayName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating value={review.Rating} size={13} />
                      <span className="text-xs text-gray-400">{formatDate(review.CreatedAt)}</span>
                    </div>
                  </div>
                </div>
                {review.UserId === userId && (
                  <div className="flex gap-3 text-xs flex-shrink-0">
                    <button onClick={() => startEdit(review)} className="text-secondary hover:underline">{t('detail.editLabel')}</button>
                    <button onClick={() => deleteReview(review.Id)} className="text-red-600 hover:underline">{t('detail.deleteLabel')}</button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-3 leading-relaxed">{review.Comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MovieDetailPage
