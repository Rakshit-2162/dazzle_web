import { create } from 'zustand'
import type { PaletteMode } from '@mui/material'

interface ThemeStore {
  mode: PaletteMode
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: (localStorage.getItem('themeMode') as PaletteMode) || 'light',
  toggleTheme: () =>
    set((state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem('themeMode', newMode)
      return { mode: newMode }
    }),
}))