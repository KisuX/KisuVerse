import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import MovieDetailPage from './pages/MovieDetailPage'
import PersonDetailPage from './pages/PersonDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import WatchlistPage from './pages/WatchlistPage'
import WatchedPage from './pages/WatchedPage'
import CategoriesPage from './pages/CategoriesPage'
import CategoryPage from './pages/CategoryPage'
import TopRatedPage from './pages/TopRatedPage'
import ComingSoonPage from './pages/ComingSoonPage'
import SearchPage from './pages/SearchPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import AdminPage from './pages/AdminPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import bgLogo from './assets/bg-kisuverse.png'

function App() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <img
        src={bgLogo}
        alt=""
        className="fixed inset-0 -z-10 m-auto h-[85vw] max-h-[40rem] w-[85vw] max-w-[56rem] object-contain opacity-40 pointer-events-none select-none"
      />
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/person/:id" element={<PersonDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/top-rated" element={<TopRatedPage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watched"
            element={
              <ProtectedRoute>
                <WatchedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
