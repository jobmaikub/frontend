import React, { useState } from "react";
import { Navbar } from "@/components/navbar and footer/Navbar";
import { Footer } from "@/components/navbar and footer/Footer";
import { Search, Filter, TrendingUp, ChevronDown, BookOpen, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { learningPaths, industries, growthRates } from "@/components/learning path/mockData";
import { PathDetail } from "@/components/learning path/PathDetail";

export default function LearningPath() {
  // Application States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedGrowth, setSelectedGrowth] = useState("All Growth Rates");
  
  // Dropdown UI States
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isGrowthOpen, setIsGrowthOpen] = useState(false);

  // View State (null = Grid View, string = Detailed View of that specific ID)
  const [activePathId, setActivePathId] = useState<string | null>(null);

  // Filter Logic
  const filteredPaths = learningPaths.filter((path) => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === "All Industries" || path.industry === selectedIndustry;
    const matchesGrowth = selectedGrowth === "All Growth Rates" || path.growth === selectedGrowth;
    return matchesSearch && matchesIndustry && matchesGrowth;
  });

  return (
    <div className="min-h-screen font-['Inter'] flex flex-col">
      <Navbar />

      <main className="bg-[#D5E3FF]/20 flex-grow flex flex-col">
        
        {/* Render Header only if we are on the main grid view */}
        {!activePathId && (
          <div className="w-full bg-white pt-36 pb-12 flex flex-col items-center text-center px-4 shadow-sm z-10 relative">
            <div className="mb-6 flex items-center justify-center rounded-full bg-[#D5E3FF]/50 px-4 py-1.5">
              <span className="text-[14px] font-medium text-[#4A5DF9]">Learning Path</span>
            </div>
            <h1 className="mb-4 text-[44px] font-bold leading-tight text-[#000000]">
              Choose Your Learning Path
            </h1>
            <p className="text-[18px] text-gray-500">
              Select a career to see its complete learning roadmap
            </p>
          </div>
        )}

        <section className={`pb-24 ${activePathId ? "pt-24" : "pt-12"}`}>
          <div className="container mx-auto px-6 max-w-[1200px]">
            
            {/* Conditional Rendering: Main Grid vs Detailed Path */}
            {activePathId ? (
              // Instruction 4: Render Detailed View
              <PathDetail 
                path={learningPaths.find(p => p.id === activePathId)} 
                onBack={() => setActivePathId(null)} 
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
                        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-2">
                          {industries.map(ind => (
                            <div 
                              key={ind} 
                              onClick={() => { setSelectedIndustry(ind); setIsIndustryOpen(false); }}
                              className="px-5 py-2.5 text-[14px] font-medium text-gray-600 hover:bg-[#F0F4FF] hover:text-[#4A5DF9] cursor-pointer transition-colors"
                            >
                              {ind}
                            </div>
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
                          {growthRates.map(growth => (
                            <div 
                              key={growth} 
                              onClick={() => { setSelectedGrowth(growth); setIsGrowthOpen(false); }}
                              className="px-5 py-2.5 text-[14px] font-medium text-gray-600 hover:bg-[#F0F4FF] hover:text-[#4A5DF9] cursor-pointer transition-colors"
                            >
                              {growth}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPaths.length > 0 ? (
                    filteredPaths.map((path) => (
                      <div key={path.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-md group">
                        
                        <div className="relative h-52 w-full">
                          <img src={path.image} alt={path.title} className="w-full h-full object-cover" />
                          <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide uppercase shadow-sm ${
                            path.growth === 'High Growth' 
                              // 1. Updated to #1FAA52 inside the main grid tags as well
                              ? 'bg-[#E5F7ED] text-[#1FAA52]' 
                              : path.growth === 'Medium Growth'
                                ? 'bg-[#F0F4FF] text-[#4A5DF9]'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            <TrendingUp size={14} strokeWidth={3} /> {path.growth}
                          </div>
                        </div>

                        <div className="p-8 flex flex-col flex-grow">
                          <span className="text-[13px] font-semibold text-[#4A5DF9] mb-2 tracking-wide">
                            {path.industry}
                          </span>
                          <h3 className="text-[20px] font-bold text-gray-900 mb-5">
                            {path.title}
                          </h3>
                          
                          <div className="flex items-center gap-6 text-[14px] font-medium text-gray-600 mb-6">
                            <div className="flex items-center gap-2">
                              <BookOpen size={18} className="text-gray-400" /> {path.courses} courses
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={18} className="text-gray-400" /> {path.hours} hours
                            </div>
                          </div>

                          <div className="mt-auto flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                              <span className="text-[12px] font-medium text-gray-400">
                                {path.progress}% complete
                              </span>
                              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-[#4A5DF9] h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${path.progress}%` }}
                                />
                              </div>
                            </div>

                            {/* View Path Button triggers state change */}
                            <button 
                              onClick={() => setActivePathId(path.id)} 
                              className="text-[#4A5DF9] text-[15px] font-semibold flex items-center gap-2 transition-colors group-hover:text-[#3b4cc4]"
                            >
                              View Path <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-20 text-gray-500 text-[18px]">
                      No learning paths match your filters.
                    </div>
                  )}
                </div>
              </>
            )}
            
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}