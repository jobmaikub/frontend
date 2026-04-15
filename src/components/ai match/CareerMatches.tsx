import React, { useState } from "react";
import { Check, ArrowLeft, ArrowRight, X } from "lucide-react";
import { getCareerDetails } from "@/lib/ai.api";

interface CareerMatchesProps {
  onStartOver: () => void;
  matches: any[];
}

export function CareerMatches({ onStartOver, matches }: CareerMatchesProps) {
  const [selectedCareer, setSelectedCareer] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleViewDetails = async (careerId: number) => {
    setIsModalOpen(true);
    setIsLoadingDetails(true);
    setSelectedCareer(null);
    try {
      const data = await getCareerDetails(careerId);
      setSelectedCareer(data);
    } catch (err) {
      console.error("Error fetching career details:", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className="w-full font-['Inter'] flex flex-col items-center relative">
      
      {/* Success Header */}
      <div className="mb-10 flex flex-col items-center text-center mt-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5F7ED] text-[#22C55E] mb-6 shadow-sm border border-[#C6F0D8]">
          <Check size={24} />
        </div>
        <h1 className="text-[28px] font-bold text-gray-900 mb-2">Your Career Matches</h1>
        {/* Updated subtext to font size 18px */}
        <p className="text-[18px] text-gray-500">Based on your profile, here are your top career recommendations.</p>
      </div>

      {/* Career Cards List */}
      <div className="w-full max-w-[1100px] flex flex-col gap-8 px-4">
        {matches && Array.isArray(matches) && matches.map((match, index) => (
          <div key={index} className="flex flex-col md:flex-row w-full rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm gap-8">
            
            {/* 1. Left Image - Added `self-center` to perfectly center it vertically against the text on the right! */}
            <div className="w-full md:w-[340px] shrink-0 self-center">
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                {match.image_url ? (
                  <img src={match.image_url} alt={match.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                
                {/* Header Row */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {/* 2. Job Title - Font Size 20 */}
                    <h2 className="text-[20px] font-bold text-gray-900 leading-tight">{match.title}</h2>
                    {/* 3. Technology text - Font Size 16 */}
                    <span className="text-[16px] font-medium text-[#4A5DF9] block mt-1">{match.industry}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[32px] font-bold text-[#4A5DF9] leading-none">{match.match_score ?? match.score ?? "N/A"}%</span>
                    {/* 4. Match text - Font Size 14 */}
                    <p className="text-[14px] text-gray-500 font-medium mt-1">match</p>
                  </div>
                </div>

                {/* 5. Description texts - Font Size 16 */}
                <p className="text-[16px] text-gray-600 leading-relaxed mb-6 pr-4">
                  {match.explanation || match.description}
                </p>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                  <div>
                    {/* 6. Matching Skills Header - Font Size 16 */}
                    <h3 className="text-[16px] font-medium text-gray-500 mb-3">Matching Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {(match.matching_skills || match.matchingSkills || []).length > 0 ? (
                        (match.matching_skills || match.matchingSkills || []).map((skill: string) => (
                          <span key={skill} className="bg-[#E5F7ED] text-[#22C55E] text-[12px] font-medium px-4 py-2 rounded-full">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-[14px] text-gray-400 italic">None identified</span>
                      )}
                    </div>
                  </div>
                  <div>
                    {/* 6. Skills to Develop Header - Font Size 16 */}
                    <h3 className="text-[16px] font-medium text-gray-500 mb-3">Skills to Develop</h3>
                    <div className="flex flex-wrap gap-2">
                      {(match.skills_to_develop || match.skillsToDevelop || []).length > 0 ? (
                        (match.skills_to_develop || match.skillsToDevelop || []).map((skill: string) => (
                          <span key={skill} className="border border-gray-200 text-gray-600 text-[12px] font-medium px-4 py-2 rounded-full">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-[14px] text-gray-400 italic">Not specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* View Career Details Container */}
              <div>
                {/* 9. View Career Details text - Font Size 14 */}
                <button 
                  onClick={() => handleViewDetails(match.career_id || match.id)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#4A5DF9] px-6 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90 w-max"
                >
                  View Career Details
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Start Over Button */}
      <button 
        onClick={onStartOver}
        className="mt-12 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-50 shadow-sm"
      >
        <ArrowLeft size={16} />
        Start Over
      </button>

      {/* Modal / Dialog for Career Details */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-2xl shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
            
            {isLoadingDetails ? (
              <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-4">
                <div className="w-8 h-8 rounded-full border-4 border-t-[#4A5DF9] border-gray-200 animate-spin"></div>
                Loading career details...
              </div>
            ) : selectedCareer ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCareer.title}</h2>
                <span className="text-[16px] font-medium text-[#4A5DF9] block mb-6">{selectedCareer.industry}</span>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 mb-6">{selectedCareer.description || "No description available."}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Required Skills</h3>
                    <ul className="list-disc pl-5 text-gray-600">
                      {selectedCareer.skills_required && Array.isArray(selectedCareer.skills_required) 
                        ? selectedCareer.skills_required.map((s: string, i: number) => <li key={i}>{s}</li>)
                        : <li>Information coming soon...</li>}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Salary Estimate</h3>
                    <p className="text-gray-600">{selectedCareer.salary_estimate || "N/A"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-gray-500">
                Failed to load career details.
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-gray-200 px-6 py-3 text-[14px] font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}