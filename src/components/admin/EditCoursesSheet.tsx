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
import { Course } from "@/lib/courses.api";
import { Career } from "@/lib/careers.api";

type CourseLevel = "beginner" | "intermediate" | "advanced";

interface EditCoursesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Course>) => Promise<void>;
  course: Course | null;
  careers: Career[];
}

type CourseFormData = {
  title: string;
  description: string;
  career_id: number;
  career_path: string;
  image_url: string;
  level: CourseLevel;
  course_order: number;
  skills_taught: string;
  learning_outcome: string;
};

export function EditCoursesSheet({
  open,
  onOpenChange,
  onSubmit,
  course,
  careers,
}: EditCoursesSheetProps) {
  const [formData, setFormData] = useState<Partial<CourseFormData>>({});

  useEffect(() => {
    if (!course) return;

    setFormData({
      title: course.title,
      description: course.description,
      career_id: course.career_id,
      career_path: course.career_path || course.career_name || "",
      image_url: course.image_url || (course as any).image || "",
      level: course.level,
      course_order: course.course_order,
      skills_taught: (course.skills_taught || []).join("\n"),
      learning_outcome: (course.learning_outcome || []).join("\n"),
    });
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    const parsedSkills = (formData.skills_taught || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedOutcome = (formData.learning_outcome || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<Course> = {
      title: formData.title ?? "",
      description: formData.description ?? "",
      career_id: formData.career_id ?? 0,
      career_path: formData.career_path ?? "",
      image_url: formData.image_url ?? "",
      level: formData.level ?? "beginner",
      course_order: Number(formData.course_order ?? 1),
      skills_taught: parsedSkills,
      learning_outcome: parsedOutcome,
    };

    try {
      await onSubmit(payload);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle>Edit Course</SheetTitle>
          <SheetDescription className="sr-only">
            Edit course information
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title <span className="text-destructive">*</span></Label>
            <Input
              id="edit-title"
              value={formData.title ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description <span className="text-destructive">*</span></Label>
            <Textarea
              id="edit-description"
              value={formData.description ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-career_id">Career Path <span className="text-destructive">*</span></Label>
            <Select
              value={formData.career_id ? String(formData.career_id) : ""}
              onValueChange={(v) => {
                const selectedCareer = careers.find((career) => career.career_id === Number(v));
                setFormData({
                  ...formData,
                  career_id: Number(v),
                  career_path: selectedCareer?.title || "",
                });
              }}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Career" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {careers.map((career) => (
                  <SelectItem key={career.career_id} value={career.career_id.toString()}>
                    {career.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-image_url">Image URL <span className="text-destructive">*</span></Label>
            <Input
              id="edit-image_url"
              value={formData.image_url ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image_url: e.target.value,
                })
              }
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-level">Level <span className="text-destructive">*</span></Label>
            <Select
              value={formData.level ?? "beginner"}
              onValueChange={(v: CourseLevel) =>
                setFormData({ ...formData, level: v })
              }
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-course_order">Course Order <span className="text-destructive">*</span></Label>
            <Input
              id="edit-course_order"
              type="number"
              value={formData.course_order ?? 1}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  course_order: Number(e.target.value),
                })
              }
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-skills_taught">Skills Taught (one per line)</Label>
            <Textarea
              id="edit-skills_taught"
              value={formData.skills_taught ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  skills_taught: e.target.value,
                })
              }
              className="bg-white min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-learning_outcome">Learning Outcome (one per line)</Label>
            <Textarea
              id="edit-learning_outcome"
              value={formData.learning_outcome ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  learning_outcome: e.target.value,
                })
              }
              className="bg-white min-h-[80px]"
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
              Update
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

