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
  industry: string;
  minSalary: number;
  maxSalary: number;
  growth: string;
  image: string;
  responsibilities: string;
  skills: string;
  interests: string; // New Field
}

export function AddCareerSheet({ open, onOpenChange, onSubmit }: AddCareerSheetProps) {
  const [formData, setFormData] = useState<CareerFormData>({
    title: "",
    description: "",
    industry: "",
    minSalary: 30000,
    maxSalary: 100000,
    growth: "",
    image: "",
    responsibilities: "",
    skills: "",
    interests: "",
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
            <Label htmlFor="industry">Industry <span className="text-destructive">*</span></Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => setFormData({ ...formData, industry: value })}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select industry category" />
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
              <Label htmlFor="minSalary">Min Salary (THB) <span className="text-destructive">*</span></Label>
              <Input
                id="minSalary"
                type="number"
                value={formData.minSalary}
                onChange={(e) => setFormData({ ...formData, minSalary: Number(e.target.value) })}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSalary">Max Salary (THB) <span className="text-destructive">*</span></Label>
              <Input
                id="maxSalary"
                type="number"
                value={formData.maxSalary}
                onChange={(e) => setFormData({ ...formData, maxSalary: Number(e.target.value) })}
                required
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="growth">Growth Rate <span className="text-destructive">*</span></Label>
            <Select
              value={formData.growth}
              onValueChange={(value) =>
                setFormData({ ...formData, growth: value })
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
            <Label htmlFor="interests">Related Interests <span className="text-destructive">*</span></Label>
            <Textarea
              id="interests"
              placeholder="e.g. Technology, Art, Psychology..."
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              className="min-h-[80px] bg-white"
              required
            />
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
            <Label htmlFor="skills">Required Skills <span className="text-destructive">*</span></Label>
            <Textarea
              id="skills"
              placeholder="Essential tools and expertise (one per line)..."
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="min-h-[80px] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL <span className="text-destructive">*</span></Label>
            <Input
              id="image"
              placeholder="https://example.com/image.jpg"
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