import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Clock, List, CheckSquare, Square, ExternalLink, CheckCircle2, XCircle, BookOpen, Check, X } from "lucide-react";

interface CourseDetailProps {
  course: any;
  levelColor: string;
  levelTitle: string;
  onBack: () => void;
  onLessonToggled?: () => void;
}

import { learningPathApi } from "@/lib/LearningPath.api";
import { useAuth } from "@/contexts/AuthContexts";

export function CourseDetail({ course, levelColor, levelTitle, onBack, onLessonToggled }: CourseDetailProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const safeLevelColor = levelColor.includes('#22C55E') ? 'bg-[#1FAA52]' : levelColor;

  const [lessons, setLessons] = useState<any[]>([]);
  const [checkedLessons, setCheckedLessons] = useState<Record<string, boolean>>({});
  const [previousCheckedState, setPreviousCheckedState] = useState<Record<string, boolean> | null>(null);

  const { data: lessonsResponse, isLoading: loadingLessons } = useQuery({
    queryKey: ['course-lessons', course.id, user?.id],
    queryFn: () => learningPathApi.getLessons(user!.id, course.id),
    enabled: !!course?.id && !!user,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (lessonsResponse?.data?.lessons) {
      const fetchedLessons = lessonsResponse.data.lessons.map((l: any) => ({
        id: l.lesson_id,
        title: l.lesson_details?.title,
        duration: `${l.lesson_details?.duration_mins} mins`,
        completed: l.done,
        url: l.lesson_details?.external_url || '#',
      }));
      setLessons(fetchedLessons);

      const initialCheckedState: Record<string, boolean> = {};
      fetchedLessons.forEach((lesson: any) => {
        initialCheckedState[lesson.id] = lesson.completed;
      });
      setCheckedLessons(initialCheckedState);
    }
  }, [lessonsResponse]);

  const allLessonsExist = lessons && lessons.length > 0;
  const isCourseFinished = allLessonsExist &&
    lessons.every((lesson: any) => checkedLessons[lesson.id]);

  const toggleLesson = async (lessonId: string) => {
    // Optimistic update
    const previousState = checkedLessons[lessonId];
    const targetState = !previousState;
    setCheckedLessons(prev => ({
      ...prev,
      [lessonId]: targetState
    }));

    try {
      if (!user) return;
      const userId = user.id;
      await learningPathApi.completeLesson(userId, parseInt(lessonId), targetState);
      
      // Invalidate Track Progress queries so they fetch fresh data
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['user-activity'] });
      queryClient.invalidateQueries({ queryKey: ['user-completed-courses'] });
      queryClient.invalidateQueries({ queryKey: ['user-skills'] });
      queryClient.invalidateQueries({ queryKey: ['course-lessons'] });
      queryClient.invalidateQueries({ queryKey: ['path-courses'] });

      if (onLessonToggled) onLessonToggled();
    } catch (err) {
      console.error(err);
      // Revert on error
      setCheckedLessons(prev => ({
        ...prev,
        [lessonId]: previousState
      }));
    }
  };

  const toggleCourseStatus = async () => {
    if (!user || !allLessonsExist) return;
    const userId = user.id;
    const targetState = !isCourseFinished;

    if (targetState) {
      // MARKING AS FINISHED
      // Save current state before marking as finished so we can revert
      setPreviousCheckedState({ ...checkedLessons });

      // Optimistic update for all lessons in UI
      const newCheckedState: Record<string, boolean> = {};
      lessons.forEach(l => {
        newCheckedState[l.id] = true;
      });
      setCheckedLessons(newCheckedState);

      try {
        await learningPathApi.completeCourse(userId, course.id, true);
        
        // Invalidate Track Progress queries
        queryClient.invalidateQueries({ queryKey: ['user-stats'] });
        queryClient.invalidateQueries({ queryKey: ['user-activity'] });
        queryClient.invalidateQueries({ queryKey: ['user-completed-courses'] });
        queryClient.invalidateQueries({ queryKey: ['user-skills'] });
        queryClient.invalidateQueries({ queryKey: ['course-lessons'] });
        queryClient.invalidateQueries({ queryKey: ['path-courses'] });

        if (onLessonToggled) onLessonToggled();
      } catch (err) {
        console.error(err);
        alert("Failed to update course status. Please try again.");
      }
    } else {
      // MARKING AS UNFINISHED (Undo/Revert)
      if (previousCheckedState) {
        // We have a previous state to revert to!
        setCheckedLessons(previousCheckedState);
        const updates = Object.entries(previousCheckedState).map(([id, done]) => ({
          lesson_id: parseInt(id),
          done
        }));

        try {
          await learningPathApi.bulkUpdateLessons(userId, updates);
          
          // Invalidate Track Progress queries
          queryClient.invalidateQueries({ queryKey: ['user-stats'] });
          queryClient.invalidateQueries({ queryKey: ['user-activity'] });
          queryClient.invalidateQueries({ queryKey: ['user-completed-courses'] });
          queryClient.invalidateQueries({ queryKey: ['user-skills'] });
          queryClient.invalidateQueries({ queryKey: ['course-lessons'] });
          queryClient.invalidateQueries({ queryKey: ['path-courses'] });

          setPreviousCheckedState(null); // Clear after revert
          if (onLessonToggled) onLessonToggled();
        } catch (err) {
          console.error(err);
          alert("Failed to revert course status.");
        }
      } else {
        // No previous state (e.g. page refreshed), just reset everything to false
        const newCheckedState: Record<string, boolean> = {};
        lessons.forEach(l => {
          newCheckedState[l.id] = false;
        });
        setCheckedLessons(newCheckedState);

        try {
          await learningPathApi.completeCourse(userId, course.id, false);
          
          // Invalidate Track Progress queries
          queryClient.invalidateQueries({ queryKey: ['user-stats'] });
          queryClient.invalidateQueries({ queryKey: ['user-activity'] });
          queryClient.invalidateQueries({ queryKey: ['user-completed-courses'] });
          queryClient.invalidateQueries({ queryKey: ['user-skills'] });
          queryClient.invalidateQueries({ queryKey: ['course-lessons'] });
          queryClient.invalidateQueries({ queryKey: ['path-courses'] });

          if (onLessonToggled) onLessonToggled();
        } catch (err) {
          console.error(err);
          alert("Failed to reset course status.");
        }
      }
    }
  };

  const currentCompletedCount = Object.values(checkedLessons).filter(Boolean).length;
  const totalLessonsCount = lessons ? lessons.length : 0;
  const dynamicProgress = totalLessonsCount === 0 ? 0 : Math.round((currentCompletedCount / totalLessonsCount) * 100);

  return (
    <div className="w-full font-['Inter'] animate-in fade-in duration-300">

      {/* Top Banner - Full bleed trick breaking out of the container bounds */}
      <div className="relative w-[100vw] left-1/2 right-1/2 -mx-[50vw] h-[320px] bg-[#4A5DF9] -mt-4">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover mix-blend-multiply opacity-40"
        />
        {/* Removed the absolute positioned Back Button from here! */}
      </div>

      {/* Main Content Area */}
      {/* Increased negative margin (-mt-48) to pull the whole block up over the banner */}
      <div className="relative z-10 -mt-32 sm:-mt-48 pb-20">

        {/* Back Button - Now positioned directly above the cards so it stays close! */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[14px] font-medium text-white hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft size={18} /> Back to Roadmap
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column (Course Info & Lessons) */}
          <div className="flex-1 flex flex-col gap-6 sm:gap-8">

            {/* Main Course Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-[11px] sm:text-[12px] font-bold px-3 py-1.5 rounded-md text-white ${safeLevelColor}`}>
                  {levelTitle}
                </span>
                {isCourseFinished ? (
                  <span className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-md bg-[#E5F7ED] text-[#1FAA52]">
                    <CheckCircle2 size={14} /> Complete
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-md bg-[#FFF4E5] text-[#F97316]">
                    <XCircle size={14} /> Incomplete
                  </span>
                )}
              </div>

              <h1 className="text-[24px] sm:text-[32px] font-bold text-gray-900 mb-4 leading-tight">
                {course.title}
              </h1>

              <p className="text-[15px] sm:text-[16px] text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-[14px] sm:text-[15px] font-medium text-gray-600 mb-6 sm:mb-8">
                <span className="flex items-center gap-2"><Clock size={16} className="sm:w-[18px] sm:h-[18px]" /> {course.hours} hours</span>
                <span className="flex items-center gap-2"><List size={16} className="sm:w-[18px] sm:h-[18px]" /> {totalLessonsCount} Lessons</span>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[14px] font-bold text-gray-900">Your Progress</span>
                  <span className="text-[14px] font-bold text-[#4A5DF9]">{dynamicProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
                  <div className="bg-[#4A5DF9] h-full rounded-full transition-all duration-500" style={{ width: `${dynamicProgress}%` }} />
                </div>
                <span className="text-[13px] text-gray-500 font-medium">
                  {currentCompletedCount} of {totalLessonsCount} Lessons Complete
                </span>
              </div>

              {/* Toggle Finished Status Button */}
              {isCourseFinished ? (
                <button
                  onClick={toggleCourseStatus}
                  className="w-full py-3.5 sm:py-4 rounded-xl flex justify-center items-center gap-2 text-[15px] sm:text-[16px] font-semibold text-white bg-[#D97706] hover:bg-[#B45309] transition-colors"
                >
                  <X size={18} className="sm:w-5 sm:h-5" /> Mark as Unfinished
                </button>
              ) : (
                <button
                  onClick={toggleCourseStatus}
                  disabled={!allLessonsExist}
                  className={`w-full py-3.5 sm:py-4 rounded-xl flex justify-center items-center gap-2 text-[15px] sm:text-[16px] font-semibold text-white transition-colors ${allLessonsExist ? 'bg-[#1FAA52] hover:bg-[#188e43]' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                  <Check size={18} className="sm:w-5 sm:h-5" /> Mark as Finished
                </button>
              )}
            </div>

            {/* Course Lessons List Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
              <h3 className="flex items-center gap-3 text-[18px] sm:text-[20px] font-bold text-gray-900 mb-4">
                <List size={20} className="text-[#4A5DF9] sm:w-[22px] sm:h-[22px]" /> Course Lessons
              </h3>

              {allLessonsExist ? (
                <div className="flex flex-col gap-2">
                  {lessons.map((lesson: any) => (
                    <div
                      key={lesson.id}
                      onClick={() => toggleLesson(lesson.id)}
                      className={`flex items-center justify-between p-2.5 sm:p-3.5 border rounded-xl transition-all gap-3 cursor-pointer group ${checkedLessons[lesson.id]
                        ? "border-[#1FAA52]/30 bg-[#E5F7ED]/30"
                        : "border-gray-100 hover:border-[#4A5DF9] hover:bg-[#F0F4FF]"
                        }`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="mt-0.5 shrink-0">
                          {checkedLessons[lesson.id] ? (
                            <CheckSquare size={18} color="#1FAA52" className="sm:w-[20px] sm:h-[20px]" />
                          ) : (
                            <Square size={18} className="text-gray-300 group-hover:text-[#4A5DF9] sm:w-[20px] sm:h-[20px]" />
                          )}
                        </div>
                        <div>
                          <h4 className={`text-[14px] sm:text-[15px] font-semibold transition-colors ${checkedLessons[lesson.id] ? "text-[#1FAA52]" : "text-gray-900 group-hover:text-[#4A5DF9]"}`}>
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-gray-500 mt-0.5">
                            <Clock size={12} className="sm:w-[14px] sm:h-[14px]" /> {lesson.duration}
                          </div>
                        </div>
                      </div>

                      <a
                        href={lesson.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[14px] font-medium text-gray-400 hover:text-[#4A5DF9] transition-colors sm:ml-4 self-end sm:self-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <BookOpen size={48} className="text-gray-300 mb-4" />
                  <h4 className="text-[18px] font-medium text-gray-900 mb-2">No lessons available yet</h4>
                  <p className="text-[14px] text-gray-500">Visit the external course for content</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Skills & Outcomes Sidebar) */}
          <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6 sm:gap-8">

            {/* Skills You'll Learn */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h3 className="text-[17px] sm:text-[18px] font-bold text-gray-900 mb-5 sm:mb-6">Skills You'll Learn</h3>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill: string, idx: number) => (
                  <span key={`skill-${skill}-${idx}`} className="bg-[#F0F4FF] text-[#4A5DF9] text-[12px] sm:text-[13px] font-semibold px-3.5 py-1.5 rounded-lg border border-[#D5E3FF]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h3 className="text-[17px] sm:text-[18px] font-bold text-gray-900 mb-4">Learning Outcomes</h3>
              <p className="text-[13px] sm:text-[14px] text-gray-600 mb-5 sm:mb-6">
                After completing this course, you will be able to:
              </p>
              <ul className="flex flex-col gap-3.5 text-[13px] sm:text-[14px] text-gray-700 leading-relaxed font-medium">
                {course.outcomes.map((outcome: string, idx: number) => (
                  <li key={`outcome-${idx}`} className="flex items-start gap-3">
                    <CheckCircle2 size={16} color="#1FAA52" className="shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px]" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}