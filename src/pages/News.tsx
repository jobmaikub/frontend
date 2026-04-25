// // src/pages/News.tsx
// import React, { useState, useMemo } from "react";
// import { Navbar } from "@/components/navbar and footer/Navbar";
// import { Footer } from "@/components/navbar and footer/Footer";
// import { Search, Filter, ChevronDown } from "lucide-react";
// import { newsArticles, industries } from "@/components/news/mockData";
// import NewsCard from "@/components/news/NewsCard";

// export default function News() {
//   // Application States
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedIndustry, setSelectedIndustry] = useState("All Industries");

//   // Dropdown UI States
//   const [isIndustryOpen, setIsIndustryOpen] = useState(false);

//   // Filter Logic
//   const filteredArticles = useMemo(() => {
//     return newsArticles.filter((article) => {
//       const matchesSearch = 
//         article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
//         article.description.toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesIndustry = 
//         selectedIndustry === "All Industries" || 
//         article.category === selectedIndustry;

//       return matchesSearch && matchesIndustry;
//     });
//   }, [searchQuery, selectedIndustry]);

//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       <Navbar />

//       {/* --- HEADER SECTION (White Background) --- */}
//       <section className="w-full flex flex-col items-center pt-32 pb-12 px-4 text-center bg-white">
//         <span className="bg-blue-50 text-blue-500 text-xs font-semibold px-5 py-1.5 rounded-full mb-6">
//           Industry News
//         </span>
//         <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
//           Stay Updated
//         </h1>
//         <p className="text-gray-500 text-base md:text-lg max-w-2xl">
//           Latest news and trends from industries matching your interests.
//         </p>
//       </section>

//       {/* --- CONTENT SECTION (Light Gray/Blue Background) --- */}
//       <section className="flex-grow flex flex-col items-center bg-[#F8FAFC] pt-12 pb-24 w-full">

//         {/* Search and Filter Bar */}
//         <div className="w-full max-w-[1000px] px-4 mb-10 flex flex-col md:flex-row gap-4">

//           {/* Separate Search Box */}
//           <div className="relative flex-grow flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
//             <Search className="absolute left-4 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search careers..."
//               className="w-full pl-11 pr-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 rounded-lg text-sm"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           {/* Separate Industry Filter Dropdown */}
//           <div className="relative md:w-[280px]">
//             <button 
//               className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               onClick={() => setIsIndustryOpen(!isIndustryOpen)}
//             >
//               <div className="flex items-center gap-2">
//                 <Filter className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm font-medium">{selectedIndustry}</span>
//               </div>
//               <ChevronDown className="w-4 h-4 text-gray-400" />
//             </button>

//             {/* Dropdown Menu */}
//             {isIndustryOpen && (
//               <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden z-20">
//                 {industries.map((industry) => (
//                   <button
//                     key={industry}
//                     className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
//                     onClick={() => {
//                       setSelectedIndustry(industry);
//                       setIsIndustryOpen(false);
//                     }}
//                   >
//                     {industry}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* News Grid */}
//         <div className="w-full max-w-[1000px] px-4">
//           {filteredArticles.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredArticles.map((article) => (
//                 <NewsCard key={article.id} article={article} />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200">
//               No articles found matching your criteria.
//             </div>
//           )}
//         </div>

//       </section>

//       <Footer />
//     </div>
//   );
// }

// src/pages/News.tsx
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar and footer/Navbar";
import { Footer } from "@/components/navbar and footer/Footer";
import { Search, Filter, ChevronDown, Loader, ChevronLeft, ChevronRight } from "lucide-react";
import NewsCard from "@/components/news/NewsCard";
import { getNews, searchNews } from "@/lib/news.api";
import type { News } from "@/lib/news.api";
import { getBookmarkedNews } from "@/lib/newsBookmarks";

const ITEMS_PER_PAGE = 12;

