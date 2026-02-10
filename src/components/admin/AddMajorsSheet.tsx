import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Faculty } from "@/lib/faculties.api";
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

interface AddMajorsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MajorFormData) => Promise<void> | void;
  faculties: Faculty[];
}

export interface MajorFormData {
  name: string;
  faculty_id: number;
}

export function AddMajorsSheet({
  open,
  onOpenChange,
  onSubmit,
  faculties,
}: AddMajorsSheetProps) {
  const [formData, setFormData] = useState<MajorFormData>({
    name: "",
    faculty_id: 0,
  });

  const isValid =
    formData.name.trim().length > 0 && formData.faculty_id > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    await onSubmit({
      name: formData.name.trim(),
      faculty_id: formData.faculty_id,
    });

    setFormData({ name: "", faculty_id: 0 });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">
            Add New Major
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Major name */}
          <div className="space-y-2">
            <Label>
              Major Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g., Computer Science"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-white"
              required
            />
          </div>

          {/* Faculty */}
          <div className="space-y-2">
            <Label>
              Faculty <span className="text-destructive">*</span>
            </Label>
            <Select
              value={
                formData.faculty_id
                  ? formData.faculty_id.toString()
                  : ""
              }
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  faculty_id: Number(v),
                })
              }
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Faculty" />
              </SelectTrigger>

              <SelectContent className="bg-white">
                {faculties.map((faculty) => (
                  <SelectItem
                    key={faculty.faculty_id}
                    value={faculty.faculty_id.toString()}
                  >
                    {faculty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
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
              className="flex-1 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white"
              disabled={!isValid}
            >
              Create
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
