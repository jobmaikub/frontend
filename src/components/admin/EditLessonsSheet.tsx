import { useState, useEffect } from "react";
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
import { getCourses } from "@/lib/courses.api";

interface EditLessonsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Lesson>) => Promise<void>;
  lesson: Lesson | null;
}

interface CourseOption {
  course_id: number;
  title: string;
}

export function EditLessonsSheet({
  open,
  onOpenChange,
  onSubmit,
  lesson,
}: EditLessonsSheetProps) {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        course_id: lesson.course_id,
        lesson_order: lesson.lesson_order,
        duration_mins: lesson.duration_mins,
        external_url: lesson.external_url || "",
      });
    }
  }, [lesson]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesson) return;
    if (formData.course_id <= 0) return;

    try {
      await onSubmit({
        lesson_id: lesson.lesson_id,
        title: formData.title,
        course_id: formData.course_id,
        lesson_order: formData.lesson_order,
        duration_mins: formData.duration_mins,
        external_url: formData.external_url,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">
            Edit Lesson
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title <span className="text-destructive">*</span></Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-course_id">Course <span className="text-destructive">*</span></Label>
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
            <Label htmlFor="edit-lesson_order">Lesson Order <span className="text-destructive">*</span></Label>
            <Input
              id="edit-lesson_order"
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
            <Label htmlFor="edit-duration">Duration (minutes) <span className="text-destructive">*</span></Label>
            <Input
              id="edit-duration"
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
            <Label htmlFor="edit-external_url">External URL <span className="text-destructive">*</span></Label>
            <Input
              id="edit-external_url"
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
            <Button
              type="submit"
              className="flex-1 bg-[#4A5DF9] hover:bg-[#3945CC] text-white"
            >
              Update
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
