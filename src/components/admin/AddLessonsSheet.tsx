import { useEffect, useState } from "react";
import { coursesApi } from "@/lib/courses.api";
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

interface AddLessonsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LessonFormData) => void;
}

interface CourseOption {
  id: number;
  title: string;
}

export interface LessonFormData {
  title: string;
  courseId: number;
  order: number;
  duration: number;
  externalUrl: string;
}

export function AddLessonsSheet({
  open,
  onOpenChange,
  onSubmit,
}: AddLessonsSheetProps) {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [formData, setFormData] = useState<LessonFormData>({
    title: "",
    courseId: 0,
    order: 1,
    duration: 30,
    externalUrl: "",
  });

  // 🔥 ดึง courses จาก backend
  useEffect(() => {
    coursesApi.getAll().then((res) => {
      const mapped = res.data.map((c: any) => ({
        id: c.course_id,
        title: c.title,
      }));
      setCourses(mapped);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: "",
      courseId: 0,
      order: 1,
      duration: 30,
      externalUrl: "",
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">
            Add New Lesson
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
              value={String(formData.courseId || "")}
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
            <Button type="submit" className="flex-1 bg-[#4A5DF9] text-white">
              Create
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
