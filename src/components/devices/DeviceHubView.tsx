import React, { useState, useMemo } from 'react';
import { SpeedometerGauge } from '@/components/gauge/SpeedometerGauge';
import { PressureControlDetailView } from './PressureControlDetailView';
import { X, Send, Activity, CheckCircle2, Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface DeviceItem {
  id: string;
  code: string;
  title: string;
  count: number;
  unit: string;
  version: string;
  versionCount: number;
  status: string;
  dotColor: string;
  area: string;
}

export function DeviceHubView() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [pressureVal, setPressureVal] = useState<number>(50);

  // Filters from Image 1
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVersion, setSelectedVersion] = useState('all');

  // The 5 devices from reference
  const deviceList: DeviceItem[] = [
    {
      id: 'pressureControl',
      code: 'pressureControl',
      title: 'Thiết bị điều khiển áp lực',
      count: 24,
      unit: 'trạm',
      version: 'v3.2.0',
      versionCount: 3,
      status: 'Hoạt động',
      dotColor: '#2563EB',
      area: 'Khu Vực Bắc TP',
    },
    {
      id: 'dataLogger',
      code: 'dataLogger',
      title: 'Data Logger',
      count: 156,
      unit: 'điểm đo',
      version: 'v2.1.4',
      versionCount: 4,
      status: 'Hoạt động',
      dotColor: '#10B981',
      area: 'Khu Vực Nam TP',
    },
    {
      id: 'valveBreaker',
      code: 'valveBreaker',
      title: 'Đóng ngắt van bước tự động',
      count: 42,
      unit: 'van',
      version: 'v1.8.2',
      versionCount: 2,
      status: 'Hoạt động',
      dotColor: '#F59E0B',
      area: 'Khu Vực Đông',
    },
    {
      id: 'waterQuality',
      code: 'waterQuality',
      title: 'Tủ chất lượng nước',
      count: 18,
      unit: 'tủ',
      version: 'v2.0.5',
      versionCount: 2,
      status: 'Hoạt động',
      dotColor: '#8B5CF6',
      area: 'Khu Vực Bắc TP',
    },
    {
      id: 'other',
      code: 'other',
      title: 'Thiết bị khác',
      count: 65,
      unit: 'thiết bị',
      version: 'v1.0.0',
      versionCount: 1,
      status: 'Hoạt động',
      dotColor: '#64748B',
      area: 'Tất cả khu vực',
    },
  ];

  // Filtered devices
  const filteredDevices = useMemo(() => {
    return deviceList.filter((item) => {
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
  }, [deviceList, searchTerm, selectedArea, selectedVersion]);

  const handleCardClick = (cardId: string) => {
    if (cardId === 'pressureControl') {
      // Navigate to dedicated station detail page as requested
      setSelectedDeviceId('pressureControl');
    } else {
      setActiveModalId(cardId);
    }
  };

  const activeCardInfo = deviceList.find((c) => c.id === activeModalId);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedArea('all');
    setSelectedStatus('all');
    setSelectedVersion('all');
    toast.success('Đã làm mới bộ lọc');
  };

  // If card 1 (pressureControl) is selected, show the full station detail view
  if (selectedDeviceId === 'pressureControl') {
    return <PressureControlDetailView onBack={() => setSelectedDeviceId(null)} />;
  }

  return (
    <div className="w-full h-full flex flex-col min-h-0 select-none">
      {/* 1. TOP FILTER BAR (Style as Image 1) - Clear, legible typography & 100% Vietnamese */}
      <div className="shrink-0 w-full bg-white dark:bg-[#14171F] rounded-[20px] sm:rounded-[22px] border border-slate-200/90 dark:border-slate-800/80 px-4 py-3 sm:py-3.5 shadow-xs mb-3.5 sm:mb-4 transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-end">
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

          {/* Field 5: Nút Tìm kiếm (Tiếng Việt) */}
          <div>
            <button
              type="button"
              onClick={() => toast.info(`Tìm thấy ${filteredDevices.length} thiết bị phù hợp`)}
              className="w-full h-9 sm:h-10 rounded-xl bg-black hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs active:scale-98"
            >
              <Search className="w-4 h-4" />
              <span>Tìm kiếm</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. DEVICE CARDS GRID (Card style as Image 2) - Balanced proportions with zero empty void */}
      {filteredDevices.length > 0 ? (
        <div className="flex-1 min-h-0 max-h-[520px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-3 sm:gap-4 overflow-hidden">
          {filteredDevices.map((card) => {
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className="h-full rounded-[22px] sm:rounded-[24px] bg-white dark:bg-[#13161F] border border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700/80 hover:bg-slate-50/60 dark:hover:bg-[#171B26] p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-200 cursor-pointer flex flex-col justify-between group overflow-hidden"
              >
                {/* Top Section: Title & Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 pr-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-1">
                      {card.code}
                    </p>
                  </div>

                  {/* Top-right pill badge (like "Up to 10% APY" in Image 2) */}
                  <div className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:border-emerald-500/40 shrink-0 transition-colors">
                    {card.status}
                  </div>
                </div>

                {/* Bottom Recessed Container with Signature Diagonal Chamfer Corner (Image 2 style) - Fills space seamlessly */}
                <div
                  className="flex-1 min-h-[96px] mt-3 p-3.5 sm:p-4 rounded-[18px] bg-slate-50/90 dark:bg-[#1A202C] border border-slate-200/60 dark:border-slate-800/80 group-hover:border-slate-300/80 dark:group-hover:border-slate-700/80 group-hover:bg-slate-100/80 dark:group-hover:bg-[#1E2536] transition-colors flex flex-col justify-between"
                  style={{
                    clipPath:
                      'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
                      Số thiết bị khả dụng
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {card.count}/{card.count} Online
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-2 pt-2">
                    {/* Big number metric */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight leading-none">
                        {card.count}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {card.unit}
                      </span>
                    </div>

                    {/* Version Badge Pill (like ACME badge in Image 2) */}
                    <div className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#283142] border border-slate-200/80 dark:border-slate-700/60 group-hover:border-slate-300 dark:group-hover:border-slate-600 group-hover:bg-slate-50 dark:group-hover:bg-[#303B4E] flex items-center gap-2 shadow-2xs shrink-0 transition-colors">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: card.dotColor }}
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
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

      {/* Interactive Modal when clicking a card */}
      {activeModalId && activeCardInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveModalId(null)}
          />

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#151A24] rounded-[28px] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="text-left">
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                  {activeCardInfo.code}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeCardInfo.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalId(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="pt-6">
              {activeModalId === 'pressureControl' ? (
                /* Speedometer Gauge for Pressure Control */
                <div className="flex flex-col items-center">
                  <SpeedometerGauge
                    value={pressureVal}
                    onChange={(val) => setPressureVal(val)}
                    unit="Bar"
                    size={380}
                    variant="card"
                    showControls={true}
                    showMetrics={true}
                    easingStyle="spring"
                  />
                  <div className="w-full mt-5 flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs">
                    <span className="text-slate-500 font-medium">Áp suất đặt:</span>
                    <span className="font-bold text-blue-600 font-mono text-base">
                      {(pressureVal / 10).toFixed(2).replace('.', ',')} Bar
                    </span>
                    <button
                      type="button"
                      onClick={() => toast.success('Thao tác thành công')}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-transform"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Áp Dụng</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Simple, clean info for other cards */
                <div className="space-y-4 text-center py-4">
                  <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeCardInfo.title}
                  </h4>
                  <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                    <span>Số lượng: <strong className="text-slate-800 dark:text-slate-200">{activeCardInfo.count} {activeCardInfo.unit}</strong></span>
                    <span>•</span>
                    <span>Phiên bản: <strong className="text-slate-800 dark:text-slate-200">{activeCardInfo.version}</strong></span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Trạng thái bình thường</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
