import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar and footer/Navbar";

const CareerListSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      <Navbar />
      
      {/* Header Section Skeleton */}
      <div className="w-full bg-white pt-24 pb-10 flex flex-col items-center text-center px-8 shadow-sm z-10 relative">
        <Skeleton className="h-8 w-32 rounded-full mb-4 bg-[#D5E3FF]/30" />
        <Skeleton className="h-10 w-64 mb-3" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="max-w-6xl mx-auto px-8 pt-12 pb-24">
        {/* Search and Filters Bar Skeleton */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="flex-grow h-[54px] bg-white rounded-xl border border-gray-200 px-5 flex items-center shadow-sm">
             <Skeleton className="h-5 w-5 mr-3 rounded-full" />
             <Skeleton className="h-5 w-48" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
             <Skeleton className="h-[54px] w-full sm:w-[220px] rounded-xl" />
             <Skeleton className="h-[54px] w-full sm:w-[220px] rounded-xl" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden shadow-sm h-[380px]">
              <Skeleton className="aspect-[3/2] w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <Skeleton className="h-6 w-32 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerListSkeleton;
