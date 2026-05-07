import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar and footer/Navbar";
import { Search, Filter, TrendingUp, ChevronDown, BookOpen, Clock, ArrowRight, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PathDetail } from "@/components/learning path/PathDetail";
import { learningPathApi } from "@/lib/LearningPath.api";

import { useAuth } from "@/contexts/AuthContexts";
import { useCareers } from "@/hooks/useCareers";
import { getCareerStats } from "@/lib/careers.service";
import { fetchIndustriesFromDatabase } from "@/lib/news.service";



export default function LearningPath() {
  const { user } = useAuth();
  const { careers } = useCareers();

  // Application States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedGrowth, setSelectedGrowth] = useState("All Growth Rates");
  const [industries, setIndustries] = useState<string[]>(["All Industries"]);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedIndustry, selectedGrowth]);

  // Dropdown UI States
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isGrowthOpen, setIsGrowthOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const { careerId } = useParams();
  const navigate = useNavigate();

  // Fetch industries on mount
  useEffect(() => {
    fetchIndustriesFromDatabase().then(setIndustries);
  }, []);

  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const GROWTH_MAPPING: Record<number, string> = {
    1: "Stable Growth",
    2: "Medium Growth",
    3: "High Growth",
  };

  const filteredPaths = learningPaths.filter((path) => {
    const matchesSearch = path.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === "All Industries" || path.industry === selectedIndustry;
    const matchesGrowth = selectedGrowth === "All Growth Rates" || path.growth === selectedGrowth;
    return matchesSearch && matchesIndustry && matchesGrowth;
  });
  const activePath = learningPaths.find(p => p.id === careerId);

  const fetchPaths = (showLoading = true) => {
    if (!user || careers.length === 0) return;

    if (showLoading) setLoading(true);
    learningPathApi.getAll(user.id)
      .then((res) => {
        const mapped = res.data.map((item: any) => {
          const staticCareer = careers.find(c => String(c.id) === String(item.id));
          const stats = staticCareer ? getCareerStats(staticCareer) : { totalCourses: item.courses || 0, totalHours: item.hours || 0 };

          // Use database growth_rate if available, fallback to static mapping or High Growth
          const dbGrowthRate = Number(item.growth_rate);
          const growthLabel = GROWTH_MAPPING[dbGrowthRate] || item.growth || "High Growth";

          return {
            id: String(item.id),
            title: staticCareer ? staticCareer.title : (item.title || `Career ${item.id}`),
            industry: staticCareer ? staticCareer.track : (item.industry || "General"),
            growth: growthLabel,
            growthRate: dbGrowthRate,
            courses: stats.totalCourses,
            hours: stats.totalHours,
            progress: Math.round(item.progress || 0),
            image: staticCareer ? staticCareer.image : (item.image || "https://via.placeholder.com/300"),
            levels: item.levels || []
          };
        });

        setLearningPaths(mapped);
      })
      .catch(console.error)
      .finally(() => {
        if (showLoading) setLoading(false);
      });
  };

  useEffect(() => {
    fetchPaths();
  }, [user, careers]);

  if (loading) {
    return (
      <div className="min-h-screen font-['Inter'] flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-[#D5E3FF]/20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#4A5DF9] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading your journey...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-['Inter'] flex flex-col">
      <Navbar />

      <main className="bg-[#F4F7FF] flex-grow flex flex-col">

        {/* Render Header only if we are on the main grid view */}
        {!careerId && (
          <div className="w-full bg-white pt-24 pb-10 flex flex-col items-center text-center px-8 shadow-sm z-10 relative">

            <div className="mb-4 flex items-center justify-center rounded-full bg-[#D5E3FF]/50 px-4 py-1.5">
              <span className="text-[14px] font-medium text-[#4A5DF9]">Learning Path</span>
            </div>
            <h1 className="mb-3 text-[32px] font-bold leading-tight text-[#000000]">
              Choose Your Learning Path
            </h1>
            <p className="text-[16px] text-gray-500">
              Select a career to see its complete learning roadmap
            </p>
          </div>
        )}


        <section className={`pb-24 ${careerId ? "pt-20" : "pt-12"}`}>
          <div className="container mx-auto px-8 max-w-6xl">

            {/* Conditional Rendering: Main Grid vs Detailed Path */}
            {careerId ? (
              // Instruction 4: Render Detailed View
              <PathDetail
                path={learningPaths.find(p => p.id === careerId)}
                onBack={() => navigate("/learning-path")}
                onRefresh={() => fetchPaths(false)}
              />
            ) : (
              <>
                {/* Search and Filters Bar */}
                <div className="flex flex-col lg:flex-row gap-4 mb-10">

                  {/* 1. Search Input - Added focus-within blue outline */}
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
                        <div className="flex items-center gap-2">
                          <Filter size={18} className={selectedIndustry !== "All Industries" ? "text-[#4A5DF9]" : "text-gray-400"} />
                          <span className={`text-[15px] font-medium truncate ${selectedIndustry !== "All Industries" ? "text-[#4A5DF9]" : ""}`}>
                            {selectedIndustry}
                          </span>
                        </div>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isIndustryOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isIndustryOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-2">
                          {industries.map((industry) => (
                            <button
                              key={industry}
                              onClick={() => {
                                setSelectedIndustry(industry);
                                setIsIndustryOpen(false);
                              }}
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
                        <div className="flex items-center gap-2">
                          <TrendingUp size={18} className={selectedGrowth !== "All Growth Rates" ? "text-[#4A5DF9]" : "text-gray-400"} />
                          <span className={`text-[15px] font-medium truncate ${selectedGrowth !== "All Growth Rates" ? "text-[#4A5DF9]" : ""}`}>
                            {selectedGrowth}
                          </span>
                        </div>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isGrowthOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isGrowthOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-2">
                          {["All Growth Rates", "High Growth", "Medium Growth", "Stable Growth"].map((growth) => (
                            <button
                              key={growth}
                              onClick={() => { setSelectedGrowth(growth); setIsGrowthOpen(false); }}
                              className={`w-full text-left px-5 py-2.5 text-[14px] hover:bg-gray-50 transition-colors ${selectedGrowth === growth ? "text-[#4A5DF9] font-medium bg-[#D5E3FF]/10" : "text-gray-600"}`}
                            >
                              {growth}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                 {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPaths.length > 0 ? (
                    (() => {
                      const totalPages = Math.ceil(filteredPaths.length / ITEMS_PER_PAGE);
                      const paginatedPaths = filteredPaths.slice(
                        (currentPage - 1) * ITEMS_PER_PAGE,
                        currentPage * ITEMS_PER_PAGE
                      );
                      
                      return paginatedPaths.map((path) => (
                        <div 
                          key={path.id} 
                          onClick={() => navigate(`/learning-path/${path.id}`)}
                          className="group cursor-pointer rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col h-full transform-gpu"
                        >

                          <div className="relative aspect-[3/2] overflow-hidden transform-gpu">
                            <img 
                              src={path.image} 
                              alt={path.title} 
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                              loading="lazy"
                            />
                            <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide uppercase shadow-sm ${path.growth === 'High Growth'
                              ? 'bg-growth-high-bg text-growth-high-foreground'
                              : path.growth === 'Medium Growth'
                                ? 'bg-growth-medium-bg text-growth-medium-foreground'
                                : 'bg-growth-stable-bg text-growth-stable-foreground'
                              }`}>
                              {path.growth === 'Stable Growth' ? (
                                <Minus size={14} strokeWidth={4} />
                              ) : (
                                <TrendingUp size={14} strokeWidth={3} />
                              )} {path.growth}
                            </div>
                          </div>

                          <div className="p-5 flex flex-col flex-grow">
                            <span className="text-xs font-medium text-primary mb-1">
                              {path.industry}
                            </span>
                            <h3 className="font-semibold text-card-foreground line-clamp-1 transition-colors">
                              {path.title}
                            </h3>

                            <div className="mt-3 flex items-center gap-4 text-[13px] text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <BookOpen size={16} className="text-gray-400" /> {path.courses} courses
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock size={16} className="text-gray-400" /> {path.hours} hrs
                              </div>
                            </div>

                            <div className="mt-auto pt-5 flex flex-col gap-4">
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                  <span>Progress</span>
                                  <span>{path.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className="bg-[#4A5DF9] h-full rounded-full transition-all duration-500"
                                    style={{ width: `${path.progress}%` }}
                                  />
                                </div>
                              </div>

                              <div
                                className="text-[#4A5DF9] text-[14px] font-semibold flex items-center gap-2 transition-colors group-hover:text-[#3b4cc4]"
                              >
                                View Path <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ));
                    })()
                  ) : (
                    <div className="col-span-3 text-center py-20 text-gray-500 text-[18px]">
                      No learning paths match your filters.
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                {(() => {
                  const totalPages = Math.ceil(filteredPaths.length / ITEMS_PER_PAGE);
                  if (totalPages <= 1) return null;

                  return (
                    <div className="flex justify-center items-center gap-1 sm:gap-2 mt-12 px-2 flex-wrap">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="h-10 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium text-sm sm:text-base"
                      >
                        <ChevronLeft className="w-4 h-4" />
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

                          return pages.map((page, idx) =>
                            page === '...' ? (
                              <span key={`ellipsis-${idx}`} className="px-1 sm:px-2 text-gray-400 self-center">...</span>
                            ) : (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page as number)}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all text-base ${currentPage === page
                                  ? 'bg-[#4A5DF9] text-white shadow-md'
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
                        className="h-10 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium text-sm sm:text-base"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })()}
              </>
            )}

          </div>
        </section>
      </main>

    </div>

  );
}