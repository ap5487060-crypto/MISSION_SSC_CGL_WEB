import React, { useState, useEffect } from 'react';
import { 
  FLASHCARDS_DECK, 
  getDailyFlashcards, 
  type Flashcard 
} from '../data/flashcardsData';
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Calculator, 
  BookOpen, 
  Brain, 
  Compass, 
  Lightbulb, 
  Shuffle, 
  CheckCircle2,
  Calendar,
  Flame,
  Zap,
  HelpCircle
} from 'lucide-react';

export const FlashcardsSection: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'maths' | 'english' | 'reasoning' | 'gk'>('all');
  const [isDailyOnly, setIsDailyOnly] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mssc_mastered_flashcards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Calculate filtered cards
  const getFilteredDeck = (): Flashcard[] => {
    let pool = FLASHCARDS_DECK;
    if (selectedSubject !== 'all') {
      pool = pool.filter(c => c.subject === selectedSubject);
    }
    if (isDailyOnly) {
      return getDailyFlashcards(pool, 6);
    }
    return pool;
  };

  const deck = getFilteredDeck();
  const currentCard: Flashcard | undefined = deck[currentIndex] || deck[0];

  // Save mastered IDs to local storage
  useEffect(() => {
    try {
      localStorage.setItem('mssc_mastered_flashcards', JSON.stringify(masteredIds));
    } catch {
      // Ignored
    }
  }, [masteredIds]);

  // Reset index when subject changes or deck length changes
  const handleSubjectChange = (subject: 'all' | 'maths' | 'english' | 'reasoning' | 'gk') => {
    setSelectedSubject(subject);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % deck.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    if (deck.length > 1) {
      const nextRandom = Math.floor(Math.random() * deck.length);
      setCurrentIndex(nextRandom === currentIndex ? (nextRandom + 1) % deck.length : nextRandom);
    }
  };

  const toggleMastered = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMasteredIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isCurrentMastered = currentCard ? masteredIds.includes(currentCard.id) : false;

  const subjectsList = [
    { id: 'all', label: 'All Subjects', icon: Sparkles, color: 'text-amber-400' },
    { id: 'maths', label: 'Maths Formulas', icon: Calculator, color: 'text-yellow-400' },
    { id: 'english', label: 'English Rules', icon: BookOpen, color: 'text-emerald-400' },
    { id: 'reasoning', label: 'Reasoning', icon: Brain, color: 'text-cyan-400' },
    { id: 'gk', label: 'Polity & GK', icon: Compass, color: 'text-purple-400' },
  ] as const;

  // Format today's date for daily badge
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short'
  });

  return (
    <section id="flashcards-revision-deck" className="py-12 sm:py-16 bg-[#070D16] relative overflow-hidden border-b border-slate-800/60">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 neon-glow-green">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Rapid Revision</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2 font-['Outfit',sans-serif]">
            Flashcards <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">Revision Deck</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Click to flip interactive flashcards for high-yield Maths formulas, English 100 Golden Rules, and exam shortcuts.
          </p>
        </div>

        {/* Subject Filter Pills & Daily Rotation Switch */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-2 rounded-2xl bg-[#0B1523] border border-slate-800/80">
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto no-scrollbar">
            {subjectsList.map((sub) => {
              const Icon = sub.icon;
              const isSelected = selectedSubject === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSubjectChange(sub.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : sub.color}`} />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Mode Toggle: Daily Deck vs All Cards */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => {
                setIsDailyOnly(!isDailyOnly);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isDailyOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Filter by Today's Rotated Daily Set"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Daily Rotation ({todayFormatted})</span>
            </button>

            <button
              onClick={handleShuffle}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Shuffle Deck Randomly"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* The Flip Flashcard Box */}
        {currentCard ? (
          <div className="w-full max-w-2xl mx-auto perspective-1000">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative min-h-[300px] sm:min-h-[340px] cursor-pointer rounded-3xl p-6 sm:p-8 transition-all duration-500 transform hover:scale-[1.01] shadow-2xl flex flex-col justify-between select-none cyber-card border-slate-700/80 group"
              style={{
                background: isFlipped 
                  ? 'linear-gradient(145deg, #09192B 0%, #06111E 100%)' 
                  : 'linear-gradient(145deg, #0D1B2D 0%, #07101B 100%)',
                borderColor: isFlipped ? 'rgba(52, 211, 153, 0.4)' : 'rgba(245, 158, 11, 0.4)'
              }}
            >
              {/* Top metadata row */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-800/90 text-amber-300 border border-slate-700">
                    {currentCard.category}
                  </span>
                  {currentCard.pyqFrequency && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-400" />
                      {currentCard.pyqFrequency} PYQ
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleMastered(currentCard.id, e)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                      isCurrentMastered
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                    title={isCurrentMastered ? "Marked as Mastered" : "Mark as Mastered"}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrentMastered ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>{isCurrentMastered ? 'Mastered' : 'Mark Learned'}</span>
                  </button>

                  <div className="text-[11px] font-mono text-slate-400 font-bold px-2 py-0.5 rounded bg-slate-800/60">
                    {currentIndex + 1} / {deck.length}
                  </div>
                </div>
              </div>

              {/* Main Card Content */}
              <div className="flex-1 flex flex-col justify-center py-4">
                {!isFlipped ? (
                  // Front Face (Question / Prompt)
                  <div className="space-y-4 text-center animate-in fade-in duration-300">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Question / Concept Rule</span>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-black text-white leading-snug font-['Outfit',sans-serif] px-2">
                      {currentCard.front}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 pt-2">
                      <RotateCw className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span className="text-emerald-300 font-medium">Click anywhere on card to reveal answer & formula</span>
                    </p>
                  </div>
                ) : (
                  // Back Face (Answer / Formula / Explanation)
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                      <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Key Formula & Explanation
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Click to flip back</span>
                    </div>

                    <div className="bg-[#050B13] p-4 rounded-2xl border border-slate-800/80 font-mono text-xs sm:text-sm text-emerald-300 leading-relaxed whitespace-pre-line shadow-inner">
                      {currentCard.back}
                    </div>

                    {currentCard.tip && (
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-normal">
                        <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-400">Pro Tip: </strong>
                          {currentCard.tip}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom bar indicator */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <RotateCw className="w-3 h-3 text-slate-400" />
                  Tap to flip
                </span>
                <span className="text-emerald-400 font-semibold">
                  {masteredIds.length} cards mastered overall
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Navigation Controls: Prev, Shuffle, Next */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all active:scale-95"
            title="Previous Flashcard"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-neon-primary font-black text-xs sm:text-sm transition-all active:scale-95"
          >
            <RotateCw className="w-4 h-4" />
            <span>{isFlipped ? 'Show Question' : 'Flip to Answer'}</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all active:scale-95"
            title="Next Flashcard"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
