import { useLanguage } from '../LanguageContext'
import PaginatedMovieList from '../components/PaginatedMovieList'

function ComingSoonPage() {
  const { t } = useLanguage()

  return <PaginatedMovieList title={t('home.comingSoon')} queryString="query=&sortBy=ReleaseDateDesc" />
}

export default ComingSoonPage
