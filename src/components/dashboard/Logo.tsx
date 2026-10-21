import React from 'react';

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="App Logo"
    >
      {/* Trefoil modern clover knot logo */}
      <circle cx="16" cy="11" r="6" stroke="#2563EB" strokeWidth="2.5" />
      <circle cx="11.5" cy="19" r="6" stroke="#2563EB" strokeWidth="2.5" />
      <circle cx="20.5" cy="19" r="6" stroke="#2563EB" strokeWidth="2.5" />
    </svg>
  );
}

export function SidebarCollapseIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2.5" y="3.5" width="15" height="13" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="8" y1="3.5" x2="8" y2="16.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
