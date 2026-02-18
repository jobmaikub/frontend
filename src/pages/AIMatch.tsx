import { useState } from "react";
import { Navbar } from "@/components/navbar and footer/Navbar";
import { QuestionnaireHeader } from "@/components/ai match/QuestionnaireHeader";
import { FacultyForm } from "@/components/ai match/FacultyForm";
import { MajorForm } from "@/components/ai match/MajorForm";
import { SkillsForm } from "@/components/ai match/SkillsForm";
import { InterestsForm } from "@/components/ai match/InterestsForm"; 
import { CareerMatches } from "@/components/ai match/CareerMatches";
import { Footer } from "@/components/navbar and footer/Footer";
import { GraduationCap, BookOpen, Lightbulb, Heart } from "lucide-react";
import React from "react";

export default function AIMatch() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);
  const handleStartOver = () => setCurrentStep(0); 

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
      
      <main className="bg-[#D5E3FF]/20 flex-grow flex flex-col">
        
        <QuestionnaireHeader />

        <section className={`pb-20 flex justify-center ${isComplete ? "pt-12" : "pt-16"}`}>
          <div className="container mx-auto px-4 flex justify-center">
            
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
                            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                              isActive || isPast
                                ? "bg-[#4A5DF9] text-white" 
                                : "bg-[#D5E3FF] text-[#799EFF]" 
                            }`}
                          >
                            {step.icon}
                          </div>
                          <span 
                            className={`text-[16px] font-medium ${
                              isActive || isPast ? "text-[#4A5DF9]" : "text-[#799EFF]"
                            }`}
                          >
                            {step.name}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`mb-8 h-[2px] flex-1 mx-4 transition-all ${
                             isPast ? "bg-[#4A5DF9]" : "bg-[#D5E3FF]"
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {!isComplete ? (
                <>
                  {currentStep === 0 && <FacultyForm onNext={handleNext} />}
                  {currentStep === 1 && <MajorForm onNext={handleNext} onBack={handleBack} />}
                  {currentStep === 2 && <SkillsForm onNext={handleNext} onBack={handleBack} />}
                  {currentStep === 3 && <InterestsForm onNext={handleNext} onBack={handleBack} />}
                </>
              ) : (
                <CareerMatches onStartOver={handleStartOver} />
              )}
              
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}