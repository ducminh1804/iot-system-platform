import React, { useState } from 'react';
import { SpeedometerGauge } from '@/components/gauge/SpeedometerGauge';
import { useAppStore } from '@/stores/useAppStore';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster, toast } from 'sonner';
import {
  Sun,
  Moon,
  Copy,
  Check,
  Gauge,
  Sparkles,
  Layers,
  Code2,
  Sliders,
} from 'lucide-react';

export default function App() {
  return (
    <ThemeProvider>
      <GaugeShowcase />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}

function GaugeShowcase() {
  const { theme, setTheme } = useAppStore();
  const [gaugeValue, setGaugeValue] = useState<number>(50);
  const [selectedUnit, setSelectedUnit] = useState<string>('Bar');
  const [copied, setCopied] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const usageSnippet = `import { SpeedometerGauge } from '@/components/gauge/SpeedometerGauge';

// Sử dụng cơ bản với 4 mốc (0%, 27.8%, 50%, 100%):
<SpeedometerGauge
  value={${gaugeValue.toFixed(1)}}
  onChange={(val) => console.log('Áp lực:', val)}
  unit="${selectedUnit}"
  size={460}
  easingStyle="spring" // 'spring' | 'fluid' | 'linear'
  showControls={true}
  showMetrics={true}
/>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(usageSnippet);
    setCopied(true);
    toast.success('Đã sao chép mã nguồn tích hợp vào clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0F1318] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#161B22]/80 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Gauge className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              Đồng Hồ Áp Lực 3 Mức (Speedometer Gauge)
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              @/components/gauge/SpeedometerGauge.tsx
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Badge trạng thái lưu trữ */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Đã Lưu &amp; Sẵn Sàng Tái Sử Dụng
          </span>

          {/* Nút đổi Theme */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
            title={`Chuyển sang chế độ ${theme === 'dark' ? 'Sáng' : 'Tối'}`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center gap-6">
        {/* Banner Đơn vị đo nhanh */}
        <div className="w-full flex items-center justify-between flex-wrap gap-2 px-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Sliders className="w-3.5 h-3.5" />
            <span>Chọn đơn vị đo kiểm tra:</span>
            {(['Bar', 'mH₂O', 'PSI', '%'] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => setSelectedUnit(unit)}
                className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                  selectedUnit === unit
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-slate-400">
            Giá trị hiện tại: <span className="font-bold text-blue-600 dark:text-blue-400">{gaugeValue.toFixed(1)} {selectedUnit}</span>
          </div>
        </div>

        {/* Trọng tâm: Đồng Hồ Áp Lực 3 Mức Hoàn Chỉnh */}
        <div className="w-full flex justify-center py-2">
          <SpeedometerGauge
            value={gaugeValue}
            onChange={(val) => setGaugeValue(val)}
            unit={selectedUnit}
            size={480}
            variant="card"
            showControls={true}
            showMetrics={true}
            easingStyle="spring"
          />
        </div>

        {/* Bảng Hướng Dẫn Tái Sử Dụng & Sao Chép Mã Nguồn */}
        <div className="w-full max-w-[560px] bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              <Code2 className="w-4 h-4 text-blue-500" />
              <span>Cách Tái Sử Dụng Sau Này</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Đã Sao Chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao Chép Mã</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto selection:bg-blue-500">
            <code>{usageSnippet}</code>
          </pre>

          {/* Bảng các mốc định danh (Landmarks) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px]">Mức 0 (Tắt)</span>
              <span className="font-bold text-slate-600 dark:text-slate-400">0.0% (-90°)</span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
              <span className="text-emerald-600 dark:text-emerald-400 block text-[10px]">Mức 1 (Xanh)</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300">27.8% (-40°)</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
              <span className="text-amber-600 dark:text-amber-400 block text-[10px]">Mức 2 (Vàng)</span>
              <span className="font-bold text-amber-700 dark:text-amber-300">50.0% (0°)</span>
            </div>
            <div className="p-2 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40">
              <span className="text-red-600 dark:text-red-400 block text-[10px]">Mức 3 (MAX Đỏ)</span>
              <span className="font-bold text-red-700 dark:text-red-300">100.0% (+90°)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
