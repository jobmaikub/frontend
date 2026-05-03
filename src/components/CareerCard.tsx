import { useNavigate } from 'react-router-dom';
import { TrendingUp, Minus } from 'lucide-react';
import type { Career } from '@/types/careers.types';

interface CareerCardProps {
  career: Career;
}

const growthConfig = {
  high: {
    label: 'High Growth',
    className: 'bg-growth-high-bg text-growth-high-foreground',
    icon: TrendingUp,
  },
  medium: {
    label: 'Medium Growth',
    className: 'bg-growth-medium-bg text-growth-medium-foreground',
    icon: TrendingUp,
  },
  stable: {
    label: 'Stable Growth',
    className: 'bg-growth-stable-bg text-growth-stable-foreground',
    icon: Minus,
  },
};

const CareerCard = ({ career }: CareerCardProps) => {
  const navigate = useNavigate();
  // Mapping numeric database values to the growth configuration
  const getGrowthConfig = () => {
    const rate = Number(career.growth_rate || 0);
    if (rate === 3 || career.growthRate === 'high') return growthConfig.high;
    if (rate === 2 || career.growthRate === 'medium') return growthConfig.medium;
    if (rate === 1 || career.growthRate === 'stable') return growthConfig.stable;
    return growthConfig.high; // Default fallback
  };

  const growth = getGrowthConfig();

  return (
    <div
      onClick={() => navigate(`/careers/${career.id}`)}
      className="group cursor-pointer rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={career.image}
          alt={career.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div
          className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide uppercase shadow-sm ${growth.className}`}
        >
          <growth.icon className="h-3.5 w-3.5" strokeWidth={3} />
          {growth.label}
        </div>
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-primary">{career.track}</span>
        <h3 className="mt-1 font-semibold text-card-foreground line-clamp-1">
          {career.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {career.description}
        </p>
        <p className="mt-2 font-semibold text-card-foreground">
          ฿{career.salaryMin} - ฿{career.salaryMax}
        </p>
      </div>
    </div>
  );
};

export default CareerCard;
