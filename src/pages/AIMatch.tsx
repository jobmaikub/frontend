import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar and footer/Navbar";
import { QuestionnaireHeader } from "@/components/ai match/QuestionnaireHeader";
import { FacultyForm } from "@/components/ai match/FacultyForm";
import { MajorForm } from "@/components/ai match/MajorForm";
import { SkillsForm } from "@/components/ai match/SkillsForm";
import { InterestsForm } from "@/components/ai match/InterestsForm";
import { CareerMatches } from "@/components/ai match/CareerMatches";
import { GraduationCap, BookOpen, Lightbulb, Heart } from "lucide-react";
import React from "react";
import { useAuth } from "@/contexts/AuthContexts";
import { getMatchHistory, submitMatch, CareerMatch } from "@/lib/ai.api";



const sortMatchesByScoreDesc = (matches: CareerMatch[]): CareerMatch[] => {
  return [...matches].sort(
    (a, b) => Number(b.match_score ?? b.score ?? 0) - Number(a.match_score ?? a.score ?? 0)
  );
};

export default function AIMatch() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [facultyId, setFacultyId] = useState<number | null>(null);
  const [majorId, setMajorId] = useState<number | null>(null);
  const [skills, setSkills] = useState<number[]>([]);
  const [interests, setInterests] = useState<number[]>([]);
  const [matchResults, setMatchResults] = useState<CareerMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryChecked, setIsHistoryChecked] = useState(false);

  // Check for previous matches on mount
  useEffect(() => {
    const currentUserId = user?.id;
    if (!currentUserId) {
      setIsHistoryChecked(true);
      setMatchResults([]);
      return;
    }

    const checkHistory = async () => {
      try {
        const data = await getMatchHistory(currentUserId);
        if (data && Array.isArray(data) && data.length > 0) {
          setMatchResults(sortMatchesByScoreDesc(data));
          setCurrentStep(4);
        }
      } catch (error) {
        console.error("Error checking history:", error);
      } finally {
        setIsHistoryChecked(true);
      }
    };

    checkHistory();
  }, [isHistoryChecked, user?.id]);

  const handleBack = () => setCurrentStep((prev) => prev - 1);
  const handleStartOver = () => {
    setCurrentStep(0);
    setFacultyId(null);
    setMajorId(null);
    setSkills([]);
    setInterests([]);
    setMatchResults([]);
  };

  const handleFacultyNext = (id: number) => {
    setFacultyId(id);
    setCurrentStep(1);
  };

  const handleMajorNext = (id: number) => {
    setMajorId(id);
    setCurrentStep(2);
  };

  const handleSkillsNext = (selectedSkills: number[]) => {
    setSkills(selectedSkills);
    setCurrentStep(3);
  };

  const handleInterestsSubmit = async (selectedInterests: number[]) => {
    const currentUserId = user?.id;
    if (!currentUserId) return;

    setInterests(selectedInterests);
    setIsLoading(true);
    try {
      const data = await submitMatch({
        faculty_id: facultyId!,
        major_id: majorId!,
        skills: skills,
        interests: selectedInterests,
        user_id: currentUserId,
      });
      setMatchResults(sortMatchesByScoreDesc(data));
      setCurrentStep(4);
    } catch (error) {
      console.error("Error submitting match:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { name: "Faculty", icon: <GraduationCap size={20} /> },
    { name: "Major", icon: <BookOpen size={20} /> },
    { name: "Skills", icon: <Lightbulb size={20} /> },
    { name: "Interests", icon: <Heart size={20} /> },
  ];

  const isComplete = currentStep >= steps.length;

  return (
    <div className="min-h-screen font-['Inter'] flex flex-col">
      <Navbar />

      <main className="bg-[#F4F7FF] flex-grow flex flex-col">

        <QuestionnaireHeader />

        <section className={`pb-20 flex justify-center pt-12`}>
          <div className="container mx-auto px-8 flex justify-center">

            {/* THE FIX: Dynamically switch from max-w-4xl to max-w-[1300px] when complete */}
            <div className={`w-full font-['Inter'] transition-all duration-300 ${isComplete ? "max-w-[1300px]" : "max-w-4xl"}`}>

              {!isComplete && (
                <div className="mb-10 flex w-full items-center justify-between px-2 text-center">
                  {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isPast = index < currentStep;

                    return (
                      <React.Fragment key={index}>
                        <div className="flex flex-col items-center gap-3">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all ${isActive || isPast
                                ? "bg-[#4A5DF9] text-white"
                                : "bg-[#D5E3FF] text-[#799EFF]"
                              }`}
                          >
                            {step.icon}
                          </div>
                          <span
                            className={`text-[16px] font-medium ${isActive || isPast ? "text-[#4A5DF9]" : "text-[#799EFF]"
                              }`}
                          >
                            {step.name}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`mb-8 h-[2px] flex-1 mx-4 transition-all ${isPast ? "bg-[#4A5DF9]" : "bg-[#D5E3FF]"
                            }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {!isComplete ? (
                <>
                  {currentStep === 0 && <FacultyForm initialFacultyId={facultyId} onNext={handleFacultyNext} />}
                  {currentStep === 1 && <MajorForm facultyId={facultyId!} initialMajorId={majorId} onNext={handleMajorNext} onBack={handleBack} />}
                  {currentStep === 2 && <SkillsForm initialSkillIds={skills} onNext={handleSkillsNext} onBack={handleBack} />}
                  {currentStep === 3 && <InterestsForm initialInterestIds={interests} onSubmit={handleInterestsSubmit} onBack={handleBack} isLoading={isLoading} />}
                </>
              ) : (
                <CareerMatches onStartOver={handleStartOver} matches={matchResults} />
              )}

            </div>
          </div>
        </section>
      </main>

    </div>

  );
}