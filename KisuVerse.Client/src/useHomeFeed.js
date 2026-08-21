import { useState, useEffect } from 'react'
import { apiFetch, fromMediaCard } from './api'
import { useAuth } from './AuthContext'

export function useHomeFeed(genreId) {
  const { token } = useAuth()
  const [topRated, setTopRated] = useState([])
  const [comingSoon, setComingSoon] = useState([])
  const [popular, setPopular] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const genreParam = genreId ? `&genreId=${genreId}` : ''

      const [topRatedRes, comingSoonRes, popularRes, genresRes] = await Promise.all([
        apiFetch(`/media/search?query=${genreParam}&sortBy=RatingDesc&pageSize=12&minVoteCount=100`, token),
        apiFetch(`/media/search?query=${genreParam}&sortBy=ReleaseDateDesc&pageSize=12`, token),
        apiFetch(`/media/search?query=${genreParam}&sortBy=PopularityDesc&pageSize=12`, token),
        apiFetch('/media/genres', token)
      ])

      setLoading(false)

      if (topRatedRes.ok) setTopRated((await topRatedRes.json()).Items.map(fromMediaCard))
      if (comingSoonRes.ok) setComingSoon((await comingSoonRes.json()).Items.map(fromMediaCard))
      if (popularRes.ok) setPopular((await popularRes.json()).Items.map(fromMediaCard))
      if (genresRes.ok) setGenres(await genresRes.json())
    }

    load()
  }, [token, genreId])

  return { topRated, comingSoon, popular, genres, loading }
}
