import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar and footer/Navbar";

const TrackProgressSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      <Navbar />
      
      {/* Hero Skeleton */}
      <div className="w-full bg-white pt-24 pb-10 flex flex-col items-center text-center px-8 shadow-sm z-10 relative">
        <div className="mb-4 flex items-center justify-center rounded-full bg-[#D5E3FF]/20 px-4 py-1.5">
          <Skeleton className="h-5 w-24 bg-[#4A5DF9]/10" />
        </div>
        <Skeleton className="h-10 w-64 mb-3" />
        <Skeleton className="h-5 w-48" />
      </div>

      <div className="max-w-6xl mx-auto px-8 pt-12 pb-24 space-y-8">
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 h-[140px] flex flex-col justify-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>

        {/* Activity + Overall Skeleton */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Heatmap Area */}
          <div className="flex-1 rounded-xl border border-border bg-card p-6 min-h-[350px]">
            <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex flex-wrap gap-2">
               {[...Array(50)].map((_, i) => (
                 <Skeleton key={i} className="h-4 w-4 rounded-sm bg-muted/20" />
               ))}
            </div>
          </div>

          {/* Overall Progress Area Skeleton (Matched with premium layout) */}
          <div className="rounded-xl border border-border bg-card p-6 min-w-[280px] w-full lg:w-1/3 flex flex-col justify-between h-[250px] shadow-sm">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-40 mb-8" />

              <div className="flex items-end justify-between mb-4">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-baseline gap-1">
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-5 w-4" />
                </div>
              </div>
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
            <div className="flex justify-end mt-4">
               <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackProgressSkeleton;
