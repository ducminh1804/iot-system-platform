import { create } from 'zustand';

export interface Device {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'gateway';
  status: 'online' | 'offline' | 'warning';
  lastSeen: string;
  value: number;
  unit: string;
}

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  selectedDevice: Device | null;
  setSelectedDevice: (device: Device | null) => void;
  theme: 'dark' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  selectedDevice: null,
  setSelectedDevice: (device) => set({ selectedDevice: device }),
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
}));
