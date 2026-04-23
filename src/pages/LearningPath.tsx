import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/navbar and footer/Navbar";
import { Footer } from "@/components/navbar and footer/Footer";
import { PathDetail } from "@/components/learning path/PathDetail";

import {
  getLearningPaths,
  getLearningPathDetail,
} from "@/lib/LearningPath.api";

// 🔹 constants กัน typo
const ALL_INDUSTRIES = "All Industries";
const ALL_GROWTH = "All Growth Rates";

// 🔹 types
interface LearningPath {
  career_id: number;
  title: string;
  industry: string;
  growth_rate: string;
  image_url: string;
  total_courses: number;
}

export default function LearningPath() {
  // 🔹 data state
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 detail state
  const [activePathId, setActivePathId] = useState<number | null>(null);
  const [activePath, setActivePath] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 🔹 filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] =
    useState(ALL_INDUSTRIES);
  const [selectedGrowth, setSelectedGrowth] =
    useState(ALL_GROWTH);

  // 🔥 fetch list
  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const data = await getLearningPaths();
        setPaths(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load learning paths");
      } finally {
        setLoading(false);
      }
    };

    fetchPaths();
  }, []);

  // 🔥 fetch detail
  const handleViewPath = async (id: number) => {
    setDetailLoading(true);
    try {
      const data = await getLearningPathDetail(id);
      setActivePath(data);
      setActivePathId(id);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  // 🔥 filter (optimized)
  const filteredPaths = useMemo(() => {
    if (!Array.isArray(paths)) return [];

    return paths.filter((path) => {
      const title = path.title?.toLowerCase() || "";

      const matchesSearch = title.includes(
        searchQuery.toLowerCase()
      );

      const matchesIndustry =
        selectedIndustry === ALL_INDUSTRIES ||
        path.industry === selectedIndustry;

      const matchesGrowth =
        selectedGrowth === ALL_GROWTH ||
        path.growth_rate === selectedGrowth;

      return matchesSearch && matchesIndustry && matchesGrowth;
    });
  }, [paths, searchQuery, selectedIndustry, selectedGrowth]);

  return (
    <div className="min-h-screen font-['Inter'] flex flex-col">
      <Navbar />

      <main className="bg-[#D5E3FF]/20 flex-grow flex flex-col">
        {!activePathId && (
          <div className="w-full bg-white pt-36 pb-12 flex flex-col items-center text-center px-4 shadow-sm">
            <h1 className="mb-4 text-[44px] font-bold">
              Choose Your Learning Path
            </h1>
          </div>
        )}

        <section className={`pb-24 ${activePathId ? "pt-24" : "pt-12"}`}>
          <div className="container mx-auto px-6 max-w-[1200px]">

            {/* 🔥 DETAIL VIEW */}
            {activePathId ? (
              detailLoading ? (
                <div className="text-center py-20">
                  Loading detail...
                </div>
              ) : (
                <PathDetail
                  path={activePath}
                  onBack={() => {
                    setActivePath(null);
                    setActivePathId(null);
                  }}
                />
              )
            ) : (
              <>
                {/* 🔍 SEARCH */}
                <div className="flex mb-10">
                  <input
                    type="text"
                    placeholder="Search careers..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    className="w-full border p-3 rounded-xl"
                  />
                </div>

                {/* ❗ EMPTY STATE */}
                {filteredPaths.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No learning paths found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPaths.map((path) => (
                      <div
                        key={path.career_id}
                        className="bg-white rounded-2xl p-6 shadow"
                      >
                        <img
                          src={path.image_url || "/placeholder.png"}
                          onError={(e) =>
                          (e.currentTarget.src =
                            "/placeholder.png")
                          }
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />

                        <h3 className="text-lg font-bold mb-2">
                          {path.title}
                        </h3>

                        <p className="text-sm text-gray-500 mb-3">
                          {path.industry}
                        </p>

                        <div className="flex justify-between text-sm mb-4">
                          <span>
                            {path.total_courses} courses
                          </span>
                          <span>{path.growth_rate}</span>
                        </div>

                        <button
                          onClick={() =>
                            handleViewPath(path.career_id)
                          }
                          className="text-blue-600 font-semibold"
                        >
                          View Path →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}