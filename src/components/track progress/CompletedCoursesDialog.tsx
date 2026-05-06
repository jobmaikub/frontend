import { useState, useMemo } from "react";
import { Search, BookOpen, Clock, CheckCircle2, X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Course {
  id: number;
  title: string;
  description?: string;
  progress?: number;
  complete?: boolean;
}

interface CompletedCoursesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
}

const ITEMS_PER_PAGE = 5;

const CompletedCoursesDialog = ({
  open,
  onOpenChange,
  courses,
}: CompletedCoursesDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      if (filterStatus === "completed") return matchesSearch && (course.complete || course.progress === 100);
      if (filterStatus === "in-progress") return matchesSearch && !course.complete && (course.progress || 0) < 100;
      
      return matchesSearch;
    });
  }, [courses, searchQuery, filterStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const scrollContainer = document.getElementById("course-scroll-container");
    if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset page when filter or search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md p-0 flex flex-col h-full bg-[#F8FAFC] border-l border-border shadow-2xl z-[60]"
      >
        {/* Header Section - Sticky */}
        <div className="p-6 border-b border-border bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-6">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-xl font-bold text-[#1E293B]">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                My Courses
              </SheetTitle>
            </SheetHeader>
            
            <SheetClose className="p-2 rounded-full hover:bg-slate-100 transition-colors outline-none">
              <X className="w-5 h-5 text-slate-400" />
            </SheetClose>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search your courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11 bg-white border-slate-200 focus:ring-primary/20 rounded-xl"
              />
            </div>

            <Tabs 
              defaultValue="all" 
              className="w-full"
              onValueChange={setFilterStatus}
            >
              <TabsList className="w-full grid grid-cols-3 p-1 bg-slate-100 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg text-xs font-semibold py-2">
                  All ({courses.length})
                </TabsTrigger>
                <TabsTrigger value="in-progress" className="rounded-lg text-xs font-semibold py-2">
                  Active
                </TabsTrigger>
                <TabsTrigger value="completed" className="rounded-lg text-xs font-semibold py-2">
                  Complete
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div id="course-scroll-container" className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-[#F8FAFC]">
          <div className="space-y-4">
            {paginatedCourses.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-sm font-medium text-slate-400">
                  No courses found
                </p>
              </div>
            ) : (
              paginatedCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      course.complete || course.progress === 100 ? 'bg-green-50' : 'bg-blue-50'
                    }`}>
                      {course.complete || course.progress === 100 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-blue-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[15px] text-slate-800 leading-snug">
                        {course.title}
                      </h4>
                      
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Progress
                          </span>
                          <span className="text-[10px] font-bold text-primary">
                            {Math.round(course.progress || 0)}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ease-out rounded-full ${
                              course.complete || course.progress === 100 ? 'bg-green-500' : 'bg-primary'
                            }`}
                            style={{ width: `${course.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination Footer - Sticky */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border bg-white flex items-center justify-center gap-2">
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
                // Show first, last, and pages around current
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

export default CompletedCoursesDialog;