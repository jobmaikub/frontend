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

interface AddCareerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CareerFormData) => void;
}

export interface CareerFormData {
  title: string;
  description: string;
  industry_id: number;
  major_id?: number;
  min_salary: number;
  max_salary: number;
  growth_rate: string;
  image_url: string;
  responsibilities: string;
  required_skills: string;
}

export function AddCareerSheet({ open, onOpenChange, onSubmit }: AddCareerSheetProps) {
  const [formData, setFormData] = useState<CareerFormData>({
    title: "",
    description: "",
    industry_id: 0,
    major_id: undefined,
    min_salary: 30000,
    max_salary: 100000,
    growth_rate: "",
    image_url: "",
    responsibilities: "",
    required_skills: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined} className="w-[400px] sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader>
          <SheetTitle>Add Career</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              placeholder="e.g. UX Designer"
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
              placeholder="Brief overview of the career role..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[80px] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry_id">Industry ID <span className="text-destructive">*</span></Label>
            <Input
              id="industry_id"
              type="number"
              value={formData.industry_id}
              onChange={(e) => setFormData({ ...formData, industry_id: Number(e.target.value) })}
              required
              className="bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_salary">Min Salary (THB) <span className="text-destructive">*</span></Label>
              <Input
                id="min_salary"
                type="number"
                value={formData.min_salary}
                onChange={(e) => setFormData({ ...formData, min_salary: Number(e.target.value) })}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_salary">Max Salary (THB) <span className="text-destructive">*</span></Label>
              <Input
                id="max_salary"
                type="number"
                value={formData.max_salary}
                onChange={(e) => setFormData({ ...formData, max_salary: Number(e.target.value) })}
                required
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="growth_rate">Growth Rate <span className="text-destructive">*</span></Label>
            <Select
              value={formData.growth_rate}
              onValueChange={(value) =>
                setFormData({ ...formData, growth_rate: value })
              }
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select market growth" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Stable">Stable</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <div className="space-y-2">
            <Label htmlFor="responsibilities">Key Responsibilities <span className="text-destructive">*</span></Label>
            <Textarea
              id="responsibilities"
              placeholder="Primary tasks and duties (one per line)..."
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
              className="min-h-[80px] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="required_skills">Required Skills <span className="text-destructive">*</span></Label>
            <Textarea
              id="required_skills"
              placeholder="Essential tools and expertise (one per line)..."
              value={formData.required_skills}
              onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
              className="min-h-[80px] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL <span className="text-destructive">*</span></Label>
            <Input
              id="image_url"
              placeholder="https://example.com/image.jpg"
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
              className="flex-1 bg-white hover:bg-white text-black hover:text-black border shadow-none"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white border-none shadow-sm">
              Create
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}