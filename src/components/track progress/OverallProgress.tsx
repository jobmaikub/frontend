import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";

interface OverallProgressProps {
  progress: number;           // % จาก backend
  completedCourses: number;   // coursesComplete
  totalCourses?: number;      // optional (ถ้ามี)
  onClick?: () => void;
  clickable?: boolean;
}

const OverallProgress = ({
  progress,
  completedCourses,
  totalCourses,
  onClick,
  clickable,
}: OverallProgressProps) => {
  return (
    <div 
      onClick={onClick}
      className={`rounded-xl border bg-card p-6 min-w-[280px] w-full lg:w-1/3 flex flex-col justify-between transition-all group ${
        clickable ? "cursor-pointer hover:shadow-md hover:scale-[1.01]" : ""
      }`}
    >
      <div>
        <h3 className="text-lg font-bold text-card-foreground">Overall Progress</h3>
        <p className="text-sm text-muted-foreground mb-8">
          {totalCourses
            ? `${completedCourses} of ${totalCourses} Courses Complete`
            : `${completedCourses} Courses Complete`}
        </p>

        <div className="flex items-end justify-between mb-2">
          <span className="text-sm font-medium text-card-foreground">
            Current Status
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-primary">
              {progress}
            </span>
            <span className="text-lg font-bold text-primary">%</span>
          </div>
        </div>

        <Progress value={progress} className="h-2.5 w-full bg-slate-100" />
      </div>

      {clickable && (
        <div className="mt-4 flex justify-end text-sm">
          <div className="flex items-center gap-1.5 text-primary font-semibold">
            View All 
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      )}
    </div>
  );
};

export default OverallProgress;