export default function News() {
  // Application States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [newsArticles, setNewsArticles] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [industries, setIndustries] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());

  // Dropdown UI States
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);

  // Fetch News Data from Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [newsData, bookmarkedNews] = await Promise.all([
          getNews(),
          getBookmarkedNews().catch((err) => {
            console.error('Failed to load bookmarked news:', err);
            return [] as News[];
          }),
        ]);
        
        console.log('Backend news response sample:', newsData[0]); // Debug
        
        setNewsArticles(newsData);
        setBookmarkedIds(new Set(bookmarkedNews.map((article) => article.news_id)));
        
        // Extract unique industries from news data
        const industriesSet = new Set<string>();
        newsData.forEach((article) => {
          if (article.industries?.name) {
            industriesSet.add(article.industries.name);
          }
        });
        
        // Convert to sorted array and add "All Industries" at the start
        const sortedIndustries = Array.from(industriesSet).sort();
        setIndustries(["All Industries", ...sortedIndustries]);
        
        console.log('Industries extracted:', sortedIndustries); // Debug
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load news articles');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search and Filter with Backend
  const [filteredArticles, setFilteredArticles] = useState<News[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      try {
        setSearchLoading(true);
        let results: News[];
        
        if (searchQuery.trim()) {
          // Call backend search API
          results = await searchNews(searchQuery, selectedIndustry);
          
          if (selectedIndustry !== "All Industries") {
            // Filter by industry if selected
            results = results.filter(
              (article) => article.industries?.name === selectedIndustry
            );
          }
        } else {
          // If no search query, use all articles
          results = newsArticles;
          
          if (selectedIndustry !== "All Industries") {
            results = results.filter(
              (article) => article.industries?.name === selectedIndustry
            );
          }
        }

        results = [...results].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setFilteredArticles(results);
        setCurrentPage(1); // Reset to first page when search/filter changes
      } catch (err) {
        console.error('Error performing search:', err);
        setFilteredArticles([]);
      } finally {
        setSearchLoading(false);
      }
    };

    performSearch();
  }, [searchQuery, selectedIndustry, newsArticles]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen flex flex-col bg-white font-['Inter']">
      <Navbar />

      {/* --- HEADER SECTION (White Background) --- */}
      <section className="w-full flex flex-col items-center pt-32 pb-12 px-4 text-center bg-white">
        <span className="bg-blue-50 text-[14px] font-normal text-[#4A5DF9] px-5 py-1.5 rounded-full mb-6">
          Industry News
        </span>
        <h1 className="text-[40px] font-semibold text-[#000000] mb-4 tracking-tight">
          Stay Updated
        </h1>
        <p className="text-[18px] font-normal text-[#505050] max-w-2xl">
          Latest news and trends from industries matching your interests.
        </p>
      </section>

      {/* --- CONTENT SECTION (Light Blue Background) --- */}
      <section className="flex-grow flex flex-col items-center bg-[#D5E3FF]/20 pt-12 pb-24 w-full">

        {/* Search and Filter Bar */}
        <div className="w-full max-w-[1000px] px-4 mb-10 flex flex-col md:flex-row gap-4">

          {/* Separate Search Box */}
          <div className="relative flex-grow flex items-center bg-white rounded-lg border border-gray-200 shadow-sm focus-within:border-[#4A5DF9] transition-colors duration-200">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search careers..."
              className="w-full pl-11 pr-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 rounded-lg text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Separate Industry Filter Dropdown */}
          <div className="relative md:w-[280px]">
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsIndustryOpen(!isIndustryOpen)}
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">{selectedIndustry}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {isIndustryOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden z-20">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => {
                      setSelectedIndustry(industry);
                      setIsIndustryOpen(false);
                    }}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* News Grid */}
        <div className="w-full max-w-[1000px] px-4">
          {loading || searchLoading ? (
            <div className="text-center py-20">
              <div className="flex justify-center items-center mb-4">
                <Loader className="w-8 h-8 text-[#4A5DF9] animate-spin" />
              </div>
              <p className="text-gray-500">{loading ? 'Loading news articles...' : 'Searching...'}</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 bg-white rounded-xl border border-red-200">
              {error}
            </div>
          ) : filteredArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedArticles.map((article) => (
                  <NewsCard
                    key={article.news_id}
                    article={article}
                    initiallyBookmarked={bookmarkedIds.has(article.news_id)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Smart Page Numbers */}
                  <div className="flex gap-1">
                    {(() => {
                      const pages = [];
                      const maxVisible = 5; // Show max 5 page buttons
                      const halfWindow = Math.floor(maxVisible / 2);
                      
                      let startPage = Math.max(1, currentPage - halfWindow);
                      let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                      
                      // Adjust start if we're near the end
                      if (endPage - startPage + 1 < maxVisible) {
                        startPage = Math.max(1, endPage - maxVisible + 1);
                      }

                      // Add first page if not shown
                      if (startPage > 1) {
                        pages.push(1);
                        if (startPage > 2) {
                          pages.push('...');
                        }
                      }

                      // Add middle pages
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(i);
                      }

                      // Add last page if not shown
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push('...');
                        }
                        pages.push(totalPages);
                      }

                      return pages.map((page, idx) => 
                        page === '...' ? (
                          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page as number)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-[#4A5DF9] text-white'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
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
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200">
              No articles found matching your criteria.
            </div>
          )}
        </div>

      </section>

      <Footer />
    </div>
  );
}