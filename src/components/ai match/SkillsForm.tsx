import React, { useState } from "react";
import { Search, Lightbulb, ArrowLeft, ArrowRight, X } from "lucide-react";

const skillsList = [
  "Python", "JavaScript", "HTML/CSS", "React", "Node.js", 
  "SQL", "MongoDB", "Firebase", "Software Architecture", "NumPy", 
  "Unit Testing", "Operating Systems", "Linux", "Machine Learning", 
  "TensorFlow", "Docker", "AWS", "Cybersecurity", "Communication", 
  "Problem Solving", "Data Analysis", "Teamwork", "Agile", "Scrum",
  "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go", "Rust",
  "TypeScript", "Angular", "Vue.js", "Express.js", "Django", "Flask",
  "Spring Boot", "ASP.NET", "GraphQL", "REST API", "Git", "GitHub",
  "GitLab", "CI/CD", "Jenkins", "Kubernetes", "Azure", "Google Cloud",
  "Big Data", "Hadoop", "Spark", "Blockchain", "IoT", "Artificial Intelligence",
  "Deep Learning", "Natural Language Processing", "Computer Vision",
  "Robotics", "Virtual Reality", "Augmented Reality", "Game Development",
  "Unity", "Unreal Engine", "Mobile App Development", "Web Development",
  "DevOps", "Database Management", "Network Security", "Ethical Hacking",
  "Cloud Computing", "UI/UX Design" 
];

interface SkillsFormProps {
  onNext: () => void;
  onBack: () => void;
}

export function SkillsForm({ onNext, onBack }: SkillsFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const filteredSkills = skillsList.filter((skill) =>
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  }

  return (
    <>
      {/* Form Card */}
      <div className="w-full rounded-2xl border border-gray-100 bg-white p-10 shadow-sm">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D5E3FF] text-[#4A5DF9]">
            <Lightbulb size={32} />
          </div>
          <div>
            <h2 className="text-[22px] font-semibold text-gray-900">Select Your Skills</h2>
            <p className="text-[18px] text-gray-500 mt-1">Search and select all skills you possess or want to develop.</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search skills..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 text-[16px] focus:border-[#4A5DF9] focus:outline-none"
          />
        </div>

        {/* Skills Flex Wrap with Custom Scrollbar */}
        <div className="flex flex-wrap gap-3 max-h-[220px] overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#F0F4FF] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#A3C0FF] [&::-webkit-scrollbar-thumb]:rounded-full">
          {filteredSkills.map((skill) => (
            <button 
              key={skill} 
              onClick={() => toggleSkill(skill)}
              className={`rounded-full border px-5 py-2.5 text-[16px] font-medium transition-all hover:border-[#4A5DF9] hover:bg-[#F0F4FF] hover:text-[#4A5DF9] ${
                selectedSkills.includes(skill)
                  ? "border-[#4A5DF9] bg-[#F0F4FF] text-[#4A5DF9]"
                  : "border-gray-200 text-gray-700 bg-white"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Selected Counter */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-[14px] font-medium text-gray-500">
          <span>Selected: {selectedSkills.length} Skills</span>
          {selectedSkills.map((skill) => (
             // Updated colors to blue
             <div key={skill} className="flex items-center gap-1 rounded-full bg-[#F0F4FF] px-3 py-1 text-[#4A5DF9]">
                <span>{skill}</span>
                {/* Updated hover color for the X button */}
                <button onClick={() => removeSkill(skill)} className="hover:text-[#3b4cc4] focus:outline-none">
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
          className="flex items-center gap-2 rounded-xl bg-[#4A5DF9] px-8 py-3 text-[16px] font-medium text-white transition-opacity hover:opacity-90 shadow-sm"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}