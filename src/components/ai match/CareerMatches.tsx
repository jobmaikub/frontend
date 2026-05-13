import { useNavigate } from "react-router-dom";
import { User, Briefcase, Star, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CareerMatchesProps {
  onStartOver: () => void;
  matches: any[];
}

const HeaderScene = ({ opacity = 1, isZoomed = false }: { opacity?: number; isZoomed?: boolean }) => (
  <div className="relative w-full max-w-lg flex items-center justify-center h-48" style={{ opacity }}>
    {/* Side Node 1 - The User */}
    <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2">
      <div className={`${!isZoomed ? "animate-float" : ""}`}>
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-gray-100 opacity-60 ${!isZoomed ? "shadow-md" : ""}`}>
          <User size={28} className="text-[#4A5DF9]" />
        </div>
      </div>
    </div>

    {/* Main Visual: Central Career Card */}
    <div className="relative z-10">
      <div className={`${!isZoomed ? "animate-float" : ""}`} style={{ animationDelay: '0.5s' }}>
        <div className={`flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white border border-gray-100 ${!isZoomed ? "shadow-xl" : ""}`}>
          <Briefcase size={48} className="text-[#4A5DF9]" />
        </div>
      </div>
    </div>

    {/* Side Node 2 - The Result */}
    <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2">
      <div className={`${!isZoomed ? "animate-float" : ""}`} style={{ animationDelay: '2s' }}>
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-gray-100 opacity-60 ${!isZoomed ? "shadow-md" : ""}`}>
          <Star size={28} className="text-yellow-400" />
        </div>
      </div>
    </div>
  </div>
);

export function CareerMatches({ onStartOver, matches }: CareerMatchesProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full font-['Inter'] flex flex-col items-center relative">

      {/* Success Header - Professional Discovery Visual with PERFECT 2.0X ZOOM */}
      <div className="-mt-10 mb-10 flex flex-col items-center text-center relative w-full py-4 overflow-hidden h-[340px]">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent)] opacity-10 pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(#4A5DF9_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>

        {/* The Scene Container (Static, icons inside float independently) */}
        <div className="relative w-full max-w-2xl h-48 mt-4 flex items-center justify-center">
          {/* Layer 1: The Background Scene */}
          <div className="absolute inset-0 flex items-center justify-center">
            <HeaderScene />
          </div>

          {/* Layer 2: The Magnifier Frame & Zoom */}
          <div className="absolute inset-0 z-30 animate-scan-wide pointer-events-none flex items-center justify-center">
            <div className="relative flex flex-col items-center">
              {/* The Lens Rim */}
              <div className="w-24 h-24 rounded-full border-[6px] border-gray-900 shadow-2xl relative flex items-center justify-center overflow-hidden bg-[#f8faff]">

                {/* The Internal Zoomed Scene - Perfectly aligned at 2.0x */}
                <div className="absolute inset-0 animate-scan-reverse flex items-center justify-center">
                  <div className="scale-[2.0] w-[512px] flex items-center justify-center">
                    <HeaderScene isZoomed={true} />
                  </div>
                </div>
              </div>

              {/* Realistic Handle */}
              <div className="relative flex flex-col items-center -mt-1">
                <div className="w-6 h-2 bg-gray-700 rounded-full shadow-sm z-10"></div>
                <div className="w-4 h-12 bg-gray-900 rounded-b-2xl shadow-xl -mt-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Atmosphere Glow */}
        <div className="absolute inset-0 bg-[#4A5DF9]/5 blur-[80px] animate-pulse -z-10"></div>

        <div className="mt-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
            Found {matches?.length || 0} Matches
          </h1>
          <p className="text-[17px] md:text-[18px] text-gray-500 max-w-2xl font-medium leading-relaxed px-6">
            Our AI has scanned the industry to identify the perfect career paths for your unique profile.
          </p>
        </div>
      </div>

      {/* Career Cards List */}
      <div className="w-full flex flex-col gap-8">
        {matches && Array.isArray(matches) && matches.map((match, index) => (
          <div key={match.career_id || match.id || index} className="flex flex-col md:flex-row items-start w-full rounded-[32px] border border-gray-100 bg-white p-6 sm:p-8 shadow-sm gap-6 sm:gap-8">

            {/* 1. Left Image - Compact & Cropped */}
            <div className="w-full md:w-[320px] flex-shrink-0">
              <div className="w-full aspect-[4/3] md:h-[280px] rounded-2xl overflow-hidden bg-gray-50 border border-gray-50">
                {match.image_url ? (
                  <img src={match.image_url} alt={match.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2">
                    <Briefcase size={40} className="text-gray-200" />
                    <span className="text-gray-400 text-xs font-medium">No Career Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 flex flex-col">
              <div>

                {/* Header Row */}
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div className="flex-1">
                    {/* 2. Job Title - Font Size 20 */}
                    <h2 className="text-[20px] font-bold text-gray-900 leading-tight">{match.title}</h2>
                    {/* 3. Technology text - Font Size 16 */}
                    <span className="text-[16px] font-medium text-[#4A5DF9] block mt-1">{match.industry}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[32px] font-bold text-[#4A5DF9] leading-none">{match.match_score ?? match.score ?? "N/A"}%</span>
                  </div>
                </div>

                {/* 5. Description texts - Font Size 14 */}
                <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                  {match.explanation || match.description}
                </p>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                  <div>
                    {/* 6. Matching Skills Header - Font Size 16 (Black) */}
                    <h3 className="text-[16px] font-semibold text-gray-900 mb-3">Matching Skills</h3>
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
                    {/* 6. Skills to Develop Header - Font Size 16 (Black) */}
                    <h3 className="text-[16px] font-semibold text-gray-900 mb-3">Skills to Develop</h3>
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
              <div className="mt-auto">
                {/* 9. View Career Details text - Font Size 14 */}
                <button
                  onClick={() => navigate(`/careers/${match.career_id || match.id}`)}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-[#4A5DF9] px-6 py-3 text-[14px] font-medium text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-200 active:scale-95 w-max"
                >
                  View Career Details
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Start Over Button */}
      <Button
        variant="outline"
        size="lg"
        onClick={onStartOver}
        className="group gap-2 mt-12 w-full sm:w-auto transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-95 bg-white border-gray-200 text-gray-900 hover:text-[#4A5DF9] rounded-xl px-12"
      >
        <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
        Start Over
      </Button>
    </div>
  );
}
