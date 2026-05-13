import React, { useState } from "react";
import { Search, Lightbulb, ArrowLeft, ArrowRight, X } from "lucide-react";
import { getSkills } from "@/lib/ai.api";


interface SkillsFormProps {
  initialSkillIds: number[];
  onNext: (skillIds: number[]) => void;
  onBack: () => void;
}

export function SkillsForm({ initialSkillIds, onNext, onBack }: SkillsFormProps) {
  const MAX_SKILLS = 12;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>(initialSkillIds || []);
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
      } catch (err) {
        console.error("Error loading skills:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSkills();
  }, []);

  const filteredSkills = skills.filter((skill) => {
    const name = skill.name || skill.name_th || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleSkill = (skillId: number) => {
    if (selectedSkillIds.includes(skillId)) {
      setSelectedSkillIds(selectedSkillIds.filter((id) => id !== skillId));
    } else if (selectedSkillIds.length < MAX_SKILLS) {
      setSelectedSkillIds([...selectedSkillIds, skillId]);
    } else {
      return;
    }
  };

  const removeSkill = (skillId: number) => {
      setSelectedSkillIds(selectedSkillIds.filter((id) => id !== skillId));
  }

  return (
    <>
      {/* Form Card */}
      <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 sm:p-10 shadow-sm">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#D5E3FF] text-[#4A5DF9]">
            <Lightbulb size={32} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Select Your Skills</h2>
            <p className="text-sm text-gray-500 mt-1">Search and select all skills you possess or want to develop. (Max 12)</p>
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
        <div className="flex flex-wrap gap-3 max-h-[220px] overflow-y-auto p-1 pr-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#F0F4FF] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#A3C0FF] [&::-webkit-scrollbar-thumb]:rounded-full">
          {isLoading ? (
            <div className="w-full text-center text-gray-500 py-4">Loading skills...</div>
          ) : filteredSkills.length > 0 ? (
            filteredSkills.map((skill) => (
              <button 
                key={skill.skill_id} 
                onClick={() => toggleSkill(skill.skill_id)}
                disabled={selectedSkillIds.length >= MAX_SKILLS && !selectedSkillIds.includes(skill.skill_id)}
                className={`rounded-full border px-5 py-2.5 text-[16px] font-medium transition-all duration-200 hover:scale-[1.05] active:scale-[0.95] ${
                  selectedSkillIds.includes(skill.skill_id)
                    ? "border-[#4A5DF9] bg-[#F0F4FF] text-[#4A5DF9] shadow-sm ring-1 ring-[#4A5DF9]/30"
                    : selectedSkillIds.length >= MAX_SKILLS
                      ? "border-gray-100 text-gray-400 bg-gray-50 cursor-not-allowed"
                      : "border-gray-200 text-gray-700 bg-white shadow-sm hover:border-[#4A5DF9] hover:bg-[#F0F4FF] hover:text-[#4A5DF9]"
                }`}
              >
                {skill.name || skill.name_th}
              </button>
            ))
          ) : (
            <div className="w-full text-center text-gray-500 py-4">
              No skills found matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Selected Counter */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-[14px] font-medium text-gray-500">
          <span>Selected: {selectedSkillIds.length}/{MAX_SKILLS} Skills</span>
          {skills.filter(s => selectedSkillIds.includes(s.skill_id)).map((skill) => (
             <div key={skill.skill_id} className="flex items-center gap-1 rounded-full bg-[#F0F4FF] px-3 py-1 text-[#4A5DF9]">
                <span>{skill.name || skill.name_th}</span>
                <button onClick={() => removeSkill(skill.skill_id)} className="hover:text-[#3b4cc4] focus:outline-none">
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
          onClick={() => selectedSkillIds.length > 0 && onNext(selectedSkillIds)}
          disabled={selectedSkillIds.length === 0}
          className={`group flex items-center gap-2 rounded-xl px-8 py-3 text-[16px] font-medium text-white transition-all duration-300 shadow-sm ${
            selectedSkillIds.length > 0 
              ? "bg-[#4A5DF9] hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-200 active:scale-95" 
              : "bg-gray-300 cursor-not-allowed opacity-70"
          }`}
        >
          Continue
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </>
  );
}