import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PWAReloadPrompt } from '@/components/pwa-reload-prompt';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold tracking-tight">IoT System Platform</h1>
            <p className="text-muted-foreground text-sm">
              Dự án đã sẵn sàng. Bắt đầu code giao diện của bạn tại đây!
            </p>
          </div>
          <PWAReloadPrompt />
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
