import React, { useState } from 'react';
import { ScadaTopBar } from './ScadaTopBar';
import { ScadaNavRail } from './ScadaNavRail';
import { ScadaUnitTreeSidebar } from './ScadaUnitTreeSidebar';
import { ScadaSubHeader } from './ScadaSubHeader';
import { ScadaDashboardGrid } from './ScadaDashboardGrid';
import { ScadaTurbineOverview } from './ScadaTurbineOverview';
import { ScadaParkView } from './ScadaParkView';
import { ScadaHistoricalView } from './ScadaHistoricalView';
import { ScadaAlarmsView } from './ScadaAlarmsView';
import { ScadaControlView } from './ScadaControlView';
import { ScadaDeviceView } from './ScadaDeviceView';
import { ScadaDeviceSettingsView } from './ScadaDeviceSettingsView';
import { MOCK_SCADA_UNITS } from './mockData';
import {
  ScadaUnit,
  ScadaMainTab,
  ScadaWorkspaceView,
  ScadaDeviceSubTab,
  ScadaAlarmsSubTab,
  ScadaHistoricalSubTab,
  ScadaControlSubTab,
} from './types';
import { toast } from 'sonner';

export const ScadaLayout: React.FC = () => {
  const [activeRailTab, setActiveRailTab] = useState<ScadaMainTab>('overview');
  const [workspaceView, setWorkspaceView] = useState<ScadaWorkspaceView>('dashboard');
  const [deviceViewMode, setDeviceViewMode] = useState<'monitor' | 'settings'>('monitor');

  const [units, setUnits] = useState<ScadaUnit[]>(MOCK_SCADA_UNITS);
  const [selectedUnit, setSelectedUnit] = useState<ScadaUnit>(MOCK_SCADA_UNITS[0]);
  const [isTreeCollapsed, setIsTreeCollapsed] = useState<boolean>(false);

  const handleSelectUnit = (unit: ScadaUnit) => {
    setSelectedUnit(unit);
    setWorkspaceView('turbine');
    setActiveRailTab('overview');
    toast.info(`Đã chọn ${unit.name} - ${unit.model}`);
  };

  const handleSelectUnitFromTree = (unitId: string) => {
    const found = units.find((u) => u.id === unitId);
    if (found) {
      setSelectedUnit(found);
      setWorkspaceView('turbine');
      setActiveRailTab('overview');
      toast.info(`Đã chọn ${found.name}`);
    }
  };

  const handleUpdateValve = (level: 1 | 2 | 3) => {
    setUnits((prev) =>
      prev.map((u) =>
        u.id === selectedUnit.id ? { ...u, hydraulicValveLevel: level } : u
      )
    );
    setSelectedUnit((prev) => ({ ...prev, hydraulicValveLevel: level }));
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F0F2F5] dark:bg-[#1A1D21] font-sans text-slate-800 dark:text-slate-100 antialiased selection:bg-[#E52E2D] selection:text-white transition-colors duration-200">
      {/* 1. Global SCADA Top Bar with Transmission KPIs (Ẩn dải KPI trên mobile để tối ưu 1 khung hình) */}
      <ScadaTopBar onSelectAlarms={() => setActiveRailTab('alarms')} />

      {/* 2. Main SCADA Body: Left Rail + Hierarchy Tree + Center Workspace */}
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {/* Leftmost Icon Navigation Rail */}
        <ScadaNavRail
          activeTab={activeRailTab}
          onTabChange={(tab) => {
            setActiveRailTab(tab);
            if (tab === 'device') {
              setDeviceViewMode('monitor');
            }
          }}
        />

        {/* Secondary Unit Tree Sidebar (Tự động ẩn trên mobile để bảo toàn diện tích cho màn hình thiết bị) */}
        <ScadaUnitTreeSidebar
          selectedUnitId={selectedUnit.id}
          onSelectUnit={handleSelectUnitFromTree}
          isCollapsed={isTreeCollapsed}
          onToggleCollapse={() => setIsTreeCollapsed((prev) => !prev)}
        />

        {/* Center Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#FFFFFF] dark:bg-[#1E2126]">
          {/* Sub Header với Menu Ngang đúng Logic ngữ cảnh */}
          <ScadaSubHeader
            activeRailTab={activeRailTab}
            currentView={workspaceView}
            onViewChange={(view) => {
              setActiveRailTab('overview');
              setWorkspaceView(view);
            }}
            deviceViewMode={deviceViewMode}
            onDeviceViewModeChange={(mode) => setDeviceViewMode(mode)}
            onBack={() => {
              if (activeRailTab === 'device' && deviceViewMode === 'settings') {
                setDeviceViewMode('monitor');
              } else if (activeRailTab !== 'overview') {
                setActiveRailTab('overview');
              } else {
                setWorkspaceView('dashboard');
              }
            }}
          />

          {/* Dynamic Content View Area */}
          <div
            className={`flex-1 min-h-0 bg-[#F4F6F9] dark:bg-[#1A1D21] ${
              (activeRailTab === 'device' && deviceViewMode === 'settings') || activeRailTab === 'configure'
                ? 'h-full flex flex-col overflow-hidden'
                : 'overflow-y-auto'
            }`}
          >
            {activeRailTab === 'device' ? (
              deviceViewMode === 'settings' ? (
                <ScadaDeviceSettingsView onBack={() => setDeviceViewMode('monitor')} />
              ) : (
                <ScadaDeviceView
                  onOpenSettings={() => setDeviceViewMode('settings')}
                />
              )
            ) : activeRailTab === 'alarms' ? (
              <ScadaAlarmsView />
            ) : activeRailTab === 'historical' ? (
              <ScadaHistoricalView />
            ) : activeRailTab === 'control' ? (
              <ScadaControlView />
            ) : activeRailTab === 'configure' ? (
              <ScadaDeviceSettingsView onBack={() => setActiveRailTab('device')} />
            ) : workspaceView === 'turbine' ? (
              <ScadaTurbineOverview
                unit={selectedUnit}
                onUpdateValveLevel={handleUpdateValve}
                onSelectTab={(tab) => {
                  if (tab === 'Historical graph') setActiveRailTab('historical');
                }}
              />
            ) : workspaceView === 'park' ? (
              <ScadaParkView
                units={units}
                onSelectUnit={handleSelectUnit}
                onBack={() => setWorkspaceView('dashboard')}
              />
            ) : workspaceView === 'map' ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-[#25282E] flex items-center justify-center mb-3">
                  <span className="text-2xl">🗺️</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  GIS Park Topology Map
                </h3>
                <p className="text-xs max-w-md mt-1">
                  Định vị địa lý và cấu trúc không gian các cánh đồng gió China (Shicheng, Jiuguan) và Germany (Boxberg).
                </p>
                <button
                  onClick={() => setWorkspaceView('dashboard')}
                  className="mt-4 px-3 py-1.5 bg-[#E52E2D] text-white font-bold text-xs rounded"
                >
                  Quay lại Lưới Tuabin (Dashboard)
                </button>
              </div>
            ) : (
              /* Default: Dashboard Grid View */
              <ScadaDashboardGrid units={units} onSelectUnit={handleSelectUnit} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
