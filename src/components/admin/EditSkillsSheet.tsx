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
import { Skill } from "@/lib/skills.api";

interface EditSkillsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill: Skill | null;
  onSubmit: (data: Partial<Skill>) => Promise<void>;
}

interface SkillFormData {
  name: string;
  category: string;
  icon?: string;
}

export function EditSkillsSheet({
  open,
  onOpenChange,
  onSubmit,
  skill,
}: EditSkillsSheetProps) {
  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    category: "",
    icon: "",
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || "",
        category: typeof skill.category === "string" ? skill.category : JSON.stringify(skill.category || {}),
        icon: skill.icon || "",
      });
    }
  }, [skill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skill) return;

    try {
      await onSubmit({
        name: formData.name,
        category: formData.category,
        icon: formData.icon,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating skill:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">
            Edit Skill
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-skill-name">Skill Name <span className="text-destructive">*</span></Label>
            <Input
              id="edit-skill-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category (JSON)</Label>
            <Textarea
              id="edit-category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="bg-white min-h-[80px]"
              placeholder='{"key": "value"}'
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-icon">Icon (optional)</Label>
            <Input
              id="edit-icon"
              value={formData.icon || ""}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              className="bg-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-white hover:bg-slate-100 text-black hover:text-black border-slate-200 shadow-none"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="flex-1 bg-[#4A5DF9] hover:bg-[#3945CC] text-white"
            >
              Update
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
