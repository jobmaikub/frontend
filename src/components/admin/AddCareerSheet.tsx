import { useEffect, useState } from "react";
import { fetchIndustries } from "@/lib/industries.api";

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

/* ---------- FORM TYPE (สำหรับ UI เท่านั้น) ---------- */

interface CareerFormData {
  title: string;
  description: string;
  industryId: number;
  minSalary: number;
  maxSalary: number;
  growth: string;
  image: string;
  responsibilities: string;
  skills: string;
  interests: string;
}

interface CreateCareerData {
  title: string;
  description: string;
  industry_id: number;
  minSalary?: number;
  maxSalary?: number;
  growth?: number;
  image?: string;
  required_skills?: string[];
  responsibilities?: string[];
  interest: string;
}

interface Industry {
  industry_id: number;
  name: string;
}

/* ---------- PROPS ---------- */

interface AddCareerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateCareerData) => void;
}

export function AddCareerSheet({
  open,
  onOpenChange,
  onSubmit,
}: AddCareerSheetProps) {
  const [formData, setFormData] = useState<CareerFormData>({
    title: "",
    description: "",
    industryId: 0,
    minSalary: 30000,
    maxSalary: 100000,
    growth: "",
    image: "",
    responsibilities: "",
    skills: "",
    interests: "",
  });

  const [industries, setIndustries] = useState<Industry[]>([]);

  /* ---------- LOAD INDUSTRIES ---------- */

  useEffect(() => {
    fetchIndustries().then(setIndustries);
  }, []);

  /* ---------- SUBMIT ---------- */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedIndustry = industries.find(
      (i) => i.industry_id === formData.industryId
    );

    const payload: CreateCareerData = {
      title: formData.title,
      description: formData.description,
      industry_id: formData.industryId,

      minSalary: formData.minSalary,
      maxSalary: formData.maxSalary,

      growth:
        formData.growth === "High"
          ? 3
          : formData.growth === "Medium"
            ? 2
            : 1,

      image: formData.image,

      interest: formData.interests,

      responsibilities: formData.responsibilities
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),

      required_skills: formData.skills
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (!selectedIndustry) return;

    onSubmit(payload);
  };

  /* ---------- RENDER ---------- */

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        aria-describedby={undefined}
        className="w-[400px] sm:w-[540px] overflow-y-auto bg-white"
      >
        <SheetHeader>
          <SheetTitle>Add Career</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TITLE */}
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

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          {/* INDUSTRY */}
          <div className="space-y-2">
            <Label>Industry *</Label>

            <Select
              value={formData.industryId?.toString()}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  industryId: Number(value),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>

              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem
                    key={ind.industry_id}
                    value={ind.industry_id.toString()}
                  >
                    {ind.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SALARY */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Salary *</Label>
              <Input
                type="number"
                value={formData.minSalary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minSalary: Number(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Max Salary *</Label>
              <Input
                type="number"
                value={formData.maxSalary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxSalary: Number(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>

          {/* GROWTH */}
          <div className="space-y-2">
            <Label>Growth Rate *</Label>

            <Select
              value={formData.growth}
              onValueChange={(value) =>
                setFormData({ ...formData, growth: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select growth" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Stable">Stable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* INTEREST */}
          <div className="space-y-2">
            <Label>Related Interests *</Label>
            <Textarea
              value={formData.interests}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  interests: e.target.value,
                })
              }
              required
            />
          </div>

          {/* RESPONSIBILITIES */}
          <div className="space-y-2">
            <Label>Responsibilities *</Label>
            <Textarea
              value={formData.responsibilities}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  responsibilities: e.target.value,
                })
              }
              required
            />
          </div>

          {/* SKILLS */}
          <div className="space-y-2">
            <Label>Required Skills *</Label>
            <Textarea
              value={formData.skills}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  skills: e.target.value,
                })
              }
              required
            />
          </div>

          {/* IMAGE */}
          <div className="space-y-2">
            <Label>Image URL *</Label>
            <Input
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              required
            />
          </div>

          {/* BUTTON */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
