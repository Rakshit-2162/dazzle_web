import { create } from 'zustand'
import i18n from '../config/i18n'

interface LanguageStore {
  language: string
  changeLanguage: (lang: string) => void
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: localStorage.getItem('i18nextLng') || 'en',
  changeLanguage: (lang: string) => {
    i18n.changeLanguage(lang)
    set({ language: lang })
  },
}))