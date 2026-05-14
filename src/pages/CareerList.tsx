import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, ChevronDown, TrendingUp } from 'lucide-react';
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
import { fetchIndustriesFromDatabase } from '@/lib/news.service';
import { Navbar } from '@/components/navbar and footer/Navbar';
import { Footer } from '@/components/navbar and footer/Footer';

const growthRates = [
  { label: 'All Growth Rates', value: 'all' },
  { label: 'High Growth', value: '3' },
  { label: 'Medium Growth', value: '2' },
  { label: 'Stable Growth', value: '1' }
];

import CareerListSkeleton from "@/components/careers/CareerListSkeleton";

const CareerList = () => {
  const { careers, loading, error } = useCareers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedGrowth, setSelectedGrowth] = useState('all');
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isGrowthOpen, setIsGrowthOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [industriesList, setIndustriesList] = useState<string[]>(['All Industries']);
  const ITEMS_PER_PAGE = 9;

  // Fetch industries on mount
  useEffect(() => {
    document.title = "ค้นหาอาชีพ | Jobmaikub";
    fetchIndustriesFromDatabase().then(setIndustriesList);
  }, []);

  const filteredCareers = useMemo(() => {
    return careers
      .filter((career) => {
        const matchesSearch = career.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesIndustry =
          selectedIndustry === 'All Industries' ||
          career.track === selectedIndustry;
        const matchesGrowth =
          selectedGrowth === 'all' ||
          String(career.growth_rate) === selectedGrowth ||
          String(career.growthRate) === selectedGrowth;
        return matchesSearch && matchesIndustry && matchesGrowth;
      })
      .sort((a, b) => (b.growth_rate || 0) - (a.growth_rate || 0));
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

  if (loading) {
    return <CareerListSkeleton />;
  }

  return (
    <OldThemeWrapper>
      <div className="min-h-screen bg-[#F4F7FF] font-['Inter']">

        <Navbar />

        {/* Header Section */}
        <div className="w-full bg-white pt-24 pb-10 flex flex-col items-center text-center px-8 shadow-sm z-10 relative">


          <div className="mb-4 flex items-center justify-center rounded-full bg-[#D5E3FF]/50 px-4 py-1.5">
            <span className="text-[14px] font-medium text-[#4A5DF9]">Career Library</span>
          </div>
          <h1 className="mb-3 text-[32px] font-bold leading-tight text-[#000000]">
            Explore Career Paths
          </h1>
          <p className="text-[16px] text-gray-500">
            Discover detailed information about various careers, salary ranges, and growth opportunities.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-8 pt-12 pb-24">

          {/* Search and Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-10">

            {/* 1. Search Input */}
            <div className="flex-grow flex items-center bg-white rounded-xl border border-gray-200 px-5 py-3.5 shadow-sm transition-all focus-within:border-[#4A5DF9] focus-within:ring-1 focus-within:ring-[#4A5DF9]">
              <Search className="text-gray-400 mr-3" size={20} />
              <input
                type="text"
                placeholder="Search careers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              {/* 2. Industry Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setIsIndustryOpen(!isIndustryOpen); setIsGrowthOpen(false); }}
                  className="flex items-center justify-between w-full sm:w-[220px] gap-3 bg-white border border-gray-200 rounded-xl px-5 py-3.5 shadow-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Filter size={18} className={selectedIndustry !== "All Industries" ? "text-[#4A5DF9]" : "text-gray-400"} />
                    <span className={`text-[15px] font-medium truncate ${selectedIndustry !== "All Industries" ? "text-[#4A5DF9]" : ""}`}>
                      {selectedIndustry}
                    </span>
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isIndustryOpen ? "rotate-180" : ""}`} />
                </button>
                {isIndustryOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-2">
                    {industriesList.map((industry) => (
                      <button
                        key={industry}
                        onClick={() => { setSelectedIndustry(industry); setIsIndustryOpen(false); }}
                        className={`w-full text-left px-5 py-2.5 text-[14px] hover:bg-gray-50 transition-colors ${selectedIndustry === industry ? "text-[#4A5DF9] font-medium bg-[#D5E3FF]/10" : "text-gray-600"}`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Growth Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setIsGrowthOpen(!isGrowthOpen); setIsIndustryOpen(false); }}
                  className="flex items-center justify-between w-full sm:w-[220px] gap-3 bg-white border border-gray-200 rounded-xl px-5 py-3.5 shadow-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <TrendingUp size={18} className={selectedGrowth !== "all" ? "text-[#4A5DF9]" : "text-gray-400"} />
                    <span className={`text-[15px] font-medium truncate ${selectedGrowth !== "all" ? "text-[#4A5DF9]" : ""}`}>
                      {growthRates.find(r => r.value === selectedGrowth)?.label || "All Growth Rates"}
                    </span>
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isGrowthOpen ? "rotate-180" : ""}`} />
                </button>
                {isGrowthOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-2">
                    {growthRates.map((rate) => (
                      <button
                        key={rate.value}
                        onClick={() => { setSelectedGrowth(rate.value); setIsGrowthOpen(false); }}
                        className={`w-full text-left px-5 py-2.5 text-[14px] hover:bg-gray-50 transition-colors ${selectedGrowth === rate.value ? "text-[#4A5DF9] font-medium bg-[#D5E3FF]/10" : "text-gray-600"}`}
                      >
                        {rate.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-8 text-center text-red-500">
              Error loading careers: {error.message}
            </div>
          )}

          {!loading && !error && filteredCareers.length > 0 && (
            <>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedCareers.map((career) => (
                  <CareerCard key={career.id} career={career} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 sm:gap-2 mt-12 px-2 flex-wrap">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="h-10 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium text-sm sm:text-base"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex gap-1">
                    {(() => {
                      const pages = [];
                      const maxVisible = 3;
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

                      return pages.map((page, idx) => {
                        if (page === '...') {
                          return <span key={`ellipsis-${idx}`} className="px-1 sm:px-2 text-gray-400 self-center">...</span>;
                        }

                        const isCurrent = currentPage === page;

                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page as number)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all text-base
                              ${isCurrent ? 'bg-[#4A5DF9] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'}
                            `}
                          >
                            {page}
                          </button>
                        );
                      });
                    })()}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="h-10 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {!loading && !error && filteredCareers.length === 0 && (
            <div className="mt-12 text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200 flex flex-col items-center gap-3">
              <Search className="w-7 h-7 text-gray-400" />
              <p>No careers found matching your criteria.</p>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </OldThemeWrapper>
  );
};

export default CareerList;
