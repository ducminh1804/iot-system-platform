import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Gauge,
  RefreshCw,
  Activity,
  X,
  Layers,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DeviceCategory,
  DeviceStation,
  getStationsByCategory,
} from './mockDeviceData';
import { StationPanel } from './StationPanel';

interface DeviceListViewProps {
  category: DeviceCategory;
  onBack: () => void;
  onSelectStation: (station: DeviceStation) => void;
}

export function DeviceListView({
  category,
  onBack,
  onSelectStation,
}: DeviceListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'id' | 'pressure' | 'flow' | 'battery'>('id');

  // 2 Chế độ hiển thị:
  // 'gauges_only' (Loại 1): Chỉ hiển thị trạng thái của 4 đồng hồ ra ngoài, không hiện bảng thông số
  // 'full_detail' (Loại 2): Dạng hiển thị đầy đủ y như trang bấm chi tiết
  const [displayMode, setDisplayMode] = useState<'gauges_only' | 'full_detail'>('gauges_only');

  // Phân trang: mặc định 10 trạm / trang
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Global RTC time single tick
  const [globalRtcTime, setGlobalRtcTime] = useState<string>('21-10-2026 14:27:25');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setGlobalRtcTime(`${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const allStations = useMemo(() => {
    return getStationsByCategory(category.id);
  }, [category.id]);

  // Unique areas and their station counts
  const areaCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allStations.forEach((s) => {
      counts[s.area] = (counts[s.area] || 0) + 1;
    });
    return counts;
  }, [allStations]);

  // Filtered and sorted stations
  const filteredStations = useMemo(() => {
    const result = allStations.filter((station) => {
      const matchSearch =
        !searchTerm.trim() ||
        station.stationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.area.toLowerCase().includes(searchTerm.toLowerCase());

      const matchArea =
        selectedArea === 'all' || station.area === selectedArea;

      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'online' && station.status === 'online') ||
        (selectedStatus === 'offline' && station.status !== 'online');

      return matchSearch && matchArea && matchStatus;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'pressure') return b.pressureOut - a.pressureOut;
      if (sortBy === 'flow') return b.flowRate - a.flowRate;
      if (sortBy === 'battery') return b.batterySolar - a.batterySolar;
      return a.stationId.localeCompare(b.stationId);
    });
  }, [allStations, searchTerm, selectedArea, selectedStatus, sortBy]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedArea, selectedStatus, pageSize, displayMode]);

  // Paginated stations
  const totalPages = Math.max(1, Math.ceil(filteredStations.length / pageSize));
  const paginatedStations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStations.slice(start, start + pageSize);
  }, [filteredStations, currentPage, pageSize]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedArea('all');
    setSelectedStatus('all');
    setSortBy('id');
    setCurrentPage(1);
    toast.success('Đã đặt lại bộ lọc');
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 select-none space-y-3">
      {/* 1. THANH TÌM KIẾM & BỘ LỌC (CHỈ CHỨA CÁC Ô INPUT / SELECT / BỘ LỌC) */}
      <div className="shrink-0 w-full bg-white dark:bg-[#13161F] rounded-[18px] sm:rounded-[22px] border border-slate-200/90 dark:border-slate-800/90 px-3.5 sm:px-4 py-2.5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Cụm trái: Ô tìm kiếm + Dropdown khu vực + Dropdown số trạm/trang */}
          <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap sm:flex-nowrap">
            {/* Ô tìm kiếm */}
            <div className="relative flex-1 min-w-[180px] max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã trạm (1015), tên trạm..."
                className="w-full h-9 pl-9 pr-8 rounded-xl bg-slate-50 dark:bg-[#1A202C] border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown chọn khu vực */}
            <div className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-slate-50 dark:bg-[#1A202C] border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                <option value="all">Tất cả khu vực</option>
                {Object.keys(areaCounts).map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cụm phải: 2 Chế độ hiển thị & Nút xem chỉ số KPI */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 2 Chế độ hiển thị: [Chi tiết] | [Đầy đủ] */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#1A202C] border border-slate-200/80 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setDisplayMode('gauges_only')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  displayMode === 'gauges_only'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Chế độ chi tiết 4 đồng hồ"
              >
                <Gauge className="w-3.5 h-3.5" />
                <span>Chi tiết</span>
              </button>

              <button
                type="button"
                onClick={() => setDisplayMode('full_detail')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  displayMode === 'full_detail'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Chế độ hiển thị đầy đủ thông số"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Đầy đủ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. VÙNG HIỂN THỊ CÁC TRẠM */}
      {paginatedStations.length > 0 ? (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          {/* Danh sách cuộn trơn tru */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 pr-0.5 pb-2">
            {paginatedStations.map((station) => (
              <StationPanel
                key={station.id}
                station={station}
                viewMode={displayMode}
                onSelectStation={onSelectStation}
                rtcTime={globalRtcTime}
              />
            ))}
          </div>

          {/* Thanh phân trang ở đáy */}
          <div className="shrink-0 pt-3 pb-1 flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800 text-xs">
            <span className="text-slate-500 font-medium">
              Hiển thị <strong className="text-slate-800 dark:text-slate-200">{(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredStations.length)}</strong> trên tổng số <strong className="text-slate-800 dark:text-slate-200">{filteredStations.length}</strong> trạm
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#13161F] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Trước</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                        currentPage === pNum
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white dark:bg-[#13161F] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#13161F] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Sau</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center rounded-[24px] bg-white dark:bg-[#13161F] border border-slate-200/80 dark:border-slate-800 p-8">
          <Activity className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Không tìm thấy thiết bị nào
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại bộ lọc khu vực.
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
