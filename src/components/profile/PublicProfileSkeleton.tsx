import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar and footer/Navbar";

const PublicProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <Navbar />
      
      {/* Header band skeleton */}
      <div className="h-40 bg-muted/30 animate-pulse" />

      <div className="mx-auto -mt-20 max-w-5xl px-8 pb-24">
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          
          {/* Left Column (Profile Card - Matched with PublicProfile.tsx) */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5 h-fit shadow-sm flex flex-col items-center">
            <Skeleton className="h-24 w-24 rounded-full border-4 border-accent" />
            <div className="space-y-2 flex flex-col items-center w-full">
              <Skeleton className="h-6 w-3/4" />
              {/* Email placeholder */}
              <div className="flex items-center justify-center gap-2 mt-1">
                 <Skeleton className="h-4 w-4 rounded" />
                 <Skeleton className="h-4 w-32" />
              </div>
              {/* Joined Date placeholder */}
              <div className="flex items-center justify-center gap-2 mt-1">
                 <Skeleton className="h-4 w-4 rounded" />
                 <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          {/* Right Column (Stats + Content) */}
          <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4 h-[100px] flex items-center gap-4 shadow-sm">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>

            {/* Skills Mastered Area Skeleton */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-6 py-5 bg-white/50">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-4 h-24 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-16 rounded-full" />
                        <Skeleton className="h-1 w-10 rounded-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-6">
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Reviews Area Skeleton */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
               <div className="p-6 border-b border-border">
                 <Skeleton className="h-6 w-32" />
               </div>
               <div className="p-6 space-y-6">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-3 pb-6 border-b border-border last:border-0 last:pb-0">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileSkeleton;
