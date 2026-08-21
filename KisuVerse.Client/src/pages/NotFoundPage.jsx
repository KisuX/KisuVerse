import { Link } from 'react-router-dom'
import { IconFilm } from '../components/icons'

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <IconFilm width={48} height={48} className="text-primary/40 mb-4" />
      <h1 className="text-5xl text-primary tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>404</h1>
      <p className="text-gray-600 mt-2 mb-6">This page doesn't exist.</p>
      <Link to="/" className="bg-primary text-white rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-90 transition">
        Back to Home
      </Link>
    </div>
  )
}

export default NotFoundPage
