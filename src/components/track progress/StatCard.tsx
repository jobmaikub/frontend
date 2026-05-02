import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  highlighted?: boolean;
  onClick?: () => void;
  clickable?: boolean;
}

const StatCard = ({ icon: Icon, value, label, highlighted, onClick, clickable }: StatCardProps) => (
  <div
    onClick={onClick}
    className={`rounded-xl border p-6 flex flex-col gap-3 transition-all ${
      clickable ? "cursor-pointer hover:shadow-md hover:scale-[1.02]" : ""
    } ${
      highlighted
        ? "bg-accent text-accent-foreground border-accent"
        : "bg-card text-card-foreground border-border"
    }`}
  >
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        highlighted ? "bg-accent-foreground/20" : "bg-secondary"
      }`}
    >
      <Icon className={`w-5 h-5 ${highlighted ? "text-accent-foreground" : "text-primary"}`} />
    </div>
    <div className="text-3xl font-bold">{value}</div>
    <div className={`text-sm ${highlighted ? "text-accent-foreground/80" : "text-muted-foreground"}`}>
      {label}
    </div>
  </div>
);

export default StatCard;
