import React from "react";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";

interface CareerMatchesProps {
  onStartOver: () => void;
}

export function CareerMatches({ onStartOver }: CareerMatchesProps) {
  const matches = [
    {
      title: "Data Scientists",
      industry: "Technology",
      matchScore: "95%",
      description: "Data Scientist is a perfect fit for someone with a major in Data Science and skills in Python programming, as it requires strong analytical and programming skills to analyze complex datasets and derive insights.",
      matchingSkills: ["Data Analysis"],
      skillsToDevelop: ["Machine Learning", "Statistical Modeling", "Data Visualization"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Software Engineer",
      industry: "Technology",
      matchScore: "85%",
      description: "With a background in Data Science and Python, transitioning to Software Engineering is a strong fit, leveraging solid programming and development skills.",
      matchingSkills: ["Data Analysis"],
      skillsToDevelop: ["Programming Languages", "Software Development Methodologies"],
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Product Manager",
      industry: "Technology",
      matchScore: "80%",
      description: "Product Management benefits from strong technology awareness and data-driven decision making. A background in Data Science provides analytical skills that support effective product decisions.",
      matchingSkills: ["Data Analysis"],
      skillsToDevelop: ["Project Management", "Market Research", "Business Strategy"],
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="w-full font-['Inter'] flex flex-col items-center">
      
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
        {matches.map((match, index) => (
          <div key={index} className="flex flex-col md:flex-row w-full rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm gap-8">
            
            {/* 1. Left Image - Added `self-center` to perfectly center it vertically against the text on the right! */}
            <div className="w-full md:w-[340px] shrink-0 self-center">
              <div className="w-full aspect-square rounded-2xl overflow-hidden">
                <img src={match.image} alt={match.title} className="w-full h-full object-cover" />
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
                    <span className="text-[32px] font-bold text-[#4A5DF9] leading-none">{match.matchScore}</span>
                    {/* 4. Match text - Font Size 14 */}
                    <p className="text-[14px] text-gray-500 font-medium mt-1">match</p>
                  </div>
                </div>

                {/* 5. Description texts - Font Size 16 */}
                <p className="text-[16px] text-gray-600 leading-relaxed mb-6 pr-4">
                  {match.description}
                </p>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                  <div>
                    {/* 6. Matching Skills Header - Font Size 16 */}
                    <h3 className="text-[16px] font-medium text-gray-500 mb-3">Matching Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {match.matchingSkills.map(skill => (
                        // 7. Data Analysis tag - Font Size 12
                        <span key={skill} className="bg-[#E5F7ED] text-[#22C55E] text-[12px] font-medium px-4 py-2 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    {/* 6. Skills to Develop Header - Font Size 16 */}
                    <h3 className="text-[16px] font-medium text-gray-500 mb-3">Skills to Develop</h3>
                    <div className="flex flex-wrap gap-2">
                      {match.skillsToDevelop.map(skill => (
                        // 8. Skills to develop tag - Font Size 12
                        <span key={skill} className="border border-gray-200 text-gray-600 text-[12px] font-medium px-4 py-2 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* View Career Details Container */}
              <div>
                {/* 9. View Career Details text - Font Size 14 */}
                <button className="flex items-center justify-center gap-2 rounded-xl bg-[#4A5DF9] px-6 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90 w-max">
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
    </div>
  );
}