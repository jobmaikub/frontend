import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Interest } from "@/lib/interests.api";

interface AddInterestsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Interest>) => Promise<void>;
}

export interface InterestFormData {
  interest_name: string;
}

export function AddInterestsSheet({ open, onOpenChange, onSubmit }: AddInterestsSheetProps) {
  const [formData, setFormData] = useState<InterestFormData>({
    interest_name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({ interest_name: formData.interest_name });
      setFormData({ interest_name: "" });
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating interest:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">Add New Interest</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">
              Interest Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Technology"
              value={formData.interest_name}
              onChange={(e) => setFormData({ ...formData, interest_name: e.target.value })}
              required
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
