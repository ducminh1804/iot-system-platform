import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PWAReloadPrompt } from '@/components/pwa-reload-prompt';
import { HydrolixLayout } from '@/components/hydrolix/HydrolixLayout';
import { OverviewPage } from '@/pages/OverviewPage';
import { DevicePage } from '@/pages/DevicePage';
import { SettingsPage } from '@/pages/SettingsPage';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HydrolixLayout />}>
                <Route index element={<OverviewPage />} />
                <Route path="device" element={<DevicePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="device/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <PWAReloadPrompt />
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
