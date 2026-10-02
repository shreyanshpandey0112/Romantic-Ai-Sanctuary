import React from 'react';

export const FloralCorner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-16 h-16 pointer-events-none opacity-40 text-rose-300 dark:text-rose-400 ${className}`}
  >
    <path
      d="M10 110C10 60 50 20 110 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M25 110C25 70 60 35 110 25"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    {/* Delicate petals */}
    <circle cx="28" cy="92" r="5" fill="currentColor" fillOpacity="0.3" />
    <circle cx="48" cy="68" r="6" fill="currentColor" fillOpacity="0.4" />
    <circle cx="72" cy="46" r="5" fill="currentColor" fillOpacity="0.3" />
    <circle cx="94" cy="26" r="4" fill="currentColor" fillOpacity="0.5" />
    {/* Small leaves */}
    <path
      d="M48 68Q58 56 62 64Q54 74 48 68Z"
      fill="currentColor"
      fillOpacity="0.5"
    />
    <path
      d="M72 46Q82 34 86 42Q78 52 72 46Z"
      fill="currentColor"
      fillOpacity="0.5"
    />
  </svg>
);

export const FloralDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-3 my-6 text-rose-300 dark:text-rose-400/60 ${className}`}>
    <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-300/60 dark:to-rose-400/40" />
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2C13.5 6 18 8 18 12C18 16 13.5 18 12 22C10.5 18 6 16 6 12C6 8 10.5 6 12 2Z" fillOpacity="0.6"/>
      <circle cx="12" cy="12" r="2.5" />
    </svg>
    <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-300/60 dark:to-rose-400/40" />
  </div>
);

export const WaxSealBadge: React.FC<{ text?: string; color?: string; onClick?: () => void }> = ({
  text = 'LOVE',
  color = '#FDA4AF',
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative inline-flex items-center justify-center p-3 transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none"
    title="An authentic wax seal of devotion"
  >
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center shadow-md relative overflow-hidden transition-all duration-300 group-hover:shadow-rose-300/50"
      style={{ backgroundColor: color }}
    >
      <div className="absolute inset-0.5 border-2 border-white/40 rounded-full border-dashed" />
      <span className="text-[10px] font-serif font-bold tracking-widest text-white drop-shadow">
        {text}
      </span>
    </div>
  </button>
);
