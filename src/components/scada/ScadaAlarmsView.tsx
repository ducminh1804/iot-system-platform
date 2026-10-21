import React, { useState } from 'react';
import { ShieldAlert, Bell, AlertTriangle, CheckCircle, Wrench, RefreshCw, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface AlarmEvent {
  id: string;
  timestamp: string;
  turbine: string;
  code: number;
  severity: 'critical' | 'warning' | 'caution' | 'service';
  message: string;
  acknowledged: boolean;
}

const INITIAL_ALARMS: AlarmEvent[] = [
  {
    id: 'a1',
    timestamp: '24.06.18 12:35:01',
    turbine: 'Unit 05',
    code: 512,
    severity: 'critical',
    message: '512 - Converter IGBT overtemperature threshold tripped',
    acknowledged: false,
  },
  {
    id: 'a2',
    timestamp: '24.06.18 12:34:10',
    turbine: 'Unit 06',
    code: 1,
    severity: 'warning',
    message: '1 - System state is degraded: Hydraulic pitch loop delta pressure > 15 bar',
    acknowledged: false,
  },
  {
    id: 'a3',
    timestamp: '24.06.18 12:30:45',
    turbine: 'Unit 08',
    code: 1,
    severity: 'warning',
    message: '1 - System state is degraded: Nacelle yaw error > 12.5 deg',
    acknowledged: true,
  },
  {
    id: 'a4',
    timestamp: '24.06.18 12:28:12',
    turbine: 'Unit 07',
    code: 5,
    severity: 'caution',
    message: '5 - Grid frequency oscillation detected (49.85 Hz)',
    acknowledged: true,
  },
  {
    id: 'a5',
    timestamp: '24.06.18 11:55:00',
    turbine: 'Unit 02',
    code: 0,
    severity: 'service',
    message: '0 - Scheduled gearbox filter replacement in progress',
    acknowledged: true,
  },
];

export const ScadaAlarmsView: React.FC = () => {
  const [alarms, setAlarms] = useState<AlarmEvent[]>(INITIAL_ALARMS);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const handleAcknowledge = (id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
    toast.success('Alarm acknowledged', { duration: 2000 });
  };

  const filtered = alarms.filter((a) => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1E2126] text-slate-800 dark:text-slate-200 overflow-y-auto select-none p-3 lg:p-4">
      {/* Alarms Header & Filter */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#2D3137]">
        <div className="flex items-center gap-3">
          <div className="bg-[#E52E2D] text-white p-2 rounded">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Active Alarm Console</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time SCADA trip points and warning events across parks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'critical', 'warning', 'caution', 'service'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded text-xs font-bold capitalize transition-colors ${
                filterSeverity === sev
                  ? 'bg-[#E52E2D] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#282C33] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#333842]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alarm Events Table */}
      <div className="flex-1 overflow-x-auto mt-3">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-300 dark:border-[#383D45] text-slate-900 dark:text-white font-extrabold">
              <th className="py-2.5 px-3">Severity</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Turbine Unit</th>
              <th className="py-2.5 px-3">Code</th>
              <th className="py-2.5 px-3">Event Description</th>
              <th className="py-2.5 px-3 text-right">Status / Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#282C33]">
            {filtered.map((alarm) => (
              <tr
                key={alarm.id}
                className="hover:bg-slate-50 dark:hover:bg-[#25282E]/70 transition-colors"
              >
                <td className="py-2 px-3">
                  {alarm.severity === 'critical' ? (
                    <span className="inline-flex items-center gap-1 text-[#EF4444] font-bold">
                      <Bell className="w-3.5 h-3.5 fill-[#EF4444]" /> Critical
                    </span>
                  ) : alarm.severity === 'warning' ? (
                    <span className="inline-flex items-center gap-1 text-[#F97316] font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" /> Warning
                    </span>
                  ) : alarm.severity === 'caution' ? (
                    <span className="inline-flex items-center gap-1 text-[#EAB308] font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#EAB308]" /> Caution
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#3B82F6] font-bold">
                      <Wrench className="w-3.5 h-3.5" /> Service
                    </span>
                  )}
                </td>
                <td className="py-2 px-3 font-mono text-slate-500 dark:text-slate-400">
                  {alarm.timestamp}
                </td>
                <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">
                  {alarm.turbine}
                </td>
                <td className="py-2 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                  {alarm.code}
                </td>
                <td className="py-2 px-3 text-slate-800 dark:text-slate-200 font-medium">
                  {alarm.message}
                </td>
                <td className="py-2 px-3 text-right">
                  {alarm.acknowledged ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle className="w-3 h-3" /> Ack
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAcknowledge(alarm.id)}
                      className="px-2 py-0.5 bg-[#E52E2D] hover:bg-[#D42625] text-white font-bold text-[11px] rounded transition-transform active:scale-95"
                    >
                      Acknowledge
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
