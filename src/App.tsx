import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { RevenueBySourceCard } from '@/components/dashboard/RevenueBySourceCard';
import { RevenueGrowthCard } from '@/components/dashboard/RevenueGrowthCard';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { TimeRange } from '@/types/dashboard';
import { Menu, X } from 'lucide-react';

import { DeviceHubView } from '@/components/devices/DeviceHubView';

export default function App() {
  return (
    <ThemeProvider>
      <DashboardLayout />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}

function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [globalTimeRange, setGlobalTimeRange] = useState<TimeRange>('Month');

  const pageTitle = activeNavItem === 'devices' ? 'Thiết Bị' : 'Revenue Analytics';

  return (
    <div className="h-screen w-screen bg-[#F4F5F7] dark:bg-[#0E131C] flex overflow-hidden transition-colors duration-200">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:block shrink-0 h-full">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeItem={activeNavItem}
          onSelectItem={(item) => setActiveNavItem(item)}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop with fade */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative z-10 w-[270px] h-full bg-[#F8F9FA] dark:bg-[#121620] shadow-2xl flex flex-col">
            <div className="p-3 flex justify-end">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                isCollapsed={false}
                onToggleCollapse={() => setIsMobileMenuOpen(false)}
                activeItem={activeNavItem}
                onSelectItem={(item) => {
                  setActiveNavItem(item);
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Fixed Top Header Container */}
        <div className="shrink-0 z-20 px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-3.5 bg-[#F4F5F7]/95 dark:bg-[#0E131C]/95 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
          {/* Mobile Top Bar */}
          <div className="flex md:hidden items-center justify-between pb-2 mb-2 border-b border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B24] text-slate-700 dark:text-slate-200 shadow-xs active:scale-95 transition-transform cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              {pageTitle}
            </span>
          </div>

          {/* Fixed Header Bar */}
          <Header title={pageTitle} />
        </div>

        {/* Main Content Canvas - No scroll on devices screen */}
        <div
          className={`flex-1 min-h-0 ${
            activeNavItem === 'devices'
              ? 'h-full overflow-hidden px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex flex-col'
              : 'overflow-y-auto overflow-x-hidden px-5 sm:px-7 md:px-8 lg:px-10 py-5 sm:py-6'
          }`}
        >
          {activeNavItem === 'devices' ? (
            <DeviceHubView />
          ) : (
            <main className="w-full space-y-6 pb-8">
              {/* KPI Cards Row */}
              <MetricCards
                timeRange={globalTimeRange}
                onTimeRangeChange={(range) => setGlobalTimeRange(range)}
              />

              {/* Two-Column Analytics Canvas */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
                {/* Left Column: Revenue by Source (5 cols on lg) */}
                <div className="lg:col-span-5 h-full">
                  <RevenueBySourceCard />
                </div>

                {/* Right Column: Revenue Growth (7 cols on lg) */}
                <div className="lg:col-span-7 h-full">
                  <RevenueGrowthCard />
                </div>
              </div>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}
