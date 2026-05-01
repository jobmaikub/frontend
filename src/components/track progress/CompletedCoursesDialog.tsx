import { CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Course {
  id: number;
  title: string;
  description?: string;
  progress?: number;
}

interface CompletedCoursesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
}

const CompletedCoursesDialog = ({
  open,
  onOpenChange,
  courses,
}: CompletedCoursesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Completed Courses
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {courses.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No completed courses yet
            </p>
          )}

          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-lg border border-border bg-secondary/50 p-4 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-card-foreground text-sm">
                  {course.title || "Untitled Course"}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(course.progress ?? 100)}% completed
                </p>

                {course.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {course.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompletedCoursesDialog;