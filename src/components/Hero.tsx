import React from 'react';
import { 
  BRAND_NAME, 
  BRAND_TAGLINE, 
  AUTHOR_NAME, 
  BRAND_LOGO_BASE64 
} from '../constants';
import { 
  BookOpen, 
  Gift, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Download, 
  Star,
  Users,
  FileText
} from 'lucide-react';

interface HeroProps {
  totalCount: number;
  freeCount: number;
  onExploreEbooks: () => void;
  onExploreFree: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  totalCount,
  freeCount,
  onExploreEbooks,
  onExploreFree
}) => {
  return (
    <section 
      id="hero"
      className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden bg-gradient-to-b from-[#08111D] via-[#0B1523] to-[#0F2439]"
    >
      {/* Background Decorative Ambient Light Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-amber-600/10 blur-[140px] rounded-full pointer-events-none" />
      
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E3A5F_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7 flex flex-col text-center lg:text-left items-center lg:items-start">
            
            {/* Top Brand Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm shadow-amber-500/10 animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SSC CGL Preparation • Digital Resource Hub</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-slate-300 text-xs">By {AUTHOR_NAME}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
              Crack SSC CGL with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 drop-shadow-[0_4px_12px_rgba(232,163,61,0.25)]">
                Curated Notes & eBooks
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
              Handpicked subject-wise PDFs, PYQ formula sheets, and top-recommended books designed strictly according to latest SSC CGL Tier 1 & Tier 2 exam trends.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10">
              <button
                onClick={onExploreEbooks}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5 active:scale-95"
                id="hero-explore-ebooks-btn"
              >
                <BookOpen className="w-5 h-5" />
                <span>Explore Premium eBooks</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onExploreFree}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700/80 hover:border-amber-400/50 font-bold text-sm sm:text-base transition-all shadow-md transform hover:-translate-y-0.5 active:scale-95"
                id="hero-explore-free-btn"
              >
                <Gift className="w-5 h-5 text-emerald-400" />
                <span>Free Study Material</span>
              </button>
            </div>

            {/* Live Stats Row */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-slate-800/80 w-full max-w-lg">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1 text-lg sm:text-2xl font-black text-amber-400">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{totalCount > 0 ? `${totalCount}+` : '50+'}</span>
                </div>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium">
                  Study Resources
                </span>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1 text-lg sm:text-2xl font-black text-emerald-400">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{freeCount > 0 ? `${freeCount}+` : 'Free'}</span>
                </div>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium">
                  Free Downloads
                </span>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1 text-lg sm:text-2xl font-black text-amber-300">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                  <span>100%</span>
                </div>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium">
                  Exam Verified
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual 3D Logo Showcase & Trust Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md">
              
              {/* Outer Glowing Ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-500/30 via-blue-500/20 to-amber-300/30 blur-xl opacity-70 animate-pulse" />

              {/* Main 3D Card */}
              <div className="relative rounded-3xl bg-gradient-to-b from-[#132840] via-[#0F2439] to-[#0A1624] border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
                
                {/* Brand Emblem */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-gradient-to-br from-amber-400 via-amber-600 to-slate-900 shadow-xl shadow-amber-500/20 mb-6 group-hover:rotate-1 transition-transform">
                  <img 
                    src={BRAND_LOGO_BASE64} 
                    alt={BRAND_NAME} 
                    className="w-full h-full object-contain rounded-[14px] bg-[#0F2439]"
                  />
                </div>

                {/* Badge and Tagline */}
                <div className="inline-block px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">
                  Official Store
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide mb-1">
                  MISSION_SSC_CGL
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-400 italic mb-6">
                  "{BRAND_TAGLINE}"
                </p>

                {/* Feature Highlights Grid */}
                <div className="w-full grid grid-cols-2 gap-2.5 text-left text-xs font-medium">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200">
                    <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Instant PDF Access</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>100% Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200">
                    <BookOpen className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <span>Updated PYQs</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200">
                    <Users className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>Aspirants Trusted</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
