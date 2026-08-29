import React, { useState, useEffect } from 'react';
import { 
  SYLLABUS_MODULES, 
  BRAND_NAME 
} from '../constants';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Flame, 
  Calendar, 
  BookOpen, 
  Target, 
  RotateCcw, 
  Award,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export const SyllabusPlanner: React.FC = () => {
  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ssc_cgl_completed_topics');
      return saved ? JSON.parse(saved) : ['q1', 'e1', 'r1'];
    } catch {
      return ['q1', 'e1', 'r1'];
    }
  });

  const [activeSubject, setActiveSubject] = useState<string>('quant');
  const [streakDays, setStreakDays] = useState<number>(14);

  useEffect(() => {
    try {
      localStorage.setItem('ssc_cgl_completed_topics', JSON.stringify(completedTopics));
    } catch (e) {
      console.error(e);
    }
  }, [completedTopics]);

  const totalTopicsCount = SYLLABUS_MODULES.reduce((acc, m) => acc + m.topics.length, 0);
  const completionPercentage = Math.round((completedTopics.length / totalTopicsCount) * 100);

  const toggleTopic = (id: string) => {
    setCompletedTopics((prev) => 
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    if (window.confirm('Reset your syllabus study progress?')) {
      setCompletedTopics([]);
    }
  };

  const currentModule = SYLLABUS_MODULES.find((m) => m.id === activeSubject) || SYLLABUS_MODULES[0];

  return (
    <section id="syllabus-planner-section" className="py-12 sm:py-16 bg-[#070D16] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 neon-glow-green">
            <Target className="w-3.5 h-3.5" />
            <span>Interactive Aspirant Study Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3 font-['Outfit',sans-serif]">
            SSC CGL Tier 1 & Tier 2 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-amber-400">Syllabus Tracker</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Track your high-yield chapters, formulas, and mock readiness topic-by-topic. Your progress is saved automatically.
          </p>
        </div>

        {/* Top Metric & Gamification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          
          {/* Progress Card */}
          <div className="cyber-card rounded-2xl p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Syllabus</span>
              <div className="text-3xl font-black text-white font-['Outfit',sans-serif]">
                {completionPercentage}% <span className="text-xs font-normal text-emerald-400">Done</span>
              </div>
              <p className="text-xs text-slate-400">
                {completedTopics.length} of {totalTopicsCount} High-Yield Topics
              </p>
            </div>
            
            {/* Progress Circular Dial */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-500"
                  strokeDasharray={`${completionPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-extrabold text-white">{completionPercentage}%</span>
            </div>
          </div>

          {/* Daily Streak Card */}
          <div className="cyber-card rounded-2xl p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consistency Tracker</span>
              <div className="flex items-center gap-2 text-3xl font-black text-amber-400 font-['Outfit',sans-serif]">
                <Flame className="w-7 h-7 fill-amber-400 text-amber-400 animate-pulse" />
                <span>{streakDays} Days</span>
              </div>
              <p className="text-xs text-slate-400">
                "Consistency is what transforms average into excellence."
              </p>
            </div>
            <button
              onClick={() => setStreakDays((s) => s + 1)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-bold transition-all"
              title="Add Today's Revision"
            >
              + Log Day
            </button>
          </div>

          {/* Target Score Card */}
          <div className="cyber-card rounded-2xl p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Objective</span>
              <div className="text-3xl font-black text-cyan-400 font-['Outfit',sans-serif]">
                330+ <span className="text-xs font-normal text-slate-400">/ 390 (Tier 2)</span>
              </div>
              <p className="text-xs text-slate-400">
                Target: ASO / Inspector / Auditor Post
              </p>
            </div>
            <Award className="w-10 h-10 text-cyan-400" />
          </div>

        </div>

        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {SYLLABUS_MODULES.map((mod) => {
            const isActive = activeSubject === mod.id;
            const modDone = mod.topics.filter((t) => completedTopics.includes(t.id)).length;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveSubject(mod.id)}
                className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-[#070D16] shadow-lg shadow-emerald-500/25 scale-[1.02]'
                    : 'bg-[#0F1D31] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{mod.subject}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-[#070D16]/30 text-[#070D16]' : 'bg-slate-800 text-slate-400'}`}>
                  {modDone}/{mod.topics.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subject Syllabus Topic Grid */}
        <div className="cyber-card rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{currentModule.subject}</span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentModule.weightage}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Click any topic below to mark complete once revised with notes & PYQs.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Checklist</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            {currentModule.topics.map((topic) => {
              const isChecked = completedTopics.includes(topic.id);
              return (
                <div
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                      : 'bg-[#0A1524] border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 flex-shrink-0 text-emerald-400 focus:outline-none"
                    aria-label={isChecked ? "Mark Incomplete" : "Mark Complete"}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-[#070D16]" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-semibold leading-snug ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                        {topic.title}
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          topic.status === 'critical'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : topic.status === 'high-yield'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {topic.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      💡 <strong className="text-slate-300 font-medium">Key Focus:</strong> {topic.formulas}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
