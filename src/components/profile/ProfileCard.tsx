import { useState } from "react";
import { Mail, Calendar, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProfileModal from "./EditProfileModal";

interface ProfileCardProps {
  name: string;
  email: string;
  joinedDate: string;
  avatarUrl: string;
  onAvatarChange: (url: string) => void;
  onNameChange: (name: string) => void;
}

const ProfileCard = ({ name, email, joinedDate, avatarUrl, onAvatarChange, onNameChange }: ProfileCardProps) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6 shadow-sm">
        <Avatar className="h-24 w-24 border-4 border-accent">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-accent text-2xl font-bold text-accent-foreground">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <h2 className="mt-4 text-xl font-bold text-foreground">{name}</h2>

        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{email}</span>
        </div>

        <Button
          onClick={() => setEditOpen(true)}
          className="mt-4 w-full gap-2"
        >
          <Pencil className="h-4 w-4" />
          แก้ไขโปรไฟล์
        </Button>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>เข้าร่วมเมื่อ {joinedDate}</span>
        </div>
      </div>

      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        currentAvatar={avatarUrl}
        onAvatarChange={onAvatarChange}
        name={name}
        onNameChange={onNameChange}
      />
    </>
  );
};

export default ProfileCard;
