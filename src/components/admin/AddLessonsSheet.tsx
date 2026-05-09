import { useEffect, useState } from "react";
import { getCourses } from "@/lib/courses.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lesson } from "@/lib/lessons.api";

interface AddLessonsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Lesson>) => Promise<void>;
}

interface CourseOption {
  course_id: number;
  title: string;
}

export interface LessonFormData {
  title: string;
  course_id: number;
  lesson_order: number;
  duration_mins: number;
  external_url: string;
}

export function AddLessonsSheet({
  open,
  onOpenChange,
  onSubmit,
}: AddLessonsSheetProps) {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [formData, setFormData] = useState<LessonFormData>({
    title: "",
    course_id: 0,
    lesson_order: 1,
    duration_mins: 30,
    external_url: "",
  });

  useEffect(() => {
    getCourses().then((res) => {
      const mapped = res.map((c: any) => ({
        course_id: c.course_id,
        title: c.title,
      }));
      setCourses(mapped);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.course_id <= 0) return;

    try {
      await onSubmit({
        title: formData.title,
        course_id: formData.course_id,
        lesson_order: formData.lesson_order,
        duration_mins: formData.duration_mins,
        external_url: formData.external_url,
      });
      setFormData({
        title: "",
        course_id: 0,
        lesson_order: 1,
        duration_mins: 30,
        external_url: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">
            Add New Lesson
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="add-title">Title <span className="text-destructive">*</span></Label>
            <Input
              id="add-title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-course_id">Course <span className="text-destructive">*</span></Label>
            <Select
              value={formData.course_id === 0 ? "" : formData.course_id.toString()}
              onValueChange={(v) =>
                setFormData({ ...formData, course_id: Number(v) })
              }
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent className="bg-white w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)]">
                {courses.map((course) => (
                  <SelectItem
                    key={course.course_id}
                    value={String(course.course_id)}
                    className="truncate"
                  >
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.course_id <= 0 && (
              <p className="text-xs text-muted-foreground">Please select a course.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-lesson_order">Lesson Order <span className="text-destructive">*</span></Label>
            <Input
              id="add-lesson_order"
              type="number"
              value={formData.lesson_order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lesson_order: Number(e.target.value),
                })
              }
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-duration">Duration (minutes) <span className="text-destructive">*</span></Label>
            <Input
              id="add-duration"
              type="number"
              value={formData.duration_mins}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration_mins: Number(e.target.value),
                })
              }
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-external_url">External URL <span className="text-destructive">*</span></Label>
            <Input
              id="add-external_url"
              value={formData.external_url}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  external_url: e.target.value,
                })
              }
              required
              className="bg-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-white hover:bg-slate-100 text-black hover:text-black border-slate-200 shadow-none"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#4A5DF9] hover:bg-[#3945CC] text-white">
              Create
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
