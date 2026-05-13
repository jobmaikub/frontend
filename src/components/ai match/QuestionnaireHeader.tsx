import { Sparkles } from "lucide-react";

interface QuestionnaireHeaderProps {
  showText?: boolean;
  showSteps?: boolean;
}

export function QuestionnaireHeader({ showText = true }: QuestionnaireHeaderProps) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* White Background Section ONLY for the text elements */}
      {/* Increased top padding (pt-36) to add more space between the navbar and the badge */}
      {showText && (
        <div className="w-full bg-white pt-20 sm:pt-24 pb-8 sm:pb-10 flex flex-col items-center text-center px-6 sm:px-8 shadow-sm">
          {/* AI Career Match Badge */}
          <div className="mb-4 flex items-center justify-center rounded-full bg-[#D5E3FF]/50 px-4 py-1.5">
            <span className="text-[14px] font-medium text-[#4A5DF9]">
              AI Career Match
            </span>
          </div>

          {/* Find Your Perfect Career */}
          <h1 className="mb-3 text-[24px] sm:text-[32px] font-bold leading-tight text-[#000000]">
            Find Your Perfect Career
          </h1>

          {/* Subtext */}
          <p className="text-[14px] sm:text-[16px] font-normal text-[#505050] max-w-md sm:max-w-none">
            Answer a few questions and let our AI recommend careers tailored to your profile.
          </p>
        </div>

      )}
    </div>
  );
}