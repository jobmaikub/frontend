import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Interest } from "@/data/interestsData";

interface EditInterestsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Interest) => void;
  interest: Interest | null;
}

export function EditInterestsSheet({ open, onOpenChange, onSubmit, interest }: EditInterestsSheetProps) {
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    if (interest) {
      setFormData({ name: interest.name });
    }
  }, [interest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (interest) {
      onSubmit({ ...interest, name: formData.name });
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">Edit Interest</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-name">
              Interest Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              required
              className="bg-white"
            />
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
            <Button type="submit" className="flex-1 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white border-none shadow-sm">
              Update
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}