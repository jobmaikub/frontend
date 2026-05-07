import { useState, useMemo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Search, FileText, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { NewsArticle } from '@/types/careers.types';
import { cn } from "@/lib/utils";

interface IndustryNewsSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news: NewsArticle[];
}

const ITEMS_PER_PAGE = 5;

const IndustryNewsSidebar = ({ open, onOpenChange, news: industryNews }: IndustryNewsSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (newsId: string) => {
    setFailedImages((prev) => new Set(prev).add(newsId));
  };

  const filteredNews = useMemo(() => {
    return industryNews.filter((news) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        news.title.toLowerCase().includes(searchLower) ||
        (news.description && news.description.toLowerCase().includes(searchLower));
      return matchesSearch;
    });
  }, [industryNews, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const scrollContainer = document.getElementById("news-scroll-container");
    if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset page when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md p-0 flex flex-col h-full bg-[#F8FAFC] border-l border-border shadow-2xl z-[60]"
      >
        {/* Header Section - Sticky */}
        <div className="p-5 border-b border-border bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-xl font-bold text-[#1E293B]">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                Industry News
              </SheetTitle>
            </SheetHeader>
            
            <SheetClose className="p-2 rounded-full hover:bg-slate-100 transition-colors outline-none">
              <X className="w-5 h-5 text-slate-400" />
            </SheetClose>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11 bg-white border-slate-200 focus:ring-primary/20 rounded-xl"
            />
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div id="news-scroll-container" className="flex-1 overflow-y-auto px-5 py-2 scrollbar-hide bg-[#F8FAFC]">
          <div className="space-y-4">
            {paginatedNews.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-sm font-medium text-slate-400">
                  No news found
                </p>
              </div>
            ) : (
              paginatedNews.map((news) => (
                <a
                  key={news.id}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition-all group overflow-hidden mt-3 first:mt-2"
                >
                  <div className="flex items-start gap-4">
                    {/* Image or Placeholder */}
                    <div className="shrink-0">
                      {!failedImages.has(news.id) && news.image ? (
                        <img
                          src={news.image}
                          alt={news.title}
                          className="h-24 w-32 rounded-xl object-cover"
                          loading="lazy"
                          onError={() => handleImageError(news.id)}
                        />
                      ) : (
                        <div className="h-24 w-32 rounded-xl bg-slate-50 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between self-stretch py-1">
                      <div>
                        <h4 className="font-bold text-[14px] text-slate-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {news.title}
                        </h4>
                        <p className="mt-1.5 text-[11px] text-slate-500 line-clamp-2 leading-normal">
                          {news.description}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center gap-2">
                        <span className="text-[10px] font-bold text-primary/80 uppercase tracking-wider">
                          {news.source}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        {/* Pagination Footer - Sticky */}
        {totalPages > 1 && (
          <div className="p-4 pb-10 sm:pb-4 border-t border-border bg-white flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                        currentPage === pageNum
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum} className="text-slate-300 text-xs">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default IndustryNewsSidebar;
