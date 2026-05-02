import { Progress } from "@/components/ui/progress";

interface OverallProgressProps {
  progress: number;           // % จาก backend
  completedCourses: number;   // coursesComplete
  totalCourses?: number;      // optional (ถ้ามี)
}

const OverallProgress = ({
  progress,
  completedCourses,
  totalCourses,
}: OverallProgressProps) => {
  return (
    <div className="rounded-xl border bg-card p-6 min-w-[280px]">
      <h3 className="text-lg font-bold text-card-foreground mb-4">
        Overall Progress
      </h3>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-card-foreground">
          Your Progress
        </span>
        <span className="text-sm font-bold text-primary">
          {progress}%
        </span>
      </div>

      <Progress value={progress} className="h-2 mb-3" />

      <p className="text-sm text-muted-foreground">
        {totalCourses
          ? `${completedCourses} of ${totalCourses} Courses Complete`
          : `${completedCourses} Courses Complete`}
      </p>
    </div>
  );
};

export default OverallProgress;