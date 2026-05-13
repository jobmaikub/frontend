import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar and footer/Navbar";

interface LearningPathSkeletonProps {
  isDetail?: boolean;
}

const LearningPathSkeleton = ({ isDetail = false }: LearningPathSkeletonProps) => {
  if (isDetail) {
    return (
      <div className="min-h-screen font-['Inter'] flex flex-col">
        <Navbar />
        <main className="bg-[#F4F7FF] flex-grow flex flex-col">
          {/* Top Summary Section Skeleton */}
          <div className="relative w-[100vw] left-1/2 right-1/2 -mx-[50vw] bg-white border-b border-gray-100 pt-8 pb-10 -mt-4 mb-12">
            <div className="w-full max-w-[1000px] mx-auto px-6 sm:px-8">
              <Skeleton className="h-4 w-32 mb-6" />
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="w-full md:w-[240px] h-[190px] rounded-2xl" />
                <div className="flex-grow space-y-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-24 rounded-lg" />
                    <Skeleton className="h-6 w-24 rounded-lg" />
                  </div>
                  <Skeleton className="h-10 w-3/4" />
                  <div className="flex gap-6">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Section Skeleton */}
          <div className="w-full max-w-[1000px] mx-auto px-6 sm:px-8 pb-20">
            <div className="relative pl-4 md:pl-8 space-y-12">
              <div className="absolute left-[2.4rem] md:left-[3.4rem] top-6 bottom-12 w-0.5 bg-gray-200 -z-10" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-6">
                  <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                  <div className="flex-grow space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="space-y-4 pt-4">
                      {[...Array(2)].map((_, j) => (
                        <div key={j} className="h-32 w-full bg-white rounded-2xl border border-gray-100 p-5 flex gap-6">
                          <Skeleton className="w-[140px] h-full rounded-xl" />
                          <div className="flex-grow space-y-3">
                            <Skeleton className="h-5 w-24 rounded-md" />
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-['Inter'] flex flex-col">
      <Navbar />
      <main className="bg-[#F4F7FF] flex-grow flex flex-col">
        {/* Header Skeleton */}
        <div className="w-full bg-white pt-24 pb-10 flex flex-col items-center text-center px-6 sm:px-8 shadow-sm">
          <Skeleton className="h-8 w-32 rounded-full mb-4 bg-[#D5E3FF]/30" />
          <Skeleton className="h-10 w-64 mb-3" />
          <Skeleton className="h-5 w-80" />
        </div>

        <section className="pt-12 pb-24">
          <div className="container mx-auto px-6 sm:px-8 max-w-6xl">
            {/* Search/Filter Bar Skeleton */}
            <div className="flex flex-col lg:flex-row gap-4 mb-10">
              <Skeleton className="flex-grow h-[54px] rounded-xl" />
              <div className="flex gap-4">
                <Skeleton className="h-[54px] w-[220px] rounded-xl" />
                <Skeleton className="h-[54px] w-[220px] rounded-xl" />
              </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden h-[450px]">
                  <Skeleton className="aspect-[3/2] w-full" />
                  <div className="p-5 space-y-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="pt-8 space-y-3">
                      <div className="flex justify-between">
                         <Skeleton className="h-3 w-16" />
                         <Skeleton className="h-3 w-10" />
                      </div>
                      <Skeleton className="h-1.5 w-full rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-24 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LearningPathSkeleton;
