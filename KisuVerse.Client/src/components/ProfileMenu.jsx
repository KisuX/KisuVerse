import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../LanguageContext'
import { IconUser, IconBookmark, IconCheck, IconHeart, IconChevronRight } from './icons'

function menuLinkClass({ isActive }) {
  return `flex items-center gap-2.5 px-4 py-2.5 text-sm transition ${
    isActive ? 'text-primary font-semibold bg-cream' : 'text-primary-dark hover:bg-cream/60'
  }`
}

function ProfileMenu() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-1.5 text-sm font-medium text-cream/90 hover:text-gold transition"
      >
        <IconUser width={16} height={16} />
        {t('nav.profile')}
        <IconChevronRight width={14} height={14} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl overflow-hidden z-40 py-1">
          <NavLink to="/profile" onMouseDown={(e) => e.preventDefault()} className={menuLinkClass}>
            <IconUser width={16} height={16} /> {t('nav.profile')}
          </NavLink>
          <NavLink to="/watchlist" onMouseDown={(e) => e.preventDefault()} className={menuLinkClass}>
            <IconBookmark width={16} height={16} className="fill-current" /> {t('nav.watchlist')}
          </NavLink>
          <NavLink to="/watched" onMouseDown={(e) => e.preventDefault()} className={menuLinkClass}>
            <IconCheck width={16} height={16} /> {t('nav.watched')}
          </NavLink>
          <NavLink to="/favorites" onMouseDown={(e) => e.preventDefault()} className={menuLinkClass}>
            <IconHeart width={16} height={16} className="fill-current" /> {t('nav.favorites')}
          </NavLink>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu
