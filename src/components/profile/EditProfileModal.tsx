import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Milo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Luna",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Max",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Coco",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bear",
];

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar: string;
  onAvatarChange: (url: string) => void;
  name: string;
  onNameChange: (name: string) => void;
}

const EditProfileModal = ({ open, onOpenChange, currentAvatar, onAvatarChange, name, onNameChange }: EditProfileModalProps) => {
  const [selected, setSelected] = useState(currentAvatar);
  const [editName, setEditName] = useState(name);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelected(url);
    }
  };

  const handleSave = () => {
    onAvatarChange(selected);
    if (editName.trim()) {
      onNameChange(editName.trim());
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (o) { setEditName(name); setSelected(currentAvatar); } onOpenChange(o); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>แก้ไขโปรไฟล์</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-accent">
            <AvatarImage src={selected} alt={editName} />
            <AvatarFallback className="bg-accent text-xl font-bold text-accent-foreground">
              {editName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Name input */}
          <div className="w-full space-y-2">
            <Label htmlFor="edit-name">ชื่อ - นามสกุล</Label>
            <Input
              id="edit-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="กรอกชื่อ-นามสกุล"
            />
          </div>

          <p className="text-sm font-medium text-foreground">เลือกอวตาร</p>
          <div className="grid grid-cols-4 gap-3">
            {PRESET_AVATARS.map((url) => (
              <button
                key={url}
                onClick={() => setSelected(url)}
                className={`rounded-full p-0.5 transition-all ${selected === url ? "ring-2 ring-primary ring-offset-2" : "hover:ring-2 hover:ring-muted"}`}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={url} />
                </Avatar>
              </button>
            ))}
          </div>

          <div className="flex w-full items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">หรือ</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            อัปโหลดรูปจากเครื่อง
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>ยกเลิก</Button>
          <Button onClick={handleSave}>บันทึก</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
