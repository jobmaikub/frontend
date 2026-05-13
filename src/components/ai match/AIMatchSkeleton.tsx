import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar and footer/Navbar";

export function AIMatchSkeleton() {
  return (
    <div className="min-h-screen font-['Inter'] flex flex-col bg-[#F4F7FF]">
      <Navbar />
      
      <main className="flex-grow flex flex-col">
        {/* Header Skeleton */}
        <div className="w-full bg-white pt-20 sm:pt-24 pb-8 sm:pb-12 flex flex-col items-center text-center px-6 sm:px-8 shadow-sm">
          <Skeleton className="h-4 w-32 mb-4 rounded-full" />
          <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 mb-4" />
          <Skeleton className="h-4 sm:h-5 w-64 sm:w-96" />
        </div>

        <section className="pb-20 pt-12">
          <div className="mx-auto w-full px-6 sm:px-8 max-w-4xl">
              {/* Steps Stepper Skeleton */}
              <div className="mb-10 flex w-full items-center justify-between px-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    {i < 3 && <Skeleton className="h-[2px] flex-1 mx-4" />}
                  </div>
                ))}
              </div>

              {/* Form Card Skeleton */}
              <div className="w-full rounded-[32px] border border-gray-100 bg-white p-6 sm:p-10 shadow-sm">
                <div className="flex flex-col items-center text-center mb-10">
                  <Skeleton className="h-12 w-12 rounded-full mb-6" />
                  <Skeleton className="h-8 w-48 mb-3" />
                  <Skeleton className="h-5 w-64" />
                </div>

                {/* Grid of options skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-2xl border border-gray-100 p-6 flex flex-col items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  ))}
                </div>

                {/* Buttons Skeleton */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                  <Skeleton className="h-12 w-32 rounded-xl" />
                  <Skeleton className="h-12 w-32 rounded-xl" />
                </div>
              </div>
            </div>
        </section>
      </main>
    </div>
  );
}
