import React from 'react';
import { WHY_CHOOSE_ITEMS } from '../constants';
import { 
  Target, 
  Zap, 
  Smartphone, 
  Coins, 
  Gift, 
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  Zap,
  Smartphone,
  Coins,
  Gift,
  ShieldCheck
};

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-us" className="py-16 sm:py-24 bg-[#0A1624]/80 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Why Aspirants Trust Us</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Designed for Serious <span className="text-amber-400">SSC CGL Aspirants</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            We focus on what actually comes in the exam, saving your preparation time and boosting accuracy.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_ITEMS.map((item, index) => {
            const Icon = iconMap[item.icon] || CheckCircle2;
            return (
              <div
                key={index}
                className="group relative rounded-2xl bg-[#0F2439]/90 hover:bg-[#132B45] border border-slate-800 hover:border-amber-500/40 p-6 sm:p-7 shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-400/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
