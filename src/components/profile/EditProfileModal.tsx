import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

  // Sync state when modal opens
  useEffect(() => {
    if (open) {
      setSelected(currentAvatar);
      setEditName(name);
    }
  }, [open, currentAvatar, name]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 2MB for base64 storage)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size is too large (max 2MB)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
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
    <>
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => onOpenChange(false)}
        />
      )}

      <Dialog modal={false} open={open} onOpenChange={onOpenChange}>
        <DialogContent className="z-50 sm:max-w-md profile-theme" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription className="sr-only">
              Update your profile information and select a new avatar.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-accent shadow-sm">
              <AvatarImage src={selected} alt={editName} referrerPolicy="no-referrer" />
              <AvatarFallback className="bg-muted text-xl font-bold text-muted-foreground">
                {editName ? editName.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>

            {/* Name input */}
            <div className="w-full space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <p className="text-sm font-medium text-foreground">Select Avatar</p>
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
              <span className="text-xs text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Upload from device
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProfileModal;

