import { useState, useMemo } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { EnrichedSkill } from "@/lib/track_progress.api";

interface SkillsMasteredProps {
  skills: EnrichedSkill[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 9;

const LEVEL_STYLE = {
  advanced: { label: "Advanced", color: "bg-brand", text: "text-brand", bg: "bg-brand/5" },
  intermediate: { label: "Intermediate", color: "bg-info", text: "text-info", bg: "bg-info/5" },
  beginner: { label: "Beginner", color: "bg-success", text: "text-success", bg: "bg-success/5" }
} as const;

const SkillCard = ({ skill }: { skill: EnrichedSkill }) => {
  const config = LEVEL_STYLE[skill.level as keyof typeof LEVEL_STYLE] || LEVEL_STYLE.beginner;
  
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-brand/20 font-sans">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
             {config.label}
          </div>
          <div className="flex gap-0.5">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`h-1 w-3 rounded-full ${i <= (skill.level === 'advanced' ? 3 : skill.level === 'intermediate' ? 2 : 1) ? config.color : 'bg-slate-100 dark:bg-slate-800'}`} 
              />
            ))}
          </div>
        </div>

        <div className="space-y-0.5">
          <h4 className="text-[14px] font-bold tracking-tight text-slate-800 dark:text-white truncate">
            {skill.name}
          </h4>
          <p className="text-[11px] font-medium text-slate-400 truncate">
            {skill.careers[0] || 'General'}
          </p>
        </div>
      </div>
    </div>
  );
};

const SkillsMastered = ({ skills, isLoading }: SkillsMasteredProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const sortedSkills = useMemo(() => {
    return [...skills].sort((a, b) => {
      const ranks = { advanced: 3, intermediate: 2, beginner: 1 };
      return (ranks[b.level as keyof typeof ranks] || 0) - (ranks[a.level as keyof typeof ranks] || 0);
    });
  }, [skills]);

  const totalPages = Math.ceil(sortedSkills.length / ITEMS_PER_PAGE);
  const displaySkills = useMemo(() => {
    if (!isExpanded) return sortedSkills.slice(0, 3);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedSkills.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedSkills, isExpanded, currentPage]);

  return (
    <div className="min-w-0 w-full rounded-xl border border-border bg-card shadow-sm overflow-hidden font-sans">
      {/* Header - Total moved to the right */}
      <div className="flex items-center justify-between border-b border-border px-6 py-5 bg-white/50">
        <h3 className="text-lg font-bold text-foreground">Skills Mastered</h3>
        <span className="text-xs font-bold text-brand">
          {skills.length} Total
        </span>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-slate-50 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : sortedSkills.length === 0 ? (
          <div className="py-8 text-center text-sm font-medium text-slate-400">
            No records found
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {displaySkills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center pt-1">
              {!isExpanded && sortedSkills.length > 3 && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="rounded-lg bg-brand px-6 py-2 text-[11px] font-bold text-white transition-all hover:opacity-90 active:scale-95 uppercase tracking-widest shadow-sm"
                >
                  View More
                </button>
              )}

              {isExpanded && (
                <div className="flex w-full items-center justify-between gap-4">
                  <button
                    onClick={() => { setIsExpanded(false); setCurrentPage(1); }}
                    className="text-[10px] font-bold text-slate-400 hover:text-brand uppercase tracking-widest transition-colors"
                  >
                    Show Less
                  </button>

                  {/* Pagination - Clean Numeric */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="p-1.5 text-slate-300 hover:text-brand disabled:opacity-30 transition-colors"
                      >
                        <CaretLeft weight="bold" size={14} />
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`flex h-7 min-w-[28px] items-center justify-center rounded-lg px-2 text-[11px] font-bold transition-all ${
                              currentPage === pageNum 
                                ? 'bg-brand text-white shadow-sm' 
                                : 'text-slate-400 hover:bg-slate-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="p-1.5 text-slate-300 hover:text-brand disabled:opacity-30 transition-colors"
                      >
                        <CaretRight weight="bold" size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsMastered;
