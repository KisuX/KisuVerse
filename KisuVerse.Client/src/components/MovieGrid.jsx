import MovieCard from './MovieCard'
import Spinner from './Spinner'

function MovieGrid({ movies, emptyMessage, loading }) {
  if (loading) {
    return <Spinner />
  }

  if (movies.length === 0) {
    return <p className="text-gray-500 text-center py-16">{emptyMessage}</p>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} {...movie} />
      ))}
    </div>
  )
}

export default MovieGrid
