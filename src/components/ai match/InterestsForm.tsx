import React, { useState } from "react";
import { Search, Heart, ArrowLeft, Sparkles, X } from "lucide-react";
import { getInterests } from "@/lib/ai.api";


interface InterestsFormProps {
  initialInterestIds: number[];
  onSubmit: (interestIds: number[]) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function InterestsForm({ initialInterestIds, onSubmit, onBack, isLoading }: InterestsFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterestIds, setSelectedInterestIds] = useState<number[]>(initialInterestIds || []);
  const [interests, setInterests] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  React.useEffect(() => {
    const loadInterests = async () => {
      try {
        const data = await getInterests();
        setInterests(data);
      } catch (err) {
        console.error("Error loading interests:", err);
      } finally {
        setIsFetching(false);
      }
    };
    loadInterests();
  }, []);

  // Filter the interests based on the search query
  const filteredInterests = interests.filter((interest) => {
    const name = interest.interest_name || interest.name || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleInterest = (interestId: number) => {
    if (selectedInterestIds.includes(interestId)) {
      // Remove if already selected
      setSelectedInterestIds(selectedInterestIds.filter((i) => i !== interestId));
    } else if (selectedInterestIds.length < 3) {
      // Add if under the limit of 3
      setSelectedInterestIds([...selectedInterestIds, interestId]);
    }
  };

  const removeInterest = (interestId: number) => {
      setSelectedInterestIds(selectedInterestIds.filter((i) => i !== interestId));
  };

  return (
    <>
      {/* Form Card */}
      <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 sm:p-10 shadow-sm">

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#D5E3FF] text-[#4A5DF9]">
            <Heart size={32} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Select Your Interests</h2>
            <p className="text-sm text-gray-500 mt-1">What industries excite you the most? (Max 3)</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-[300px] sm:max-h-[220px] overflow-y-auto p-1 pr-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#F0F4FF] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#A3C0FF] [&::-webkit-scrollbar-thumb]:rounded-full">

          {isFetching ? (
            <div className="col-span-2 text-center text-gray-500 py-4">Loading interests...</div>
          ) : filteredInterests.length > 0 ? (
            filteredInterests.map((interest) => (
              <button 
                key={interest.interest_id} 
                onClick={() => toggleInterest(interest.interest_id)}
                // Disabled styling if limit reached and item not selected
                disabled={selectedInterestIds.length >= 3 && !selectedInterestIds.includes(interest.interest_id)}
                className={`flex w-full items-center justify-start text-left rounded-xl border px-4 py-3 sm:px-6 sm:py-4 text-[15px] sm:text-[18px] font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] break-words leading-tight ${
                  selectedInterestIds.includes(interest.interest_id)
                    ? "border-[#4A5DF9] bg-[#F0F4FF] text-[#4A5DF9] shadow-sm ring-1 ring-[#4A5DF9]/30"
                    : selectedInterestIds.length >= 3 
                      ? "border-gray-100 text-gray-400 bg-gray-50 cursor-not-allowed" // Disabled state
                      : "border-gray-200 text-gray-700 bg-white shadow-sm hover:border-[#4A5DF9] hover:bg-[#F0F4FF] hover:text-[#4A5DF9]"
                }`}
              >
                <span className="w-full text-left">{interest.interest_name || interest.name}</span>
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
          <span>Selected: {selectedInterestIds.length}/3 Interests</span>
          {interests.filter(i => selectedInterestIds.includes(i.interest_id)).map((interest) => (
             <div key={interest.interest_id} className="flex items-center gap-1 rounded-full bg-[#F0F4FF] px-3 py-1 text-[#4A5DF9]">
                <span>{interest.interest_name || interest.name}</span>
                <button onClick={() => removeInterest(interest.interest_id)} className="hover:text-[#3b4cc4] focus:outline-none">
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
          className="group flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3 text-[16px] font-medium text-gray-600 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:bg-gray-50 active:scale-95 shadow-sm"
        >
          <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Back
        </button>
        <button 
          onClick={() => selectedInterestIds.length > 0 && onSubmit(selectedInterestIds)}
          disabled={selectedInterestIds.length === 0 || isLoading}
          className={`group flex items-center gap-2 rounded-xl px-8 py-3 text-[16px] font-medium text-white transition-all duration-300 shadow-sm ${
            selectedInterestIds.length > 0 && !isLoading 
              ? "bg-[#4A5DF9] hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-200 active:scale-95" 
              : "bg-gray-300 cursor-not-allowed opacity-70"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Matching...
            </span>
          ) : (
            <>
              <Sparkles size={16} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              Get Career Match
            </>
          )}
        </button>
      </div>
    </>
  );
}