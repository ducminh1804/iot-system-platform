import React from 'react';
import {
  DollarSign,
  Users,
  BarChart2,
  Coins,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { TimeRange } from '@/types/dashboard';

interface MetricCardsProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export function MetricCards({ timeRange, onTimeRangeChange }: MetricCardsProps) {
  // Metric data mapped according to selected range
  const metricsData = {
    Month: [
      {
        id: 'total-revenue',
        title: 'Total Revenue',
        value: '$84K',
        delta: '13.8%',
        isPositive: false,
        deltaText: 'vs last month',
        icon: DollarSign,
      },
      {
        id: 'mrr',
        title: 'Monthly Recurring Revenue',
        value: '$21k',
        delta: '21.8%',
        isPositive: true,
        deltaText: 'vs last month',
        icon: Coins,
      },
      {
        id: 'arpu',
        title: 'ARPU',
        value: '$17.18',
        delta: '16.8%',
        isPositive: true,
        deltaText: 'vs last month',
        icon: Users,
      },
      {
        id: 'churn-rate',
        title: 'Churn Rate',
        value: '3.2%',
        delta: '12.8%',
        isPositive: false, // In the screenshot, Churn Rate is red down arrow: "↓ 12.8% vs last month"
        deltaText: 'vs last month',
        icon: BarChart2,
      },
    ],
    Week: [
      {
        id: 'total-revenue',
        title: 'Total Revenue',
        value: '$22.4K',
        delta: '8.4%',
        isPositive: true,
        deltaText: 'vs last week',
        icon: DollarSign,
      },
      {
        id: 'mrr',
        title: 'Monthly Recurring Revenue',
        value: '$5.6k',
        delta: '14.2%',
        isPositive: true,
        deltaText: 'vs last week',
        icon: Coins,
      },
      {
        id: 'arpu',
        title: 'ARPU',
        value: '$16.90',
        delta: '4.2%',
        isPositive: true,
        deltaText: 'vs last week',
        icon: Users,
      },
      {
        id: 'churn-rate',
        title: 'Churn Rate',
        value: '2.9%',
        delta: '5.1%',
        isPositive: false,
        deltaText: 'vs last week',
        icon: BarChart2,
      },
    ],
    Days: [
      {
        id: 'total-revenue',
        title: 'Total Revenue',
        value: '$3.8K',
        delta: '4.1%',
        isPositive: true,
        deltaText: 'vs yesterday',
        icon: DollarSign,
      },
      {
        id: 'mrr',
        title: 'Monthly Recurring Revenue',
        value: '$820',
        delta: '9.3%',
        isPositive: true,
        deltaText: 'vs yesterday',
        icon: Coins,
      },
      {
        id: 'arpu',
        title: 'ARPU',
        value: '$17.05',
        delta: '1.2%',
        isPositive: true,
        deltaText: 'vs yesterday',
        icon: Users,
      },
      {
        id: 'churn-rate',
        title: 'Churn Rate',
        value: '3.1%',
        delta: '1.8%',
        isPositive: false,
        deltaText: 'vs yesterday',
        icon: BarChart2,
      },
    ],
  };

  const currentMetrics = metricsData[timeRange];

  return (
    <section className="w-full space-y-4">
      {/* Overview Title and Filter Pills */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Overview
        </h2>

        {/* Time Selector Pills: Days, Week, Month */}
        <div className="flex items-center p-1 rounded-full bg-slate-200/50 dark:bg-[#151A24] border border-slate-200/60 dark:border-slate-800 text-xs font-semibold shadow-2xs">
          {(['Days', 'Week', 'Month'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => onTimeRangeChange(range)}
              className={`px-3.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                timeRange === range
                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs font-bold scale-[1.02]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {currentMetrics.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-[#151A24] rounded-[22px] p-5 sm:p-6 border border-slate-200/60 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80 hover:bg-slate-50/50 dark:hover:bg-[#181E29] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              {/* Top: Icon in circle + Title */}
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:border-blue-500/60 group-hover:text-blue-600 transition-colors shrink-0">
                  <Icon className="w-3.5 h-3.5 stroke-[2]" />
                </div>
                <span className="text-xs sm:text-[13px] font-semibold text-slate-600 dark:text-slate-300 truncate tracking-tight">
                  {item.title}
                </span>
              </div>

              {/* Big Metric Value */}
              <div className="my-3">
                <div className="text-2xl sm:text-[30px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-sans">
                  {item.value}
                </div>
              </div>

              {/* Delta Tag: Arrow + % + text */}
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {item.isPositive ? (
                  <span className="flex items-center gap-0.5 text-emerald-500 dark:text-emerald-400">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{item.delta}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-rose-500 dark:text-rose-400">
                    <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{item.delta}</span>
                  </span>
                )}
                <span className="text-slate-400 dark:text-slate-500 font-normal text-[11px]">
                  {item.deltaText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
