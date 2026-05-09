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
import { Industry } from "@/lib/industries.api";
import { Major } from "@/lib/majors.api";
import { Skill } from "@/lib/skills.api";
import { Interest } from "@/lib/interests.api";

interface AddCareerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CareerFormData) => void;
  industries: Industry[];
  majors: Major[];
  skills: Skill[];
  interests: Interest[];
}

export interface CareerFormData {
  title: string;
  description: string;
  industry_id: number;
  major_id: number;
  min_salary: number;
  max_salary: number;
  growth_rate: "" | "1" | "2" | "3";
  image_url: string;
  responsibilities: string;
  required_skills: string;
  skill_ids: number[];
  interest_ids: number[];
}

export function AddCareerSheet({
  open,
  onOpenChange,
  onSubmit,
  industries,
  majors,
  skills,
  interests,
}: AddCareerSheetProps) {
  const [skillSearch, setSkillSearch] = useState("");
  const [interestSearch, setInterestSearch] = useState("");
  const [formData, setFormData] = useState<CareerFormData>({
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
    skill_ids: [],
    interest_ids: [],
  });

  const toggleSkill = (skillId: number) => {
    const normalizedSkillId = Number(skillId);
    setFormData((prev) => ({
      ...prev,
      skill_ids: prev.skill_ids.includes(normalizedSkillId)
        ? prev.skill_ids.filter((id) => id !== normalizedSkillId)
        : [...prev.skill_ids, normalizedSkillId],
    }));
  };

  const toggleInterest = (interestId: number) => {
    const normalizedInterestId = Number(interestId);
    setFormData((prev) => ({
      ...prev,
      interest_ids: prev.interest_ids.includes(normalizedInterestId)
        ? prev.interest_ids.filter((id) => id !== normalizedInterestId)
        : [...prev.interest_ids, normalizedInterestId],
    }));
  };

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const filteredInterests = interests.filter((interest) =>
    interest.interest_name.toLowerCase().includes(interestSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.major_id === 0) return;
    onSubmit(formData);
  };

  const isSubmitDisabled =
    !formData.title.trim() ||
    !formData.description.trim() ||
    formData.industry_id === 0 ||
    formData.major_id === 0 ||
    !formData.growth_rate;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto bg-white">
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
            <Label htmlFor="industry_id">Industry <span className="text-destructive">*</span></Label>
            <Select
              value={formData.industry_id ? formData.industry_id.toString() : ""}
              onValueChange={(value) =>
                setFormData({ ...formData, industry_id: Number(value) })
              }
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {industries.map((industry) => (
                  <SelectItem key={industry.industry_id} value={industry.industry_id.toString()}>
                    {industry.name || industry.industry_name || `Industry ${industry.industry_id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="major_id">Major <span className="text-destructive">*</span></Label>
            <Select
              value={formData.major_id ? formData.major_id.toString() : ""}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  major_id: Number(value),
                })
              }
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Major" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {majors.map((major) => (
                  <SelectItem key={major.major_id} value={major.major_id.toString()}>
                    {major.eng_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                setFormData({ ...formData, growth_rate: value as "1" | "2" | "3" })
              }
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select market growth" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="3">High</SelectItem>
                <SelectItem value="2">Medium</SelectItem>
                <SelectItem value="1">Stable</SelectItem>
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
            <Label>Link Skills</Label>
            <Input
              placeholder="Search skills..."
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className="bg-white"
            />
            <div className="max-h-36 overflow-y-auto rounded-md border border-slate-200 p-3 space-y-2 bg-white">
              {filteredSkills.map((skill) => (
                <label key={skill.skill_id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.skill_ids.includes(skill.skill_id)}
                    onChange={() => toggleSkill(skill.skill_id)}
                  />
                  <span>{skill.name}</span>
                </label>
              ))}
              {filteredSkills.length === 0 && (
                <p className="text-xs text-muted-foreground">No skills found</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Link Interests</Label>
            <Input
              placeholder="Search interests..."
              value={interestSearch}
              onChange={(e) => setInterestSearch(e.target.value)}
              className="bg-white"
            />
            <div className="max-h-36 overflow-y-auto rounded-md border border-slate-200 p-3 space-y-2 bg-white">
              {filteredInterests.map((interest) => (
                <label key={interest.interest_id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interest_ids.includes(interest.interest_id)}
                    onChange={() => toggleInterest(interest.interest_id)}
                  />
                  <span>{interest.interest_name}</span>
                </label>
              ))}
              {filteredInterests.length === 0 && (
                <p className="text-xs text-muted-foreground">No interests found</p>
              )}
            </div>
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
              className="flex-1 bg-white hover:bg-gray-100 text-black hover:text-black border-slate-200 shadow-none"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#4A5DF9] hover:bg-[#3945CC] text-white shadow-sm">
              Create
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
