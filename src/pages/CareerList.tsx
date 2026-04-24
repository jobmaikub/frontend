import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CareerCard from '@/components/CareerCard';
import { OldThemeWrapper } from '@/components/OldThemeWrapper';
import { useCareers } from '@/hooks/useCareers';
import { industries } from '@/data/mockData';

const growthRates = ['All Growth Rates', 'High', 'Medium', 'Stable'];

const CareerList = () => {
  const { careers, loading, error } = useCareers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedGrowth, setSelectedGrowth] = useState('All Growth Rates');

  const filteredCareers = useMemo(() => {
    return careers.filter((career) => {
      const matchesSearch = career.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesIndustry =
        selectedIndustry === 'All Industries' ||
        career.track === selectedIndustry;
      const matchesGrowth =
        selectedGrowth === 'All Growth Rates' ||
        (selectedGrowth === 'High' && career.growthRate === 'high') ||
        (selectedGrowth === 'Medium' && career.growthRate === 'medium') ||
        (selectedGrowth === 'Stable' && career.growthRate === 'stable');
      return matchesSearch && matchesIndustry && matchesGrowth;
    });
  }, [careers, searchQuery, selectedIndustry, selectedGrowth]);

  return (
    <OldThemeWrapper>
      <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-primary">
            Career Library
          </span>
          <h1 className="mt-4 text-4xl font-bold text-foreground">
            Explore Career Paths
          </h1>
          <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
            Discover detailed information about various careers, salary ranges,
            and growth opportunities.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-10 flex gap-3 items-center bg-card rounded-xl border border-border p-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search careers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
          </div>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedGrowth} onValueChange={setSelectedGrowth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {growthRates.map((rate) => (
                <SelectItem key={rate} value={rate}>
                  {rate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        {loading && (
          <div className="mt-8 text-center text-muted-foreground">
            Loading careers...
          </div>
        )}

        {error && (
          <div className="mt-8 text-center text-red-500">
            Error loading careers: {error.message}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-8 grid grid-cols-3 gap-6">
            {filteredCareers.map((career) => (
              <CareerCard key={career.id} career={career} />
          ))}
          </div>
        )}

        {!loading && !error && filteredCareers.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">
            No careers found matching your criteria.
          </div>
        )}
      </div>
    </div>
    </OldThemeWrapper>
  );
};

export default CareerList;
