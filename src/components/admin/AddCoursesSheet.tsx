import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Career } from "@/lib/careers.api";

interface AddCoursesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CourseFormData) => Promise<void>;
  careers: Career[];
}

export interface CourseFormData {
  title: string;
  description: string;
  career_id: number;
  career_path: string;
  image_url: string;
  level: "beginner" | "intermediate" | "advanced";
  course_order: number;
  skills_taught: string;
  learning_outcome: string;
}

export function AddCoursesSheet({
  open,
  onOpenChange,
  onSubmit,
  careers,
}: AddCoursesSheetProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    career_id: 0,
    career_path: "",
    image_url: "",
    level: "beginner",
    course_order: 1,
    skills_taught: "",
    learning_outcome: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onSubmit({
        title: formData.title,
        description: formData.description,
        career_id: formData.career_id,
        career_path: formData.career_path,
        image_url: formData.image_url,
        level: formData.level,
        course_order: formData.course_order,
        skills_taught: formData.skills_taught,
        learning_outcome: formData.learning_outcome,
      });
      setFormData({
        title: "",
        description: "",
        career_id: 0,
        career_path: "",
        image_url: "",
        level: "beginner",
        course_order: 1,
        skills_taught: "",
        learning_outcome: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">Add New Course</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              placeholder="e.g. Introduction to UX"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              placeholder="Write a description of this course..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="bg-white min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="career_id">Career Path <span className="text-destructive">*</span></Label>
            <Select
              value={formData.career_id ? formData.career_id.toString() : ""}
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
            <Label htmlFor="image_url">Image URL <span className="text-destructive">*</span></Label>
            <Input
              id="image_url"
              placeholder="https://..."
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Level <span className="text-destructive">*</span></Label>
            <Select value={formData.level} onValueChange={(v: any) => setFormData({ ...formData, level: v })}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course_order">Course Order <span className="text-destructive">*</span></Label>
            <Input
              id="course_order"
              type="number"
              value={formData.course_order}
              onChange={(e) => setFormData({ ...formData, course_order: Number(e.target.value) })}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills_taught">Skills Taught (one per line) <span className="text-destructive">*</span></Label>
            <Textarea
              id="skills_taught"
              placeholder="Write skills taught in this course. One skill per line..."
              value={formData.skills_taught}
              onChange={(e) => setFormData({ ...formData, skills_taught: e.target.value })}
              required
              className="bg-white min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="learning_outcome">Learning Outcome (one per line) <span className="text-destructive">*</span></Label>
            <Textarea
              id="learning_outcome"
              placeholder="What will students achieve after this course?..."
              value={formData.learning_outcome}
              onChange={(e) => setFormData({ ...formData, learning_outcome: e.target.value })}
              required
              className="bg-white min-h-[100px]"
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
