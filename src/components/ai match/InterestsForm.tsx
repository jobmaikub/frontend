import React, { useState } from "react";
import { Search, Heart, ArrowLeft, Sparkles, X } from "lucide-react";

// Expanded list of interests/industries
const interestsList = [
  "Technology", 
  "Design & Creative", 
  "Business & Finance", 
  "Healthcare", 
  "Education", 
  "Science & Research",
  "Marketing & Advertising",
  "Media & Communications",
  "Environmental Sustainability",
  "Artificial Intelligence",
  "E-commerce",
  "Real Estate",
  "Automotive",
  "Entertainment & Gaming",
  "Travel & Hospitality",
  "Law & Public Policy",
  "Non-profit & Social Work"
];

interface InterestsFormProps {
  onNext: () => void;
  onBack: () => void;
}

export function InterestsForm({ onNext, onBack }: InterestsFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Filter the interests based on the search query
  const filteredInterests = interestsList.filter((interest) =>
    interest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      // Remove if already selected
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else if (selectedInterests.length < 3) {
      // Add if under the limit of 3
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const removeInterest = (interest: string) => {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
  };

  return (
    <>
      {/* Form Card */}
      <div className="w-full rounded-2xl border border-gray-100 bg-white p-10 shadow-sm">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D5E3FF] text-[#4A5DF9]">
            <Heart size={32} />
          </div>
          <div>
            <h2 className="text-[22px] font-semibold text-gray-900">Select Your Interests</h2>
            <p className="text-[18px] text-gray-500 mt-1">What industries excite you the most? (Max 3)</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search interests..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 text-[16px] focus:border-[#4A5DF9] focus:outline-none"
          />
        </div>

        {/* Interests Grid with Custom Scrollbar */}
        <div className="grid grid-cols-2 gap-4 max-h-[220px] overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#F0F4FF] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#A3C0FF] [&::-webkit-scrollbar-thumb]:rounded-full">
          {filteredInterests.length > 0 ? (
            filteredInterests.map((interest) => (
              <button 
                key={interest} 
                onClick={() => toggleInterest(interest)}
                // Disabled styling if limit reached and item not selected
                disabled={selectedInterests.length >= 3 && !selectedInterests.includes(interest)}
                className={`flex w-full items-center justify-start rounded-xl border px-6 py-4 text-[18px] font-medium transition-all ${
                  selectedInterests.includes(interest)
                    ? "border-[#4A5DF9] bg-[#F0F4FF] text-[#4A5DF9]"
                    : selectedInterests.length >= 3 
                      ? "border-gray-100 text-gray-400 bg-gray-50 cursor-not-allowed" // Disabled state
                      : "border-gray-200 text-gray-700 bg-white hover:border-[#4A5DF9] hover:bg-[#F0F4FF] hover:text-[#4A5DF9]"
                }`}
              >
                {interest}
              </button>
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-500 py-4">
              No interests found matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Selected Counter & Bubbles */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-[14px] font-medium text-gray-500">
          <span>Selected: {selectedInterests.length}/3 Interests</span>
          {selectedInterests.map((interest) => (
             <div key={interest} className="flex items-center gap-1 rounded-full bg-[#F0F4FF] px-3 py-1 text-[#4A5DF9]">
                <span>{interest}</span>
                <button onClick={() => removeInterest(interest)} className="hover:text-[#3b4cc4] focus:outline-none">
                    <X size={14} />
                </button>
             </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3 text-[16px] font-medium text-gray-600 transition-colors hover:bg-gray-50 shadow-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button 
          onClick={onNext}
          // Optional: You could add `disabled={selectedInterests.length === 0}` if you want to require at least 1 selection before moving forward!
          className="flex items-center gap-2 rounded-xl bg-[#4A5DF9] px-8 py-3 text-[16px] font-medium text-white transition-opacity hover:opacity-90 shadow-sm"
        >
          <Sparkles size={16} />
          Get Career Match
        </button>
      </div>
    </>
  );
}