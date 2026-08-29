import React from 'react';
import { BookOpen, Gift, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { BRAND_NAME, BRAND_TAGLINE } from '../constants';

interface FinalCTAProps {
  onExploreEbooks: () => void;
  onExploreFree: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  onExploreEbooks,
  onExploreFree
}) => {
  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-8 sm:p-14 shadow-2xl shadow-amber-500/20 overflow-hidden text-slate-950">
        
        {/* Background Decorative Patterns */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/20 blur-2xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-black/10 blur-2xl rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-950/10 border border-slate-950/20 text-slate-950 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Target SSC CGL Tier 1 & Tier 2</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Start Your SSC CGL Preparation with the Right Resources
          </h2>

          <p className="text-sm sm:text-base font-semibold text-slate-900 max-w-xl mx-auto">
            Get instant access to curated eBooks, formula notes, and top topper-recommended study books today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onExploreEbooks}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-sm sm:text-base shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Explore eBooks Catalog</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onExploreFree}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/90 hover:bg-white text-slate-950 font-black text-sm sm:text-base shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Gift className="w-5 h-5 text-emerald-600" />
              <span>Download Free Study PDFs</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-900 pt-4">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Secure Checkout • Instant Digital PDF Download</span>
          </div>

        </div>

      </div>
    </section>
  );
};
