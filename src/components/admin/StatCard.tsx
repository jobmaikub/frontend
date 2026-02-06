import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  variant: "blue" | "pink" | "purple" | "green" | "coral" | "cyan" | "teal" | "mint";
}

const variantStyles = {
  blue: "bg-stat-blue/10 text-stat-blue",
  pink: "bg-stat-pink/10 text-stat-pink",
  purple: "bg-stat-purple/10 text-stat-purple",
  green: "bg-stat-green/10 text-stat-green",
  coral: "bg-stat-coral/10 text-stat-coral",
  cyan: "bg-stat-cyan/10 text-stat-cyan",
  teal: "bg-stat-teal/10 text-stat-teal",
  mint: "bg-stat-mint/10 text-stat-mint",
};

const StatCard = ({ icon: Icon, value, label, variant }: StatCardProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-200">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", variantStyles[variant])}>
        <Icon className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

export default StatCard;
