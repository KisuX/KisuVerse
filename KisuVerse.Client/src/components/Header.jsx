import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useLanguage } from '../LanguageContext'
import HeaderSearch from './HeaderSearch'
import logoIcon from '../assets/logo-icon.png'
import { IconMenu, IconClose, IconHeart, IconBookmark, IconCheck, IconUser } from './icons'

function navLinkClass({ isActive }) {
  return `flex items-center gap-1.5 text-sm font-medium transition hover:text-gold whitespace-nowrap ${isActive ? 'text-gold' : 'text-cream/90'}`
}

function Header() {
  const { token, isAdmin, logout } = useAuth()
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-primary-dark/95 backdrop-blur border-b border-white/10 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-cream flex-shrink-0" onClick={() => setMenuOpen(false)}>
          <img src={logoIcon} alt="" className="h-9 w-9 object-contain" />
          <span className="text-2xl tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>KisuVerse</span>
        </Link>

        <div className="hidden md:block flex-1 max-w-sm">
          <HeaderSearch />
        </div>

        <nav className="hidden md:flex items-center gap-5 ml-auto">
          <NavLink to="/search" className={navLinkClass}>{t('nav.search')}</NavLink>
          <NavLink to="/categories" className={navLinkClass}>{t('nav.categories')}</NavLink>
          <NavLink to="/top-rated" className={navLinkClass}>{t('home.topRated')}</NavLink>
          <NavLink to="/coming-soon" className={navLinkClass}>{t('home.comingSoon')}</NavLink>
          {token ? (
            <>
              <NavLink to="/watchlist" className={navLinkClass}><IconBookmark width={16} height={16} />{t('nav.watchlist')}</NavLink>
              <NavLink to="/watched" className={navLinkClass}><IconCheck width={16} height={16} />{t('nav.watched')}</NavLink>
              <NavLink to="/favorites" className={navLinkClass}><IconHeart width={16} height={16} />{t('nav.favorites')}</NavLink>
              <NavLink to="/profile" className={navLinkClass}><IconUser width={16} height={16} />{t('nav.profile')}</NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass}>{t('nav.admin')}</NavLink>
              )}
              <button onClick={logout} className="text-sm font-medium text-cream/90 hover:text-gold transition border border-cream/30 rounded-full px-4 py-1.5 hover:border-gold whitespace-nowrap">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-cream/90 hover:text-gold transition whitespace-nowrap">{t('nav.login')}</Link>
              <Link to="/register" className="text-sm font-semibold bg-gold text-primary-dark rounded-full px-4 py-1.5 hover:opacity-90 transition whitespace-nowrap">
                {t('nav.register')}
              </Link>
            </>
          )}
        </nav>

        <div className="md:hidden ml-auto flex items-center gap-3">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="text-cream"
            aria-label="Menu"
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-1 px-4 pb-4 border-t border-white/10 bg-primary-dark">
          <div className="py-3">
            <HeaderSearch onNavigate={() => setMenuOpen(false)} />
          </div>
          <NavLink to="/search" className={navLinkClass} onClick={() => setMenuOpen(false)} style={{ padding: '10px 4px' }}>{t('nav.search')}</NavLink>
          <NavLink to="/categories" className={navLinkClass} onClick={() => setMenuOpen(false)} style={{ padding: '10px 4px' }}>{t('nav.categories')}</NavLink>
          <NavLink to="/top-rated" className={navLinkClass} onClick={() => setMenuOpen(false)} style={{ padding: '10px 4px' }}>{t('home.topRated')}</NavLink>
          <NavLink to="/coming-soon" className={navLinkClass} onClick={() => setMenuOpen(false)} style={{ padding: '10px 4px' }}>{t('home.comingSoon')}</NavLink>
          {token ? (
            <>
              <NavLink to="/watchlist" className={navLinkClass} onClick={() => setMenuOpen(false)} style={{ padding: '10px 4px' }}>{t('nav.watchlist')}</NavLink>
              <NavLink to="/watched" className={navLinkClass} onClick={() => setMenuOpen(false)} style={{ padding: '10px 4px' }}>{t('nav.watched')}</NavLink>
              <NavLink to="/favorites" className={navLinkClass} onClick={() => setMenuOpen(false)} style={{ padding: '10px 4px' }}>{t('nav.favorites')}</NavLink>
              <NavLink to="/profile" className={navLinkClass} onClick={() => setMenuOpen(false)} style={{ padding: '10px 4px' }}>{t('nav.profile')}</NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass} onClick={() => setMenuOpen(false)} style={{ padding: '10px 4px' }}>{t('nav.admin')}</NavLink>
              )}
              <button onClick={() => { setMenuOpen(false); logout() }} className="text-left text-sm font-medium text-cream/90 py-2.5">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-cream/90 py-2.5" onClick={() => setMenuOpen(false)}>{t('nav.login')}</Link>
              <Link to="/register" className="text-sm font-medium text-cream/90 py-2.5" onClick={() => setMenuOpen(false)}>{t('nav.register')}</Link>
            </>
          )}
        </nav>
      )}
    </header>
  )
}

export default Header
