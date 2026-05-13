import React, { useState } from "react";
import { Search, GraduationCap, ArrowRight } from "lucide-react";
import { getFaculties } from "@/lib/ai.api";

interface FacultyFormProps {
  initialFacultyId: number | null;
  onNext: (facultyId: number) => void;
}

export function FacultyForm({ initialFacultyId, onNext }: FacultyFormProps) {
  // State for search input and the currently selected faculty
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(initialFacultyId);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadFaculties = async () => {
      try {
        const data = await getFaculties();
        setFaculties(data);
      } catch (err) {
        console.error("Error loading faculties:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadFaculties();
  }, []);

  // Filter the faculties based on the search query
  const filteredFaculties = faculties.filter((faculty) => {
    const name = faculty.eng_name || faculty.th_name || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      {/* Form Card */}
      <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 sm:p-10 shadow-sm">

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#D5E3FF] text-[#4A5DF9]">
            <GraduationCap size={32} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Select Your Faculty</h2>
            <p className="text-sm text-gray-500 mt-1">Which faculty are you in or interested in?</p>
          </div>

        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search faculties..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 text-[16px] focus:border-[#4A5DF9] focus:outline-none"
          />
        </div>

        {/* Faculty Grid with Custom Scrollbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-[300px] sm:max-h-[220px] overflow-y-auto p-1 pr-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#F0F4FF] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#A3C0FF] [&::-webkit-scrollbar-thumb]:rounded-full">

          {isLoading ? (
            <div className="col-span-2 text-center text-gray-500 py-4">Loading faculties...</div>
          ) : filteredFaculties.length > 0 ? (
            filteredFaculties.map((f) => (
              <button 
                key={f.faculty_id}
                onClick={() => setSelectedFacultyId(f.faculty_id)}
                className={`flex w-full items-center justify-start text-left rounded-xl border px-4 py-3 sm:px-6 sm:py-4 text-[15px] sm:text-[18px] font-medium transition-all duration-200 hover:border-[#4A5DF9] hover:bg-[#F0F4FF] hover:text-[#4A5DF9] hover:scale-[1.02] active:scale-[0.98] break-words leading-tight ${
                  selectedFacultyId === f.faculty_id 
                    ? "border-[#4A5DF9] bg-[#F0F4FF] text-[#4A5DF9] shadow-sm ring-1 ring-[#4A5DF9]/30" // Active state styling
                    : "border-gray-200 text-gray-700 bg-white shadow-sm"      // Default state styling
                }`}
              >
                <span className="w-full text-left">{f.eng_name || f.th_name}</span>
              </button>

            ))
          ) : (
            <div className="col-span-2 text-center text-gray-500 py-4">
              No faculties found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-end">
        <button 
          onClick={() => selectedFacultyId && onNext(selectedFacultyId)}
          disabled={!selectedFacultyId}
          className={`group flex items-center gap-2 rounded-xl px-8 py-3 text-[16px] font-medium text-white transition-all duration-300 shadow-sm ${
            selectedFacultyId 
              ? "bg-[#4A5DF9] hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-200 active:scale-95" 
              : "bg-gray-300 cursor-not-allowed opacity-70"
          }`}
        >
          Continue
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </>
  );
}