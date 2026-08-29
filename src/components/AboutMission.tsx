import React from 'react';
import { 
  BRAND_NAME, 
  BRAND_TAGLINE, 
  BRAND_MOTTO_TOP, 
  BRAND_MOTTO_BOTTOM,
  AUTHOR_NAME, 
  INSTAGRAM_HANDLE,
  TELEGRAM_HANDLE,
  CONTACT_EMAIL,
  BRAND_LOGO_BASE64 
} from '../constants';
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  Shield, 
  Target, 
  Rocket, 
  Users, 
  Mail, 
  Send, 
  Instagram,
  Heart
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const AboutMission: React.FC = () => {
  return (
    <section id="about" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-br from-[#0F1D31] via-[#0A1524] to-[#070D16] border border-emerald-500/30 p-6 sm:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Neon Glow */}
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Logo & Visual Emblem */}
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
            <BrandLogo size="hero" showText={false} animate={true} />

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
                MISSION<span className="text-amber-400">_SSC_CGL</span>
              </h3>
              <div className="inline-block mt-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black tracking-widest uppercase">
                DIGI BOOKS • PREMIUM
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#070D16] border border-slate-800 text-xs text-slate-300 w-full space-y-1">
              <div className="font-bold text-white">★ {BRAND_MOTTO_TOP} ★</div>
              <div className="text-[11px] text-amber-400 font-semibold">{BRAND_MOTTO_BOTTOM}</div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              Founded & Curated by <span className="text-white font-extrabold">{AUTHOR_NAME}</span>
            </div>
          </div>

          {/* About Narrative */}
          <div className="lg:col-span-8 space-y-5 text-slate-300">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Official Story & Mission</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-['Outfit',sans-serif] leading-tight">
              Your Dedicated Study Partner to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">Crack SSC CGL</span>
            </h2>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              <strong className="text-white">{BRAND_NAME}</strong> was built on a simple yet unyielding philosophy: <em className="text-amber-300">"Quality over Quantity"</em>. SSC exams demand rapid 5-second problem-solving skills, crystal-clear conceptual clarity, and disciplined formula retention.
            </p>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              Rather than drowning aspirants in 800-page bulky textbooks, we distill the highest-yielding TCS patterns, algebraic formulas, 100 golden English grammar rules, and static GK visual charts into ultra-compact, high-DPI digital study eBooks and verified physical book links.
            </p>

            {/* Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#070D16] border border-slate-800 text-xs font-semibold text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Strictly Latest TCS Exam Pattern Aligned</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#070D16] border border-slate-800 text-xs font-semibold text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Instant Multi-Device PDF Downloads</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#070D16] border border-slate-800 text-xs font-semibold text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Student-Friendly Pocket Pricing</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#070D16] border border-slate-800 text-xs font-semibold text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Official Verified Publisher Links</span>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-bold transition-all shadow-md shadow-emerald-500/10"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Contact: {CONTACT_EMAIL}</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
