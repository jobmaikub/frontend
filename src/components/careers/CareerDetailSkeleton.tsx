import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar and footer/Navbar";

const CareerDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <Navbar />
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Back Button Skeleton */}
        <Skeleton className="h-4 w-32 mb-6" />

        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Skeleton className="w-full md:w-56 h-56 md:h-40 rounded-2xl md:rounded-xl" />
          <div className="flex-grow space-y-4 w-full">
            <div className="flex gap-2 justify-center md:justify-start">
              <Skeleton className="h-6 w-24 rounded-lg" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-10 w-3/4 mx-auto md:mx-0" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-2xl mx-auto md:mx-0" />
              <Skeleton className="h-4 w-5/6 max-w-2xl mx-auto md:mx-0" />
            </div>
          </div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="mt-10 flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          
          {/* Left Column */}
          <div className="space-y-6">
            {/* Salary Card Skeleton */}
            <div className="bg-primary/10 rounded-2xl p-6 h-[160px] flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl bg-primary/20" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-12 w-48 mt-4 bg-primary/20" />
            </div>

            {/* Action Button Skeleton */}
            <Skeleton className="h-[80px] w-full rounded-2xl" />

            {/* Tabs Skeleton */}
            <div className="rounded-2xl bg-muted/30 p-1.5 space-y-4">
               <div className="flex gap-1">
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                  <Skeleton className="h-10 flex-1 rounded-lg" />
               </div>
               <div className="bg-white rounded-xl p-6 border border-border h-[200px] space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column (News Sidebar) */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-14 w-16 rounded-lg flex-shrink-0" />
                    <div className="space-y-2 flex-grow">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CareerDetailSkeleton;
