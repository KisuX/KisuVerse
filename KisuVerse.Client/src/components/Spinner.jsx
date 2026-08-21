import { useLanguage } from '../LanguageContext'

function Spinner({ label }) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-primary/70">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-sm">{label ?? t('spinner.loading')}</p>
    </div>
  )
}

export default Spinner
