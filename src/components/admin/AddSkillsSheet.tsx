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
import { createSkill, Skill } from "@/lib/skills.api";

interface AddSkillsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Skill>) => Promise<void>;
}

export interface SkillFormData {
  name: string;
  category?: string;
  icon?: string;
}

export function AddSkillsSheet({
  open,
  onOpenChange,
  onSubmit,
}: AddSkillsSheetProps) {
  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    category: "",
    icon: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        name: formData.name,
        category: formData.category,
        icon: formData.icon,
      });
      setFormData({
        name: "",
        category: "",
        icon: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating skill:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">Add New Skill</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="skill-name">Skill Name <span className="text-destructive">*</span></Label>
            <Input
              id="skill-name"
              placeholder="e.g., Python Programming"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category (JSON)</Label>
            <Textarea
              id="category"
              placeholder='{"key": "value"}'
              value={formData.category || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
              className="bg-white min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon (optional)</Label>
            <Input
              id="icon"
              placeholder="Icon URL or name"
              value={formData.icon || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  icon: e.target.value,
                })
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
            <Button type="submit" className="flex-1 bg-[#4A5DF9] hover:bg-[#3945CC] text-white">
              Create
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
