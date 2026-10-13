import { create } from 'zustand';

interface AppState {
  theme: 'dark' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
}));
