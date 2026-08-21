import { Link } from 'react-router-dom'
import { IconStar } from './icons'

function MovieCard({ id, title, posterUrl, subtitle, rating }) {
  return (
    <Link to={`/movie/${id}`} className="group block rounded-xl overflow-hidden bg-cream shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5">
      <div className="relative aspect-[2/3] bg-gray-200 overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm px-2 text-center">
            {title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        {rating != null && (
          <span className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-gold text-xs font-bold px-2 py-1 rounded-full backdrop-blur">
            <IconStar width={12} height={12} className="fill-current" />
            {rating.toFixed(1)}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm truncate text-primary-dark">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </Link>
  )
}

export default MovieCard
