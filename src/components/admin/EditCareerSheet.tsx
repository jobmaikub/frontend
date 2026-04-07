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
import { Career } from "@/lib/careers.api";

interface EditCareerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Career>) => Promise<void>;
  career: Career | null;
}

export function EditCareerSheet({ open, onOpenChange, onSubmit, career }: EditCareerSheetProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    industry_id: 0,
    major_id: 0,
    min_salary: 30000,
    max_salary: 100000,
    growth_rate: "",
    image_url: "",
    responsibilities: "",
    required_skills: "",
  });

  useEffect(() => {
    if (career) {
      setFormData({
        title: career.title || "",
        description: career.description || "",
        industry_id: career.industry_id || 0,
        major_id: career.major_id || 0,
        min_salary: career.min_salary || 30000,
        max_salary: career.max_salary || 100000,
        growth_rate: career.growth_rate || "",
        image_url: career.image_url || "",
        responsibilities: Array.isArray(career.responsibilities) ? career.responsibilities.join("\n") : "",
        required_skills: Array.isArray(career.required_skills) ? career.required_skills.join("\n") : "",
      });
    }
  }, [career]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const responsibilitiesArray = (formData.responsibilities || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const requiredSkillsArray = (formData.required_skills || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      await onSubmit({
        ...formData,
        responsibilities: responsibilitiesArray,
        required_skills: requiredSkillsArray,
      } as any);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating career:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined} className="w-[400px] sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader>
          <SheetTitle>Edit Career</SheetTitle>
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
            <Label htmlFor="edit-industry_id">Industry ID <span className="text-destructive">*</span></Label>
            <Input
              id="edit-industry_id"
              type="number"
              value={formData.industry_id}
              onChange={(e) => setFormData({ ...formData, industry_id: Number(e.target.value) })}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-major_id">Major ID <span className="text-destructive">*</span></Label>
            <Input
              id="edit-major_id"
              type="number"
              value={formData.major_id}
              onChange={(e) => setFormData({ ...formData, major_id: Number(e.target.value) })}
              required
              className="bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-min_salary">Min Salary (THB) <span className="text-destructive">*</span></Label>
              <Input
                id="edit-min_salary"
                type="number"
                value={formData.min_salary}
                onChange={(e) => setFormData({ ...formData, min_salary: Number(e.target.value) })}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-max_salary">Max Salary (THB) <span className="text-destructive">*</span></Label>
              <Input
                id="edit-max_salary"
                type="number"
                value={formData.max_salary}
                onChange={(e) => setFormData({ ...formData, max_salary: Number(e.target.value) })}
                required
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-growth_rate">Growth Rate <span className="text-destructive">*</span></Label>
            <Select
              value={formData.growth_rate}
              onValueChange={(value) => setFormData({ ...formData, growth_rate: value })}
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
            <Label htmlFor="edit-required_skills">Required Skills <span className="text-destructive">*</span></Label>
            <Textarea
              id="edit-required_skills"
              value={formData.required_skills}
              onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
              className="min-h-[80px] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-image_url">Image URL <span className="text-destructive">*</span></Label>
            <Input
              id="edit-image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
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