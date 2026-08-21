import { createContext, useContext, useCallback } from 'react'
import { translate } from './i18n'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const t = useCallback((key) => translate(key), [])

  return (
    <LanguageContext.Provider value={{ lang: 'en', t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
