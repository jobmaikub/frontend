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
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditCareerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  career: any | null;
}

export function EditCareerSheet({ open, onOpenChange, onSubmit, career }: EditCareerSheetProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    industry: "",
    minSalary: 30000,
    maxSalary: 100000,
    growth: "" as "High" | "Medium" | "Stable" | "",
    image: "",
    responsibilities: "",
    skills: "",
    interests: "",
    learningOutcome: "", // New Field included
  });

  useEffect(() => {
    if (career) {
      setFormData({
        title: career.title || "",
        description: career.description || "",
        industry: career.industry || "", // ✅ ตรง enum DB
        minSalary: career.minSalary || 30000,
        maxSalary: career.maxSalary || 100000,
        growth: career.growth || "",
        image: career.image || "",
        responsibilities: career.responsibilities || "",
        skills: career.skills || "",
        interests: career.interests || "",
        learningOutcome: career.learningOutcome || "",
      });
    }
  }, [career]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (career) {
      onSubmit({
        ...career,
        ...formData
      });
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined} className="w-[400px] sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader>
          <SheetTitle>Add Career</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title <span className="text-destructive">*</span></Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description <span className="text-destructive">*</span></Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[80px] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-industry">Industry <span className="text-destructive">*</span></Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => setFormData({ ...formData, industry: value })}
              required
            >
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Design & Creative">Design & Creative</SelectItem>
                <SelectItem value="Business & Management">Business & Management</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-minSalary">Min Salary (THB) <span className="text-destructive">*</span></Label>
              <Input
                id="edit-minSalary"
                type="number"
                value={formData.minSalary}
                onChange={(e) => setFormData({ ...formData, minSalary: Number(e.target.value) })}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-maxSalary">Max Salary (THB) <span className="text-destructive">*</span></Label>
              <Input
                id="edit-maxSalary"
                type="number"
                value={formData.maxSalary}
                onChange={(e) => setFormData({ ...formData, maxSalary: Number(e.target.value) })}
                required
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-growth">Growth Rate <span className="text-destructive">*</span></Label>
            <Select
              value={formData.growth}
              onValueChange={(value) => setFormData({ ...formData, growth: value as any })}
              required
            >
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Stable">Stable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-interests">Related Interests <span className="text-destructive">*</span></Label>
            <Textarea
              id="edit-interests"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              className="min-h-[80px] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-responsibilities">Key Responsibilities <span className="text-destructive">*</span></Label>
            <Textarea
              id="edit-responsibilities"
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
              className="min-h-[80px] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-skills">Required Skills <span className="text-destructive">*</span></Label>
            <Textarea
              id="edit-skills"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="min-h-[80px] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-learningOutcome">Learning Outcome <span className="text-destructive">*</span></Label>
            <Textarea
              id="edit-learningOutcome"
              value={formData.learningOutcome}
              onChange={(e) => setFormData({ ...formData, learningOutcome: e.target.value })}
              className="min-h-[80px] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-image">Image URL <span className="text-destructive">*</span></Label>
            <Input
              id="edit-image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              className="bg-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-white hover:bg-white text-black hover:text-black border border-slate-200 shadow-none"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white">
              Update
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}