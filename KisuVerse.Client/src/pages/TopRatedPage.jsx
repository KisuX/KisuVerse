import { useLanguage } from '../LanguageContext'
import PaginatedMovieList from '../components/PaginatedMovieList'

function TopRatedPage() {
  const { t } = useLanguage()

  return <PaginatedMovieList title={t('home.topRated')} queryString="query=&sortBy=RatingDesc&minVoteCount=100" />
}

export default TopRatedPage
