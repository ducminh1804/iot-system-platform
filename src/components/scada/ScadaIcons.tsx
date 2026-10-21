import React from 'react';

export const PylonIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v20" />
    <path d="m8 6 8 0" />
    <path d="m6 10 12 0" />
    <path d="m4 15 16 0" />
    <path d="m7 22 5-20 5 20" />
    <path d="m7 15 5-5 5 5" />
    <path d="m8 10 4-4 4 4" />
  </svg>
);

export const SubstationIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="10" width="7" height="11" rx="1" />
    <rect x="14" y="6" width="7" height="15" rx="1" />
    <path d="M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v0" />
    <path d="M7 14h.01M7 17h.01M17 10h.01M17 13h.01M17 16h.01" />
  </svg>
);

export const TurbineMastIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 11v11" />
    <circle cx="12" cy="11" r="2" fill="currentColor" fillOpacity="0.2" />
    <path d="M12 9V3" />
    <path d="m10.5 12-5.5 3.5" />
    <path d="m13.5 12 5.5 3.5" />
    <path d="M8 22h8" />
  </svg>
);

export const ReactivePowerIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 3v4M15 3v4" />
    <circle cx="12" cy="14" r="7" />
    <path d="M12 11v6l-2-2" />
  </svg>
);

export const CircularLightningIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M13 2 4.5 13.5H11L10 22l9.5-11.5H13L14 2Z" />
    <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
  </svg>
);

export const GridTowerIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m4 22 8-19 8 19" />
    <path d="M6 17h12" />
    <path d="M8 12h8" />
    <path d="M10 7h4" />
    <path d="m6 17 6-5 6 5" />
    <path d="m8 12 4-5 4 5" />
  </svg>
);

export const TurbineWatermarkSvg: React.FC<{ className?: string }> = ({ className = 'w-32 h-32' }) => (
  <svg viewBox="0 0 200 200" fill="none" className={className}>
    <circle cx="100" cy="100" r="12" fill="currentColor" fillOpacity="0.08" />
    {/* Blade 1 (Top) */}
    <path
      d="M100 100 C98 85, 93 40, 100 10 C107 40, 102 85, 100 100 Z"
      fill="currentColor"
      fillOpacity="0.06"
    />
    {/* Blade 2 (Bottom Right) */}
    <g transform="rotate(120 100 100)">
      <path
        d="M100 100 C98 85, 93 40, 100 10 C107 40, 102 85, 100 100 Z"
        fill="currentColor"
        fillOpacity="0.06"
      />
    </g>
    {/* Blade 3 (Bottom Left) */}
    <g transform="rotate(240 100 100)">
      <path
        d="M100 100 C98 85, 93 40, 100 10 C107 40, 102 85, 100 100 Z"
        fill="currentColor"
        fillOpacity="0.06"
      />
    </g>
    {/* Mast */}
    <path d="M96 100 L93 195 L107 195 L104 100 Z" fill="currentColor" fillOpacity="0.04" />
  </svg>
);

export const FanStatusIcon: React.FC<{ color?: string; className?: string }> = ({
  color = '#22C55E',
  className = 'w-9 h-9',
}) => (
  <div
    className={`rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 ${className}`}
    style={{ backgroundColor: color }}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
      <path d="M12 9C12 6 14 3 16 3C17 4 17 6 15 8C14 9 13 9 12 9Z" fill="#FFFFFF" fillOpacity="0.6" />
      <path d="M15 12C18 12 21 14 21 16C20 17 18 17 16 15C15 14 15 13 15 12Z" fill="#FFFFFF" fillOpacity="0.6" />
      <path d="M12 15C12 18 10 21 8 21C7 20 7 18 9 16C10 15 11 15 12 15Z" fill="#FFFFFF" fillOpacity="0.6" />
      <path d="M9 12C6 12 3 10 3 8C4 7 6 7 8 9C9 10 9 11 9 12Z" fill="#FFFFFF" fillOpacity="0.6" />
    </svg>
  </div>
);

export const WrenchStatusIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`rounded-lg bg-[#3B82F6] flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  </div>
);

export const SirenAlarmStatusIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`rounded-lg bg-[#EF4444] flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      <path d="M4 4l2 2M20 4l-2 2" />
    </svg>
  </div>
);

export const WarningStatusIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`rounded-lg bg-[#EAB308] flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  </div>
);

export const StandbySyncStatusIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`rounded-lg bg-[#94A3B8] flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  </div>
);
