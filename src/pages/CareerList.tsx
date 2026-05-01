import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { Navbar } from '@/components/navbar and footer/Navbar';
import { Footer } from '@/components/navbar and footer/Footer';

const growthRates = ['All Growth Rates', 'High', 'Medium', 'Stable'];

const CareerList = () => {
  const { careers, loading, error } = useCareers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedGrowth, setSelectedGrowth] = useState('All Growth Rates');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

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
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedIndustry, selectedGrowth]);

  const paginatedCareers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCareers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCareers, currentPage]);

  const totalPages = Math.ceil(filteredCareers.length / ITEMS_PER_PAGE);

  return (
    <OldThemeWrapper>
      <div className="min-h-screen bg-background pt-20">
        <Navbar />
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
              className="pl-9 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            />
          </div>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0">
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
            <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0">
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

        {!loading && !error && filteredCareers.length > 0 && (
          <>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {paginatedCareers.map((career) => (
                <CareerCard key={career.id} career={career} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex gap-1">
                  {(() => {
                    const pages = [];
                    const maxVisible = 5;
                    const halfWindow = Math.floor(maxVisible / 2);
                    
                    let startPage = Math.max(1, currentPage - halfWindow);
                    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                    
                    if (endPage - startPage + 1 < maxVisible) {
                      startPage = Math.max(1, endPage - maxVisible + 1);
                    }

                    if (startPage > 1) {
                      pages.push(1);
                      if (startPage > 2) pages.push('...');
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(i);
                    }

                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) pages.push('...');
                      pages.push(totalPages);
                    }

                    return pages.map((page, idx) => 
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page as number)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            currentPage === page
                              ? 'bg-primary text-white shadow-md'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    );
                  })()}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}

        {!loading && !error && filteredCareers.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">
            No careers found matching your criteria.
          </div>
        )}
      </div>
      <Footer />
    </div>
    </OldThemeWrapper>
  );
};

export default CareerList;
