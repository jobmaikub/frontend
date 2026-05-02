import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  colorClass: string;
}

const StatsCard = ({ icon: Icon, value, label, colorClass }: StatsCardProps) => {
  return (
    <div className="flex flex-col items-center rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-2xl font-bold text-foreground">{value}</span>
      <span className="mt-1 text-sm text-muted-foreground">{label}</span>
    </div>
  );
};

export default StatsCard;
