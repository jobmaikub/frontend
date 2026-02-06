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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddUsersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserFormData) => void;
}

export interface UserFormData {
  name: string;
  email: string;
  role: "Admin" | "User";
}

export function AddUsersSheet({ open, onOpenChange, onSubmit }: AddUsersSheetProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "User",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form and close
    setFormData({ name: "", email: "", role: "User" });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">Add New User</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullname">
              Fullname <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullname"
              placeholder="e.g., Tinnapat Takananant"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g., user@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Role <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={formData.role} 
              onValueChange={(v: "Admin" | "User") => setFormData({ ...formData, role: v })}
              required
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="User">User</SelectItem>
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
            <Button type="submit" className="flex-1 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white border-none shadow-sm">
              Create
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}