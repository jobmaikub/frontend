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
  const growth = growthConfig[career.growthRate];

  return (
    <div
      onClick={() => navigate(`/careers/${career.id}`)}
      className="group cursor-pointer rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={career.image}
          alt={career.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${growth.className}`}
        >
          <growth.icon className="h-3 w-3" />
          {growth.label}
        </span>
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
