import React from 'react';
import { BRAND_LOGO_BASE64 } from '../constants';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  className?: string;
  animate?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  animate = true
}) => {
  const sizeMap = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    hero: 'w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44'
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Exact Circular Badge Container with Neon Glow */}
      <div className="relative group flex-shrink-0">
        {/* Ambient Neon Glow Aura */}
        <div
          className={`absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500/30 via-emerald-500/40 to-cyan-500/30 blur-md opacity-75 group-hover:opacity-100 transition-all duration-500 ${
            animate ? 'animate-pulse' : ''
          }`}
        />

        {/* Outer Ring with Cyber Accent */}
        <div className={`relative ${sizeMap[size]} rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-emerald-400 to-amber-500 shadow-[0_0_15px_rgba(34,197,94,0.35)] overflow-hidden flex items-center justify-center bg-[#070D16]`}>
          <img
            src={BRAND_LOGO_BASE64}
            alt="MISSION_SSC_CGL DIGI BOOKS"
            className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
            loading="eager"
            onError={(e) => {
              // Fallback to stylized vector badge if image rendering fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Typography with Precise Branding */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center flex-wrap gap-1 leading-tight tracking-tight font-extrabold text-sm sm:text-base md:text-lg font-['Outfit',sans-serif]">
            <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">MISSION_</span>
            <span className="text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]">SSC_</span>
            <span className="text-white">CGL</span>
            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-lime-400 text-[#070D16] shadow-[0_0_12px_rgba(34,197,94,0.5)]">
              DIGI BOOKS
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold tracking-wider text-emerald-400/90 uppercase font-['Rajdhani',sans-serif]">
            <span>Premium Digital Products</span>
            <span className="text-amber-400/70">•</span>
            <span className="hidden sm:inline text-slate-400 font-normal">Dream • Believe • Achieve</span>
          </div>
        </div>
      )}
    </div>
  );
};
