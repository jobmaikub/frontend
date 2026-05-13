import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  highlighted?: boolean;
  onClick?: () => void;
  clickable?: boolean;
  colorScheme?: "purple" | "orange" | "green" | "blue" | "default";
}

const StatCard = ({
  icon: Icon,
  value,
  label,
  highlighted,
  onClick,
  clickable,
  colorScheme = "default"
}: StatCardProps) => {
  const getColors = () => {
    if (highlighted) {
      switch (colorScheme) {
        case "orange": return "bg-[#FF9500] text-white border-[#FF9500]";
        case "purple": return "bg-[#4A5DF9] text-white border-[#4A5DF9]";
        case "green": return "bg-[#34C759] text-white border-[#34C759]";
        default: return "bg-primary text-white border-primary";
      }
    }

    return "bg-white border-border";
  };

  const getIconColors = () => {
    if (highlighted) return "bg-white/20 text-white";

    switch (colorScheme) {
      case "purple": return "bg-brand-light text-primary";
      case "orange": return "bg-warning-light text-warning";
      case "green": return "bg-success-light text-success";
      case "blue": return "bg-info-light text-info";
      default: return "bg-secondary text-primary";
    }
  };


  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-6 flex flex-col gap-3 transition-all ${clickable ? "cursor-pointer hover:shadow-md hover:scale-[1.02]" : ""
        } ${getColors()}`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColors()}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-3xl font-bold">{value}</div>
      <div className={`text-sm ${highlighted ? "text-white/80" : "text-muted-foreground"}`}>
        {label}
      </div>
    </div>
  );
};


export default StatCard;
