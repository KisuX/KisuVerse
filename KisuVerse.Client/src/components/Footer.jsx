import { useLanguage } from '../LanguageContext'
import logoIcon from '../assets/logo-icon.png'

function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-16 border-t border-primary/10 bg-primary-dark text-cream/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <img src={logoIcon} alt="" className="h-6 w-6 object-contain" />
          <span style={{ fontFamily: 'var(--font-display)' }} className="text-lg tracking-wide text-cream">KisuVerse</span>
        </div>
        <p>{t('footer.text')}</p>
      </div>
    </footer>
  )
}

export default Footer
