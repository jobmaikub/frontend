// src/pages/News.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/navbar and footer/Navbar";
import { Footer } from "@/components/navbar and footer/Footer";
import { Search, Filter, ChevronDown, Loader, ChevronLeft, ChevronRight } from "lucide-react";
import NewsCard from "@/components/news/NewsCard";
import { getNews, searchNews } from "@/lib/news.api";
import type { News } from "@/lib/news.api";
import { getBookmarkedNews } from "@/lib/newsBookmarks.api";

import { useAuth } from "@/contexts/AuthContexts";

import { useQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 12;

import NewsSkeleton from "@/components/news/NewsSkeleton";

export default function News() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [currentPage, setCurrentPage] = useState(1);
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);

  useEffect(() => {
    document.title = "ข่าวสารวงการอาชีพ | Jobmaikub";
  }, []);

  // Fetch News Data using React Query
  const { data: newsArticles = [], isLoading: loading, error: fetchError } = useQuery({
    queryKey: ['news'],
    queryFn: getNews,
  });

  // Fetch Bookmarks using React Query
  const { data: bookmarkedNews = [] } = useQuery({
    queryKey: ['news-bookmarks', user?.id],
    queryFn: getBookmarkedNews,
    enabled: !!user,
  });

  const bookmarkedIds = new Set(bookmarkedNews.map((article: any) => article.news_id));

  // Extract industries from cached news data
  const industries = useMemo(() => {
    const industriesSet = new Set<string>();
    newsArticles.forEach((article) => {
      if (article.industries?.name) {
        industriesSet.add(article.industries.name);
      }
    });
    const sortedIndustries = Array.from(industriesSet).sort();
    return ["All Industries", ...sortedIndustries];
  }, [newsArticles]);

  // Client-side filtering and sorting
  const filteredArticles = useMemo(() => {
    let results = newsArticles;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query)
      );
    }

    if (selectedIndustry !== "All Industries") {
      results = results.filter(
        (article) => article.industries?.name === selectedIndustry
      );
    }

    return [...results].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [searchQuery, selectedIndustry, newsArticles]);

  const error = fetchError ? 'Failed to load news articles' : null;
  const searchLoading = false; // No longer needed for client-side search

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  if (loading || searchLoading) {
    return <NewsSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-['Inter']">
      <Navbar />

      {/* Header Section */}
      <div className="w-full bg-white pt-24 pb-10 flex flex-col items-center text-center px-8 shadow-sm z-10 relative">
        <div className="mb-4 flex items-center justify-center rounded-full bg-[#D5E3FF]/50 px-4 py-1.5">
          <span className="text-[14px] font-medium text-[#4A5DF9]">Industry News</span>
        </div>
        <h1 className="mb-3 text-[32px] font-bold leading-tight text-[#000000]">
          Stay Updated
        </h1>
        <p className="text-[16px] text-gray-500 max-w-2xl">
          Latest news and trends from industries matching your interests.
        </p>
      </div>



      {/* --- CONTENT SECTION (Light Blue Background) --- */}
      <section className="flex-grow flex flex-col items-center bg-[#F4F7FF] pt-12 pb-24 w-full">

        {/* Search and Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10 w-full max-w-6xl px-8">
          {/* 1. Search Input */}
          <div className="flex-grow flex items-center bg-white rounded-xl border border-gray-200 px-5 py-3.5 shadow-sm transition-all focus-within:border-[#4A5DF9] focus-within:ring-1 focus-within:ring-[#4A5DF9]">
            <Search className="text-gray-400 mr-3" size={20} />
            <input
              type="text"
              placeholder="Search news..."
              className="w-full bg-transparent outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            {/* 2. Industry Dropdown */}
            <div className="relative">
              <button
                className="flex items-center justify-between w-full sm:w-[220px] gap-3 bg-white border border-gray-200 rounded-xl px-5 py-3.5 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsIndustryOpen(!isIndustryOpen)}
              >
                <div className="flex items-center gap-2 truncate">
                  <Filter size={18} className={selectedIndustry !== "All Industries" ? "text-[#4A5DF9]" : "text-gray-400"} />
                  <span className={`text-[15px] font-medium truncate ${selectedIndustry !== "All Industries" ? "text-[#4A5DF9]" : ""}`}>
                    {selectedIndustry}
                  </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isIndustryOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isIndustryOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden z-20 py-2">
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      className={`w-full text-left px-5 py-2.5 text-[14px] hover:bg-gray-50 transition-colors ${selectedIndustry === industry ? "text-[#4A5DF9] font-medium bg-[#D5E3FF]/10" : "text-gray-700"}`}
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
        </div>


        {/* News Grid */}
        <div className="max-w-6xl mx-auto px-8 w-full">

          {error ? (
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
                <div className="flex justify-center items-center gap-1 sm:gap-2 mt-12 px-2 flex-wrap">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="h-10 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium text-sm sm:text-base"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Smart Page Numbers */}
                  <div className="flex gap-1">
                    {(() => {
                      const pages = [];
                      const maxVisible = 3;
                      const halfWindow = Math.floor(maxVisible / 2);

                      if (totalPages > 0) { // Safety check
                        let startPage = Math.max(1, currentPage - halfWindow);
                        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

                        if (endPage - startPage + 1 < maxVisible) {
                          startPage = Math.max(1, endPage - maxVisible + 1);
                        }

                        if (startPage > 1) {
                          pages.push(1);
                          if (startPage > 2) {
                            pages.push('...');
                          }
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(i);
                        }

                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push('...');
                          }
                          pages.push(totalPages);
                        }
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
                    <ChevronRight className="h-4 w-4" />
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