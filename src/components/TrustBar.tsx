import React from 'react';
import { Target, Zap, Truck, ShieldCheck } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const pillars = [
    {
      icon: Target,
      title: "100% Exam-Oriented",
      desc: "Updated as per SSC CGL latest pattern & PYQs",
      color: "text-amber-400"
    },
    {
      icon: Zap,
      title: "Instant Digital Delivery",
      desc: "Direct PDF download immediately after payment",
      color: "text-sky-400"
    },
    {
      icon: Truck,
      title: "Official Book Delivery",
      desc: "Fast & reliable courier via Amazon & Flipkart",
      color: "text-emerald-400"
    },
    {
      icon: ShieldCheck,
      title: "Secure Razorpay Gateway",
      desc: "Protected payments via UPI, Cards & NetBanking",
      color: "text-amber-300"
    }
  ];

  return (
    <section className="relative z-20 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-gradient-to-r from-[#11243A] via-[#142C47] to-[#11243A] border border-amber-500/20 p-5 sm:p-6 shadow-xl shadow-black/50 backdrop-blur-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="flex items-start gap-3.5 group"
              >
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-sm group-hover:border-amber-400/40 group-hover:scale-105 transition-all">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </span>
                  <span className="text-xs text-slate-400 leading-snug mt-0.5">
                    {item.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
