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

interface AddFacultySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FacultyFormData) => void;
}

export interface FacultyFormData {
  eng_name: string;
  th_name?: string;
}

export function AddFacultySheet({ open, onOpenChange, onSubmit }: AddFacultySheetProps) {
  const [formData, setFormData] = useState<FacultyFormData>({
    eng_name: "",
    th_name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ eng_name: "", th_name: "" });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">Add New Faculty</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="eng_name">Faculty Name (English) <span className="text-destructive">*</span></Label>
            <Input
              id="eng_name"
              placeholder="e.g., Engineering"
              value={formData.eng_name}
              onChange={(e) => setFormData({ ...formData, eng_name: e.target.value })}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="th_name">Faculty Name (Thai)</Label>
            <Input
              id="th_name"
              placeholder="e.g., วิศวกรรม"
              value={formData.th_name || ""}
              onChange={(e) => setFormData({ ...formData, th_name: e.target.value })}
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
