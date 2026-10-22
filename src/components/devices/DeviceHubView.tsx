import React, { useState, useMemo, useEffect } from 'react';
import { PressureControlDetailView } from './PressureControlDetailView';
import { DeviceListView } from './DeviceListView';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/stores/useAppStore';
import {
  DeviceCategory,
  DeviceStation,
  DEVICE_CATEGORIES,
} from './mockDeviceData';

export function DeviceHubView() {
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | null>(null);
  const [selectedStation, setSelectedStation] = useState<DeviceStation | null>(null);
  const { setDeviceBreadcrumbs } = useAppStore();

  useEffect(() => {
    if (selectedStation && selectedCategory) {
      setDeviceBreadcrumbs({
        categoryTitle: selectedCategory.title,
        onBackToHub: () => {
          setSelectedStation(null);
          setSelectedCategory(null);
        },
        stationName: `Trạm ${selectedStation.stationId}`,
        onBackToList: () => setSelectedStation(null),
      });
    } else if (selectedCategory) {
      setDeviceBreadcrumbs({
        categoryTitle: selectedCategory.title,
        onBackToHub: () => setSelectedCategory(null),
      });
    } else {
      setDeviceBreadcrumbs(null);
    }
  }, [selectedCategory, selectedStation, setDeviceBreadcrumbs]);

  useEffect(() => {
    return () => setDeviceBreadcrumbs(null);
  }, [setDeviceBreadcrumbs]);

  // Filters from Image 1
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVersion, setSelectedVersion] = useState('all');

  // Filtered devices
  const filteredDevices = useMemo(() => {
    return DEVICE_CATEGORIES.filter((item) => {
      const matchSearch =
        !searchTerm.trim() ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchArea =
        selectedArea === 'all' || item.area === selectedArea || item.area === 'Tất cả khu vực';

      const matchVersion =
        selectedVersion === 'all' ||
        (selectedVersion === 'v3' && item.version.startsWith('v3')) ||
        (selectedVersion === 'v2' && item.version.startsWith('v2')) ||
        (selectedVersion === 'v1' && item.version.startsWith('v1'));

      return matchSearch && matchArea && matchVersion;
    });
  }, [searchTerm, selectedArea, selectedVersion]);

  const handleCardClick = (category: DeviceCategory) => {
    if (category.id !== 'pressureControl') {
      return;
    }
    // Navigate to Level 2 (Device List View)
    setSelectedCategory(category);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedArea('all');
    setSelectedStatus('all');
    setSelectedVersion('all');
    toast.success('Đã làm mới bộ lọc');
  };

  // Level 3: Station Detail View
  if (selectedStation) {
    return (
      <PressureControlDetailView
        station={selectedStation}
        onBack={() => setSelectedStation(null)}
      />
    );
  }

  // Level 2: Device List View for Selected Category
  if (selectedCategory) {
    return (
      <DeviceListView
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
        onSelectStation={(station) => setSelectedStation(station)}
      />
    );
  }

  // Level 1: Category Hub View
  return (
    <div className="w-full h-full flex flex-col min-h-0 select-none">
      {/* 1. TOP FILTER BAR - Gọn gàng trên mobile, đầy đủ trên desktop */}
      <div className="shrink-0 w-full bg-white dark:bg-[#14171F] rounded-[18px] sm:rounded-[22px] border border-slate-200/90 dark:border-slate-800/80 p-3 sm:px-4 sm:py-3.5 shadow-xs mb-3 sm:mb-4 transition-colors">
        {/* Mobile View (< sm): 2 dòng siêu gọn gàng */}
        <div className="flex flex-col gap-2 sm:hidden">
          {/* Dòng 1: Tìm kiếm + Nút Tìm */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm thiết bị..."
              className="flex-1 h-9 px-3 rounded-xl bg-slate-50 dark:bg-[#1C212B] border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
            />
            <button
              type="button"
              onClick={() => toast.info(`Tìm thấy ${filteredDevices.length} nhóm thiết bị phù hợp`)}
              className="h-9 px-3.5 rounded-xl bg-black hover:bg-slate-800 dark:bg-white dark:text-black text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Tìm</span>
            </button>
          </div>

          {/* Dòng 2: 3 dropdowns hàng ngang 3 cột */}
          <div className="grid grid-cols-3 gap-1.5">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full h-8 px-1.5 rounded-lg bg-slate-50 dark:bg-[#1C212B] border border-slate-200/80 dark:border-slate-700/60 text-[11px] text-slate-800 dark:text-slate-100 font-medium truncate"
            >
              <option value="all">Khu vực: Tất cả</option>
              <option value="Khu Vực Bắc TP">Bắc TP</option>
              <option value="Khu Vực Nam TP">Nam TP</option>
              <option value="Khu Vực Đông">Khu Đông</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-8 px-1.5 rounded-lg bg-slate-50 dark:bg-[#1C212B] border border-slate-200/80 dark:border-slate-700/60 text-[11px] text-slate-800 dark:text-slate-100 font-medium truncate"
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="maintenance">Bảo trì</option>
            </select>
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="w-full h-8 px-1.5 rounded-lg bg-slate-50 dark:bg-[#1C212B] border border-slate-200/80 dark:border-slate-700/60 text-[11px] text-slate-800 dark:text-slate-100 font-medium truncate"
            >
              <option value="all">Phiên bản: Tất cả</option>
              <option value="v3">v3.x</option>
              <option value="v2">v2.x</option>
              <option value="v1">v1.x</option>
            </select>
          </div>
        </div>

        {/* Tablet & Desktop View (>= sm): Grid 5 cột đầy đủ */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-end">
          {/* Field 1: Tên thiết bị / Từ khóa */}
          <div className="lg:col-span-1">
            <label className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5 block">
              Tên thiết bị / Từ khóa
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên hoặc mã thiết bị..."
              className="w-full h-9 sm:h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-[#1C212B] border border-slate-200/80 dark:border-slate-700/60 text-xs sm:text-[13px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>

          {/* Field 2: Khu vực / Trạm */}
          <div>
            <label className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5 block">
              Khu vực / Trạm
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full h-9 sm:h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#1C212B] border border-slate-200/80 dark:border-slate-700/60 text-xs sm:text-[13px] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
            >
              <option value="all">Tất cả khu vực</option>
              <option value="Khu Vực Bắc TP">Khu Vực Bắc TP</option>
              <option value="Khu Vực Nam TP">Khu Vực Nam TP</option>
              <option value="Khu Vực Đông">Khu Vực Đông</option>
            </select>
          </div>

          {/* Field 3: Trạng thái hoạt động */}
          <div>
            <label className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5 block">
              Trạng thái hoạt động
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-9 sm:h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#1C212B] border border-slate-200/80 dark:border-slate-700/60 text-xs sm:text-[13px] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="maintenance">Bảo trì</option>
            </select>
          </div>

          {/* Field 4: Phiên bản Firmware */}
          <div>
            <label className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5 block">
              Phiên bản Firmware
            </label>
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="w-full h-9 sm:h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#1C212B] border border-slate-200/80 dark:border-slate-700/60 text-xs sm:text-[13px] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
            >
              <option value="all">Tất cả phiên bản</option>
              <option value="v3">v3.x (Mới nhất)</option>
              <option value="v2">v2.x</option>
              <option value="v1">v1.x</option>
            </select>
          </div>

          {/* Field 5: Nút Tìm kiếm */}
          <div>
            <button
              type="button"
              onClick={() => toast.info(`Tìm thấy ${filteredDevices.length} nhóm thiết bị phù hợp`)}
              className="w-full h-9 sm:h-10 rounded-xl bg-black hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs active:scale-98"
            >
              <Search className="w-4 h-4" />
              <span>Tìm kiếm</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. DEVICE CARDS GRID */}
      {filteredDevices.length > 0 ? (
        <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden lg:max-h-[540px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-2.5 sm:gap-4 pb-6 lg:pb-0 pr-0.5">
          {filteredDevices.map((card) => {
            const isClickable = card.id === 'pressureControl';
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`h-auto lg:h-full min-h-[140px] sm:min-h-[160px] rounded-[18px] sm:rounded-[24px] bg-white dark:bg-[#13161F] border p-3.5 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                  isClickable
                    ? 'border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:bg-slate-50/60 dark:hover:bg-[#171B26] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] cursor-pointer group'
                    : 'border-slate-200/60 dark:border-slate-800/50 opacity-60 bg-slate-50/40 dark:bg-[#11141B] cursor-not-allowed select-none'
                }`}
                title={isClickable ? 'Bấm để xem danh sách trạm' : 'Chức năng chưa khả dụng'}
              >
                {/* Top Section: Title & Status Badge */}
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="min-w-0 pr-1 flex-1">
                    <h3
                      className={`text-sm sm:text-base lg:text-[17px] font-bold text-slate-900 dark:text-white tracking-tight leading-snug transition-colors ${
                        isClickable ? 'group-hover:text-blue-600 dark:group-hover:text-blue-400' : ''
                      }`}
                    >
                      {card.title}
                    </h3>
                  </div>

                  {/* Top-right pill badge */}
                  <div className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold bg-emerald-500/10 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 transition-colors">
                    {card.status}
                  </div>
                </div>

                {/* Bottom Recessed Container with Signature Diagonal Chamfer Corner */}
                <div
                  className={`flex-1 min-h-[76px] sm:min-h-[90px] mt-2 sm:mt-3 p-2.5 sm:p-4 rounded-[14px] sm:rounded-[18px] border transition-colors flex flex-col justify-between ${
                    isClickable
                      ? 'bg-slate-50/90 dark:bg-[#1A202C] border-slate-200/60 dark:border-slate-800/80 group-hover:border-slate-300/80 dark:group-hover:border-slate-700/80 group-hover:bg-slate-100/80 dark:group-hover:bg-[#1E2536]'
                      : 'bg-slate-100/40 dark:bg-[#151923] border-slate-200/40 dark:border-slate-800/40'
                  }`}
                  style={{
                    clipPath:
                      'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
                      Số thiết bị khả dụng
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {card.count}/{card.count} Online
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-2 pt-1.5 sm:pt-2">
                    {/* Big number metric */}
                    <div className="flex items-baseline gap-1 sm:gap-1.5">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight leading-none">
                        {card.count}
                      </span>
                      <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                        {card.unit}
                      </span>
                    </div>

                    {/* Version Badge Pill */}
                    <div className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-full bg-white dark:bg-[#283142] border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-1.5 sm:gap-2 shadow-2xs shrink-0 transition-colors">
                      <span
                        className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: card.dotColor }}
                      />
                      <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {card.version}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Filter State */
        <div className="flex-1 flex flex-col items-center justify-center text-center rounded-[20px] bg-white dark:bg-[#14171F] border border-slate-200/80 dark:border-slate-800 p-8">
          <SlidersHorizontal className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Không tìm thấy thiết bị phù hợp
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Vui lòng thử điều chỉnh lại từ khóa hoặc bộ lọc khu vực / phiên bản.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Đặt lại bộ lọc</span>
          </button>
        </div>
      )}
    </div>
  );
}
