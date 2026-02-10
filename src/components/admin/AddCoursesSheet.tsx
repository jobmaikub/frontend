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

interface AddCoursesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CourseFormData) => void;
}

export interface CourseFormData {
  title: string;
  description: string;
  career: string;
  level: "beginner" | "intermediate" | "advanced";
  hours: number;
  externalUrl: string;
  order: number;
  skillsTaught: string;
  learningOutcome: string; // New Field
}

export function AddCoursesSheet({ open, onOpenChange, onSubmit }: AddCoursesSheetProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    career: "",
    level: "beginner",
    hours: 1,
    externalUrl: "",
    order: 1,
    skillsTaught: "",
    learningOutcome: "", // New Field Initial State
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
    setFormData({
      title: "",
      description: "",
      career: "",
      level: "beginner",
      hours: 1,
      externalUrl: "",
      order: 1,
      skillsTaught: "",
      learningOutcome: "",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-white">
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
            <Label>Career Path <span className="text-destructive">*</span></Label>
            <Select onValueChange={(v) => setFormData({ ...formData, career: v })} required>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Career Path" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="UX Designer">UX Designer</SelectItem>
                <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Level <span className="text-destructive">*</span></Label>
            <Select onValueChange={(v: any) => setFormData({ ...formData, level: v })} required>
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
            <Label htmlFor="duration">Duration (hours) <span className="text-destructive">*</span></Label>
            <Input
              id="duration"
              type="number"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">External URL <span className="text-destructive">*</span></Label>
            <Input
              id="url"
              placeholder="https://..."
              value={formData.externalUrl}
              onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Order <span className="text-destructive">*</span></Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills Taught <span className="text-destructive">*</span></Label>
            <Textarea
              id="skills"
              placeholder="Write skills taught in this course. One skill per line..."
              value={formData.skillsTaught}
              onChange={(e) => setFormData({ ...formData, skillsTaught: e.target.value })}
              required
              className="bg-white min-h-[100px]"
            />
          </div>

          {/* New Learning Outcome Field */}
          <div className="space-y-2">
            <Label htmlFor="learningOutcome">Learning Outcome <span className="text-destructive">*</span></Label>
            <Textarea
              id="learningOutcome"
              placeholder="What will students achieve after this course?..."
              value={formData.learningOutcome}
              onChange={(e) => setFormData({ ...formData, learningOutcome: e.target.value })}
              required
              className="bg-white min-h-[100px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-white hover:bg-white text-black hover:text-black border-slate-200 shadow-none"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white">
              Create
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}