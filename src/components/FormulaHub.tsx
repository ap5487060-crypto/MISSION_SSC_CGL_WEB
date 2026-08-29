import React, { useState } from 'react';
import { FORMULA_CARDS } from '../constants';
import { 
  Zap, 
  Search, 
  Copy, 
  Check, 
  Sparkles, 
  BookOpen, 
  Calculator, 
  Brain, 
  Bookmark, 
  FileText 
} from 'lucide-react';

export const FormulaHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const subjects = [
    { id: 'all', label: 'All Subjects', icon: Sparkles },
    { id: 'Quantitative Aptitude', label: 'Maths / Quant', icon: Calculator },
    { id: 'English Language', label: 'English Grammar', icon: BookOpen },
    { id: 'Reasoning', label: 'Reasoning Tricks', icon: Brain }
  ];

  const filteredCards = FORMULA_CARDS.filter((card) => {
    const matchesSub = selectedSubject === 'all' || card.subject === selectedSubject;
    const matchesSearch = 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.formula.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSub && matchesSearch;
  });

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="formula-hub-section" className="py-12 sm:py-16 bg-[#070D16] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 neon-glow-amber">
            <Zap className="w-3.5 h-3.5" />
            <span>High-Yield Revision Cheatsheets</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3 font-['Outfit',sans-serif]">
            Formula & Shortcut <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400">Master Vault</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Instant 5-second formulas, algebraic relations, geometry theorems, and grammar rules for fast exam revision.
          </p>
        </div>

        {/* Controls: Search & Subject Filters */}
        <div className="cyber-card rounded-2xl p-4 sm:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Subject Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {subjects.map((s) => {
              const Icon = s.icon;
              const isSelected = selectedSubject === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSubject(s.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-[#070D16] shadow-md shadow-amber-500/20'
                      : 'bg-[#0A1524] text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formula, theorem, rule..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A1524] border border-slate-800 focus:border-amber-400 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

        </div>

        {/* Formula Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card, idx) => (
            <div
              key={idx}
              className="cyber-card rounded-2xl p-5 flex flex-col justify-between group hover:border-amber-500/40"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 tracking-wider">
                    {card.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {card.subject}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                  {card.title}
                </h4>

                <div className="relative rounded-xl bg-[#070D16] border border-slate-800/80 p-3.5 mb-3 font-mono text-xs text-emerald-300 leading-relaxed whitespace-pre-line shadow-inner">
                  {card.formula}
                  <button
                    onClick={() => handleCopy(card.formula, idx)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                    title="Copy Formula"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-400">
                <span className="text-amber-400 font-bold flex-shrink-0">📌 Note:</span>
                <span>{card.note}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
