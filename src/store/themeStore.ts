import { create } from 'zustand'

type Theme = 'dark' | 'light'

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: (localStorage.getItem('theme') as Theme) || 'dark',

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      return { theme: next }
    }),
}))
