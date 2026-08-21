import { Link } from 'react-router-dom'
import MovieCard from './MovieCard'
import { IconChevronRight } from './icons'

function MovieRow({ title, movies, loading, emptyMessage, linkTo }) {
  if (!loading && movies.length === 0 && !emptyMessage) {
    return null
  }

  const heading = (
    <h2 className="text-2xl text-primary" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
  )

  return (
    <section className="mb-10">
      {linkTo ? (
        <Link to={linkTo} className="group flex items-center gap-1.5 mb-4 w-fit hover:text-secondary transition">
          {heading}
          <IconChevronRight width={20} height={20} className="text-primary group-hover:translate-x-0.5 transition" />
        </Link>
      ) : (
        <div className="mb-4">{heading}</div>
      )}

      {loading && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-36 sm:w-44 aspect-[2/3] rounded-xl bg-white/60 animate-pulse flex-shrink-0" />
          ))}
        </div>
      )}

      {!loading && movies.length === 0 && (
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      )}

      {!loading && movies.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
          {movies.map((movie) => (
            <div key={movie.id} className="w-36 sm:w-44 flex-shrink-0">
              <MovieCard {...movie} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default MovieRow
