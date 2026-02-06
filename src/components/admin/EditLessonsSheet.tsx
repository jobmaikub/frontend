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
import { Lesson } from "@/data/lessonsData";
import { coursesApi } from "@/lib/courses.api";

interface EditLessonsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Lesson) => void;
  lesson: Lesson | null;
}

interface CourseOption {
  id: number;
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
    courseId: 0,
    order: 1,
    duration: 30,
    externalUrl: "",
  });

  // 🔥 load courses from backend
  useEffect(() => {
    coursesApi.getAll().then((res) => {
      const mapped = res.data.map((c: any) => ({
        id: c.course_id,
        title: c.title,
      }));
      setCourses(mapped);
    });
  }, []);

  // populate form when editing
  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        courseId: lesson.courseId,
        order: lesson.order,
        duration: lesson.duration,
        externalUrl: lesson.externalUrl || "",
      });
    }
  }, [lesson]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesson) return;

    onSubmit({
      ...lesson,
      title: formData.title,
      courseId: formData.courseId,
      order: formData.order,
      duration: formData.duration,
      externalUrl: formData.externalUrl,
    });

    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">
            Edit Lesson
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Course *</Label>
            <Select
              value={String(formData.courseId)}
              onValueChange={(v) =>
                setFormData({ ...formData, courseId: Number(v) })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem
                    key={course.id}
                    value={String(course.id)}
                  >
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Order *</Label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: Number(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Duration (minutes) *</Label>
            <Input
              type="number"
              value={formData.duration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: Number(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>External URL *</Label>
            <Input
              value={formData.externalUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  externalUrl: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#4A5DF9] text-white"
            >
              Update
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
