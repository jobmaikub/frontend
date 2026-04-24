import { Badge } from "@/components/ui/badge";

interface SkillsMasteredProps {
  skills: string[];
}

const SkillsMastered = ({ skills }: SkillsMasteredProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-foreground">Skills Mastered</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge
            key={skill}
            variant="outline"
            className="rounded-full border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground hover:bg-accent"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SkillsMastered;
