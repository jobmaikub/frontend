import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Faculty } from "@/lib/faculties.api";
import { Major } from "@/lib/majors.api";

interface EditMajorsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Major) => void;
  major: Major | null;
  faculties: Faculty[];
}

export function EditMajorsSheet({
  open,
  onOpenChange,
  onSubmit,
  major,
  faculties,
}: EditMajorsSheetProps) {
  const [eng_name, setEngName] = useState("");
  const [th_name, setThName] = useState("");
  const [facultyId, setFacultyId] = useState<number | "">("");

  useEffect(() => {
    if (major) {
      setEngName(major.eng_name);
      setThName(major.th_name || "");
      setFacultyId(major.faculty_id);
    }
  }, [major]);

  useEffect(() => {
    if (!open) {
      setEngName("");
      setThName("");
      setFacultyId("");
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!major || facultyId === "") return;

    onSubmit({
      ...major,
      eng_name: eng_name.trim(),
      th_name: th_name.trim(),
      faculty_id: facultyId,
    });

    onOpenChange(false);
  };

  const isDisabled = !eng_name.trim() || facultyId === "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">
            Edit Major
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>
              Major Name (English) <span className="text-destructive">*</span>
            </Label>
            <Input
              value={eng_name}
              onChange={(e) => setEngName(e.target.value)}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Major Name (Thai)
            </Label>
            <Input
              value={th_name}
              onChange={(e) => setThName(e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Faculty <span className="text-destructive">*</span>
            </Label>

            <Select
              value={facultyId === "" ? "" : facultyId.toString()}
              onValueChange={(v) => setFacultyId(Number(v))}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>

              <SelectContent className="bg-white">
                {faculties.map((faculty) => (
                  <SelectItem
                    key={faculty.faculty_id}
                    value={faculty.faculty_id.toString()}
                  >
                    {faculty.eng_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-white hover:bg-slate-100 text-black hover:text-black"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isDisabled}
              className="flex-1 bg-[#4A5DF9] hover:bg-[#3945CC] text-white disabled:opacity-50"
            >
              Update
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

