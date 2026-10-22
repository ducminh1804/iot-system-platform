import { create } from 'zustand';

export interface DeviceBreadcrumbs {
  categoryTitle?: string;
  onBackToHub?: () => void;
  stationName?: string;
  onBackToList?: () => void;
}

interface AppState {
  theme: 'dark' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  deviceBreadcrumbs: DeviceBreadcrumbs | null;
  setDeviceBreadcrumbs: (breadcrumbs: DeviceBreadcrumbs | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  deviceBreadcrumbs: null,
  setDeviceBreadcrumbs: (deviceBreadcrumbs) => set({ deviceBreadcrumbs }),
}));
