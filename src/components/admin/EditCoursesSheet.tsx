import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course, UpdateCoursePayload } from "@/data/coursesData";

/* ===== types ===== */
type CourseLevel = "beginner" | "intermediate" | "advanced";

interface EditCoursesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateCoursePayload) => void;
  course: Course | null;
}

type CourseFormData = {
  title: string;
  description: string;
  career: string;
  level: CourseLevel;
  hours: number;
  externalUrl: string;
  order: number;
  skillsTaught: string;
  learningOutcome: string;
};

export function EditCoursesSheet({
  open,
  onOpenChange,
  onSubmit,
  course,
}: EditCoursesSheetProps) {
  const [formData, setFormData] = useState<Partial<CourseFormData>>({});

  useEffect(() => {
    if (!course) return;

    setFormData({
      title: course.title,
      description: course.description,
      career: course.career,
      level: course.level,
      hours: course.hours,
      externalUrl: course.externalUrl,
      order: course.order,
      skillsTaught: course.skillsTaught.join("\n"),
      learningOutcome: course.learningOutcome ?? "",
    });
  }, [course]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !formData.skillsTaught) return;

    const parsedSkills = formData.skillsTaught
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: UpdateCoursePayload = {
      title: formData.title ?? "",
      description: formData.description ?? "",
      career_path: formData.career ?? "UX Designer",
      level: formData.level ?? "beginner",
      duration: Number(formData.hours ?? 0),
      external_url: formData.externalUrl ?? "",
      course_order: Number(formData.order ?? 1),
      skills_taught: parsedSkills,
      learning_outcome: formData.learningOutcome ?? "",
    };

    onSubmit(payload);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle>Edit Course</SheetTitle>
          <SheetDescription className="sr-only">
            Edit course information
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* title */}
          <div>
            <Label>Title</Label>
            <Input
              value={formData.title ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          {/* career */}
          <div>
            <Label>Career Path</Label>
            <Select
              value={formData.career ?? ""}
              onValueChange={(v) =>
                setFormData({ ...formData, career: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select career" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UXDesigner">UX Designer</SelectItem>
                <SelectItem value="DataScientist">Data Scientist</SelectItem>
                <SelectItem value="SoftwareEngineer">Software Engineer</SelectItem>
                <SelectItem value="ProductManager">Product Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* level */}
          <div>
            <Label>Level</Label>
            <Select
              value={formData.level ?? "beginner"}
              onValueChange={(v: CourseLevel) =>
                setFormData({ ...formData, level: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* duration */}
          <div>
            <Label>Duration (hours)</Label>
            <Input
              type="number"
              value={formData.hours ?? 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hours: Number(e.target.value),
                })
              }
            />
          </div>

          {/* url */}
          <div>
            <Label>External URL</Label>
            <Input
              value={formData.externalUrl ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  externalUrl: e.target.value,
                })
              }
            />
          </div>

          {/* order */}
          <div>
            <Label>Order</Label>
            <Input
              type="number"
              value={formData.order ?? 1}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: Number(e.target.value),
                })
              }
            />
          </div>

          {/* skills */}
          <div>
            <Label>Skills Taught</Label>
            <Textarea
              value={formData.skillsTaught ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  skillsTaught: e.target.value,
                })
              }
            />
          </div>

          {/* learning outcome */}
          <div>
            <Label>Learning Outcome</Label>
            <Textarea
              value={formData.learningOutcome ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  learningOutcome: e.target.value,
                })
              }
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
