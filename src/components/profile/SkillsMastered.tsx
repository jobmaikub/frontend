import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { EnrichedSkill } from "@/lib/track_progress.api";

interface SkillsMasteredProps {
  skills: EnrichedSkill[];
  isLoading?: boolean;
}

const LEVEL_CONFIG = {
  advanced: {
    label: "Advanced",
    color: "text-primary",
    bg: "bg-brand-light",
    border: "border-primary/20",
    bar: "bg-primary",
    baseWidth: 90,
  },
  intermediate: {
    label: "Intermediate",
    color: "text-info",
    bg: "bg-info-light",
    border: "border-info/20",
    bar: "bg-info",
    baseWidth: 60,
  },
  beginner: {
    label: "Beginner",
    color: "text-success",
    bg: "bg-success-light",
    border: "border-success/20",
    bar: "bg-success",
    baseWidth: 30,
  },
} as const;

const SkillCard = ({ skill }: { skill: EnrichedSkill }) => {
  const config = LEVEL_CONFIG[skill.level as keyof typeof LEVEL_CONFIG] ?? LEVEL_CONFIG.beginner;
  
  const bonusPerCourse = skill.level === "advanced" ? 5 : 10;
  const strengthPct = Math.min(100, config.baseWidth + ((skill.courseCount - 1) * bonusPerCourse));

  const timeAgo = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const updatedText = timeAgo(skill.lastUpdated);

  return (
    <div
      className={`group relative flex flex-col gap-2.5 rounded-xl border p-4 transition-all duration-200 ${config.bg} ${config.border}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-[15px] font-bold text-foreground leading-tight truncate">{skill.name}</h4>
          <div className="mt-1 flex flex-wrap gap-x-2 text-[11px] text-muted-foreground font-medium">
            {skill.careers.length > 0 && <span>{skill.careers[0]}</span>}
            {updatedText && <span>• {updatedText}</span>}
          </div>
        </div>
        <span
          className={`flex-shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/80 dark:bg-black/20 ${config.color}`}
        >
          {config.label}
        </span>
      </div>

      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/50 dark:bg-black/10">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${config.bar}`}
          style={{ width: `${strengthPct}%` }}
        />
      </div>
    </div>
  );
};

const SkillsMastered = ({ skills, isLoading }: SkillsMasteredProps) => {
  const [showAll, setShowAll] = useState(false);

  const topSkills = skills.slice(0, 3);
  const restSkills = skills.slice(3);
  const hasMore = restSkills.length > 0;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="border-b border-border p-5 sm:p-6 bg-white">
        <h3 className="text-xl font-bold text-foreground">Skills Mastered</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {skills.length} skills earned from your learning journey
        </p>
      </div>

      <div className="p-5 sm:p-6 bg-slate-50/20">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">No skills mastered yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topSkills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>

            {hasMore && (
              <div className="space-y-4">
                {showAll && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {restSkills.map((skill) => (
                      <SkillCard key={skill.name} skill={skill} />
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setShowAll((p) => !p)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white py-3.5 text-xs font-bold text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      SHOW LESS
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      VIEW {restSkills.length} MORE SKILLS
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsMastered;
