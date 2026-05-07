import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar and footer/Navbar";

const NewsSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-['Inter']">
      <Navbar />
      
      {/* Header Section Skeleton */}
      <div className="w-full bg-white pt-24 pb-10 flex flex-col items-center text-center px-8 shadow-sm z-10 relative">
        <Skeleton className="h-8 w-32 rounded-full mb-4 bg-[#D5E3FF]/30" />
        <Skeleton className="h-10 w-64 mb-3" />
        <Skeleton className="h-5 w-80" />
      </div>

      <section className="flex-grow flex flex-col items-center bg-[#F4F7FF] pt-12 pb-24 w-full">
        {/* Search and Filters Skeleton */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10 w-full max-w-6xl px-8">
          <div className="flex-grow h-[54px] bg-white rounded-xl border border-gray-200 px-5 flex items-center shadow-sm">
             <Skeleton className="h-5 w-5 mr-3 rounded-full" />
             <Skeleton className="h-5 w-48" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
             <Skeleton className="h-[54px] w-full sm:w-[220px] rounded-xl" />
          </div>
        </div>

        {/* News Grid Skeleton */}
        <div className="max-w-6xl mx-auto px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm h-[420px] flex flex-col">
                <Skeleton className="h-52 w-full" />
                <div className="p-5 space-y-4 flex-grow">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-7 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-50">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsSkeleton;
