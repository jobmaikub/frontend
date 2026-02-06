import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Faculty } from "@/lib/faculties.api";
import { Major } from "@/lib/majors.api";
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

import { Skill } from "@/lib/skills.api";
import { SkillFormData } from "./AddSkillsSheet";

interface EditSkillsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill: Skill | null;
  faculties: Faculty[];
  majors: Major[];
  onSubmit: (
    data: SkillFormData & { skill_id: number }
  ) => Promise<void>;
}

export function EditSkillsSheet({
  open,
  onOpenChange,
  onSubmit,
  skill,
  faculties,
  majors,
}: EditSkillsSheetProps) {
  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    faculty_id: 0,
    major_id: 0,
  });

  /* map skill -> form */
  useEffect(() => {
  if (
    skill &&
    faculties.length > 0 &&
    majors.length > 0
  ) {
    setFormData({
      name: skill.name,
      faculty_id: skill.category?.faculty_id ?? 0,
      major_id: skill.category?.major_id ?? 0,
    });
  }
}, [skill, faculties, majors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skill) return;

    await onSubmit({
      skill_id: skill.skill_id,
      ...formData,
    });

    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">
            Edit Skill
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Skill name */}
          <div className="space-y-2">
            <Label>Skill Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Faculty */}
          <div className="space-y-2">
            <Label>Faculty *</Label>

            <Select
              value={formData.faculty_id ? String(formData.faculty_id) : ""}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  faculty_id: Number(v),
                  major_id: 0,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Faculty" />
              </SelectTrigger>

              <SelectContent>
                {faculties.map((f) => (
                  <SelectItem
                    key={f.faculty_id}
                    value={String(f.faculty_id)}
                  >
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Major */}
          <div className="space-y-2">
            <Label>Major *</Label>

            <Select
              value={formData.major_id ? String(formData.major_id) : ""}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  major_id: Number(v),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Major" />
              </SelectTrigger>

              <SelectContent>
                {majors
                  .filter(
                    (m) => m.faculty_id === formData.faculty_id
                  )
                  .map((m) => (
                    <SelectItem
                      key={m.major_id}
                      value={String(m.major_id)}
                    >
                      {m.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="flex-1 bg-[#4A5DF9] text-white"
            >
              Update
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
