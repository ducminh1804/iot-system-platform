import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface ScadaUnitTreeSidebarProps {
  selectedUnitId: string;
  onSelectUnit: (unitId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface TreeNode {
  id: string;
  label: string;
  statusColor: string; // 'green', 'red', 'yellow', 'orange', 'blue', 'gray'
  checked: boolean;
  icon?: string;
  children?: TreeNode[];
}

export const ScadaUnitTreeSidebar: React.FC<ScadaUnitTreeSidebarProps> = ({
  selectedUnitId,
  onSelectUnit,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    china: true,
    shicheng: true,
    germany: true,
  });

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const getStatusDot = (color: string) => {
    switch (color) {
      case 'green':
        return <span className="w-2.5 h-2.5 rounded-sm bg-[#22C55E] inline-block shrink-0" />;
      case 'red':
        return <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444] inline-block shrink-0" />;
      case 'yellow':
        return <span className="w-2.5 h-2.5 rounded-sm bg-[#EAB308] inline-block shrink-0" />;
      case 'orange':
        return <span className="w-2.5 h-2.5 rounded-sm bg-[#F97316] inline-block shrink-0" />;
      case 'blue':
        return <span className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6] inline-block shrink-0" />;
      default:
        return <span className="w-2.5 h-2.5 rounded-sm bg-[#94A3B8] inline-block shrink-0" />;
    }
  };

  if (isCollapsed) {
    return (
      <div className="hidden md:flex w-8 shrink-0 bg-[#292D33] dark:bg-[#1C1F24] border-r border-[#22252A] flex-col items-center py-3">
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"
          title="Expand Unit Tree"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside className="w-[230px] shrink-0 bg-[#F1F3F5] dark:bg-[#25282E] border-r border-[#E2E8F0] dark:border-[#1E2126] hidden md:flex flex-col h-full select-none text-slate-700 dark:text-slate-200 text-xs">
      {/* Top Header: Total units and collapse button */}
      <div className="p-3 pb-2 flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#2D3138]">
        <div className="flex items-baseline gap-1">
          <span className="font-extrabold text-sm text-slate-900 dark:text-white">345 656</span>
          <span className="text-[11px] text-slate-400">units</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
          title="Collapse Sidebar"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-2.5 pt-2">
        <div className="relative">
          <input
            type="text"
            placeholder=""
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-[#1D2024] border border-[#CBD5E1] dark:border-[#33373E] rounded px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#E52E2D]"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
        </div>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {/* Country: China */}
        <div>
          <div className="flex items-center justify-between py-1 px-1 hover:bg-black/5 dark:hover:bg-white/5 rounded cursor-pointer">
            <div className="flex items-center gap-1.5" onClick={() => toggleNode('china')}>
              {expandedNodes.china ? (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-slate-400" />
              )}
              {getStatusDot('red')}
              <span className="font-bold text-slate-900 dark:text-white">China</span>
            </div>
            <input type="checkbox" defaultChecked className="rounded accent-[#E52E2D] w-3.5 h-3.5 cursor-pointer" />
          </div>

          {expandedNodes.china && (
            <div className="ml-3 pl-1.5 border-l border-slate-300 dark:border-slate-700 space-y-0.5 mt-0.5">
              {/* Region: Jiuguan */}
              <div className="flex items-center justify-between py-0.5 px-1 hover:bg-black/5 dark:hover:bg-white/5 rounded cursor-pointer">
                <div className="flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  {getStatusDot('green')}
                  <span>Jiuguan</span>
                </div>
                <input type="checkbox" defaultChecked className="rounded accent-[#E52E2D] w-3 h-3 cursor-pointer" />
              </div>

              {/* Region: Shicheng */}
              <div>
                <div className="flex items-center justify-between py-0.5 px-1 hover:bg-black/5 dark:hover:bg-white/5 rounded cursor-pointer">
                  <div className="flex items-center gap-1.5" onClick={() => toggleNode('shicheng')}>
                    {expandedNodes.shicheng ? (
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    )}
                    {getStatusDot('red')}
                    <span className="font-semibold text-slate-800 dark:text-slate-100">Shicheng</span>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded accent-[#E52E2D] w-3 h-3 cursor-pointer" />
                </div>

                {expandedNodes.shicheng && (
                  <div className="ml-3 pl-1.5 border-l border-slate-300 dark:border-slate-700 space-y-0.5 mt-0.5">
                    {[
                      { id: 'u-01', name: 'Unit 01', color: 'green', checked: false },
                      { id: 'u-02', name: 'Unit 02', color: 'green', checked: false },
                      { id: 'u-03', name: 'Unit 02', color: 'red', checked: true, icon: '⚡' },
                      { id: 'u-04', name: 'Unit 01', color: 'yellow', checked: true, icon: '📶' },
                      { id: 'u-05', name: 'Unit 02', color: 'green', checked: false },
                      { id: 'u-06', name: 'Unit 02', color: 'gray', checked: false },
                      { id: 'u-07', name: 'Unit 02', color: 'orange', checked: true, icon: '📶' },
                      { id: 'u-08', name: 'Unit 01', color: 'yellow', checked: true, icon: '📈' },
                      { id: 'u-09', name: 'Unit 02', color: 'blue', checked: false },
                      { id: 'u-10', name: 'Unit 01', color: 'green', checked: false },
                    ].map((unit, idx) => (
                      <div
                        key={`${unit.id}-${idx}`}
                        onClick={() => onSelectUnit(unit.id)}
                        className={`flex items-center justify-between py-0.5 px-1 rounded cursor-pointer transition-colors ${
                          selectedUnitId === unit.id
                            ? 'bg-[#E52E2D]/15 text-[#E52E2D] font-bold'
                            : 'hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {unit.icon && <span className="text-[10px]">{unit.icon}</span>}
                          {getStatusDot(unit.color)}
                          <span className="text-[11px]">{unit.name}</span>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={unit.checked}
                          className="rounded accent-[#E52E2D] w-3 h-3 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Country: USA */}
        <div className="flex items-center justify-between py-1 px-1 hover:bg-black/5 dark:hover:bg-white/5 rounded cursor-pointer">
          <div className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-slate-400" />
            {getStatusDot('green')}
            <span className="font-bold text-slate-900 dark:text-white">USA</span>
          </div>
          <input type="checkbox" defaultChecked className="rounded accent-[#E52E2D] w-3.5 h-3.5 cursor-pointer" />
        </div>

        {/* Country: Germany */}
        <div>
          <div className="flex items-center justify-between py-1 px-1 hover:bg-black/5 dark:hover:bg-white/5 rounded cursor-pointer">
            <div className="flex items-center gap-1.5" onClick={() => toggleNode('germany')}>
              {expandedNodes.germany ? (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-slate-400" />
              )}
              {getStatusDot('yellow')}
              <span className="font-bold text-slate-900 dark:text-white">Germany</span>
            </div>
            <input type="checkbox" defaultChecked className="rounded accent-[#E52E2D] w-3.5 h-3.5 cursor-pointer" />
          </div>

          {expandedNodes.germany && (
            <div className="ml-3 pl-1.5 border-l border-slate-300 dark:border-slate-700 space-y-0.5 mt-0.5">
              <div className="flex items-center justify-between py-0.5 px-1 hover:bg-black/5 dark:hover:bg-white/5 rounded cursor-pointer">
                <div className="flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  {getStatusDot('green')}
                  <span>Boxberg</span>
                </div>
                <input type="checkbox" defaultChecked className="rounded accent-[#E52E2D] w-3 h-3 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between py-0.5 px-1 hover:bg-black/5 dark:hover:bg-white/5 rounded cursor-pointer">
                <div className="flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  {getStatusDot('yellow')}
                  <span>Shonwald</span>
                </div>
                <input type="checkbox" defaultChecked className="rounded accent-[#E52E2D] w-3 h-3 cursor-pointer" />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
