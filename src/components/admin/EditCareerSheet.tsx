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
import {
  Career,
  fetchCareerInterestIds,
  fetchCareerSkillIds,
} from "@/lib/careers.api";
import { Industry } from "@/lib/industries.api";
import { Major } from "@/lib/majors.api";
import { Skill } from "@/lib/skills.api";
import { Interest } from "@/lib/interests.api";

interface EditCareerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Career>) => Promise<void>;
  career: Career | null;
  industries: Industry[];
  majors: Major[];
  skills: Skill[];
  interests: Interest[];
}

export function EditCareerSheet({
  open,
  onOpenChange,
  onSubmit,
  career,
  industries,
  majors,
  skills,
  interests,
}: EditCareerSheetProps) {
  const [skillSearch, setSkillSearch] = useState("");
  const [interestSearch, setInterestSearch] = useState("");
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
    skill_ids: [] as number[],
    interest_ids: [] as number[],
  });

  useEffect(() => {
    if (career && open) {
      setFormData({
        title: career.title || "",
        description: career.description || "",
        industry_id: career.industry_id || 0,
        major_id: career.major_id || 0,
        min_salary: career.min_salary || 30000,
        max_salary: career.max_salary || 100000,
        growth_rate: career.growth_rate ? String(career.growth_rate) : "",
        image_url: career.image_url || "",
        responsibilities: Array.isArray(career.responsibilities) ? career.responsibilities.join("\n") : "",
        required_skills: Array.isArray(career.required_skills) ? career.required_skills.join("\n") : "",
        skill_ids: [],
        interest_ids: [],
      });

      Promise.allSettled([
        fetchCareerSkillIds(career.career_id),
        fetchCareerInterestIds(career.career_id),
      ])
        .then(([skillResult, interestResult]) => {
          const skillIds = skillResult.status === "fulfilled" ? skillResult.value : [];
          const interestIds = interestResult.status === "fulfilled" ? interestResult.value : [];
          setFormData((prev) => ({
            ...prev,
            skill_ids: Array.from(new Set(skillIds.map((id) => Number(id)))),
            interest_ids: Array.from(new Set(interestIds.map((id) => Number(id)))),
          }));
        })
        .catch((err) => {
          console.error("Failed to load career links:", err);
        });
    }
  }, [career, open]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.major_id === 0) return;
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
        career_id: career?.career_id,
        ...formData,
        major_id: formData.major_id,
        growth_rate: formData.growth_rate ? String(formData.growth_rate) : undefined,
        responsibilities: responsibilitiesArray,
        required_skills: requiredSkillsArray,
      } as any);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating career:", error);
    }
  };

  const isSubmitDisabled =
    !formData.title.trim() ||
    !formData.description.trim() ||
    formData.industry_id === 0 ||
    formData.major_id === 0 ||
    !formData.growth_rate;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined} className="w-full sm:w-[540px] overflow-y-auto bg-white">
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
            <Label htmlFor="edit-industry_id">Industry <span className="text-destructive">*</span></Label>
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
            <Label htmlFor="edit-major_id">Major <span className="text-destructive">*</span></Label>
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
              value={formData.growth_rate ? String(formData.growth_rate) : ""}
              onValueChange={(value) => setFormData({ ...formData, growth_rate: value })}
              required
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
                    checked={formData.skill_ids.includes(Number(skill.skill_id))}
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
              className="flex-1 bg-white hover:bg-slate-100 text-black hover:text-black border border-slate-200 shadow-none"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitDisabled} className="flex-1 bg-[#4A5DF9] hover:bg-[#3945CC] text-white">
              Update
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
