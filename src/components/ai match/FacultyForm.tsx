import React, { useState } from "react";
import { Search, GraduationCap, ArrowRight } from "lucide-react";

// Expanded list of faculties to ensure the scrollbar is visible
const faculties = [
  "Engineering", 
  "Science", 
  "Business Administration", 
  "Art & Humanities", 
  "Information Technology", 
  "Medicine",
  "Law",
  "Education",
  "Architecture",
  "Agriculture",
  "Fine Arts",
  "Social Sciences",
  "Economics",
  "Dentistry",
  "Pharmacy",
  "Veterinary Science",
  "Nursing"
];

interface FacultyFormProps {
  onNext: () => void;
}

export function FacultyForm({ onNext }: FacultyFormProps) {
  // State for search input and the currently selected faculty
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);

  // Filter the faculties based on the search query
  const filteredFaculties = faculties.filter((faculty) =>
    faculty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Form Card */}
      <div className="w-full rounded-2xl border border-gray-100 bg-white p-10 shadow-sm">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D5E3FF] text-[#4A5DF9]">
            <GraduationCap size={32} />
          </div>
          <div>
            <h2 className="text-[22px] font-semibold text-gray-900">Select Your Faculty</h2>
            <p className="text-[18px] text-gray-500 mt-1">Which faculty are you in or interested in?</p>
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
        <div className="grid grid-cols-2 gap-4 max-h-[220px] overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#F0F4FF] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#A3C0FF] [&::-webkit-scrollbar-thumb]:rounded-full">
          {filteredFaculties.length > 0 ? (
            filteredFaculties.map((f) => (
              <button 
                key={f}
                onClick={() => setSelectedFaculty(f)}
                className={`flex w-full items-center justify-start rounded-xl border px-6 py-4 text-[18px] font-medium transition-all hover:border-[#4A5DF9] hover:bg-[#F0F4FF] hover:text-[#4A5DF9] ${
                  selectedFaculty === f 
                    ? "border-[#4A5DF9] bg-[#F0F4FF] text-[#4A5DF9]" // Active state styling
                    : "border-gray-200 text-gray-700 bg-white"      // Default state styling
                }`}
              >
                {f}
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
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl bg-[#4A5DF9] px-8 py-3 text-[16px] font-medium text-white transition-opacity hover:opacity-90 shadow-sm"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}