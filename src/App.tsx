import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardPage } from '@/pages/DashboardPage';
import { DevicesPage } from '@/pages/DevicesPage';
import { TopologyPage } from '@/pages/TopologyPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { PWAReloadPrompt } from '@/components/pwa-reload-prompt';
import { LayoutDashboard, Server, Network, Settings, Sun, Moon, Radio } from 'lucide-react';

function AppLayout() {
  const { theme, setTheme } = useAppStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { to: '/', label: 'Giám Sát', icon: LayoutDashboard },
    { to: '/devices', label: 'Thiết Bị', icon: Server },
    { to: '/topology', label: 'Sơ Đồ Mạng', icon: Network },
    { to: '/settings', label: 'Cài Đặt', icon: Settings },
  ];

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Header Bar */}
      <header className="bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg font-bold shadow-md">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight">IoT System</span>
                  <Badge variant="secondary" className="h-4 px-1.5 py-0 text-[10px]">
                    v1.0.0
                  </Badge>
                </div>
                <p className="text-muted-foreground hidden text-[11px] sm:block">
                  Vite + React 19 + TypeScript
                </p>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="ml-4 hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-500 lg:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>Realtime Connected</span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              title="Đổi giao diện Sáng / Tối"
              className="h-9 w-9"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="bg-card flex justify-around border-t px-2 py-1 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`
              }
            >
              <item.icon className="mb-0.5 h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto max-w-7xl flex-1 px-4 py-6 sm:px-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/devices" element={<DevicesPage />} />
          <Route path="/topology" element={<TopologyPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="text-muted-foreground bg-muted/10 border-t py-4 text-center text-xs">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 sm:flex-row">
          <span>IoT System Platform • Vite + Tailwind v4 + shadcn/ui + TypeScript</span>
          <span>Sẵn sàng code tính năng mới!</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <AppLayout />
            <PWAReloadPrompt />
            <Toaster richColors position="top-right" />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
