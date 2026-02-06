import { useState } from "react";
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

interface AddSkillsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SkillFormData) => void;
  faculties: Faculty[];
  majors: Major[];
}

export interface SkillFormData {
  name: string;
  faculty_id: number;
  major_id: number;
}

export function AddSkillsSheet({
  open,
  onOpenChange,
  onSubmit,
  faculties,
  majors
}: AddSkillsSheetProps) {
  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    faculty_id: 0,
    major_id: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
  name: "",
  faculty_id: 0,
  major_id: 0
});
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">Add New Skill</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              placeholder="e.g., Python Programming"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Faculty <span className="text-destructive">*</span></Label>
            <Select
              value={String(formData.faculty_id)}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  faculty_id: Number(v),
                  major_id: 0
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

          <div className="space-y-2">
            <Label>Major <span className="text-destructive">*</span></Label>
            <Select
              value={String(formData.major_id)}
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
                  .filter((m) => m.faculty_id === formData.faculty_id)
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