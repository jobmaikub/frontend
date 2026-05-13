import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, Clock, Trash2, CheckCircle2, XCircle, TrendingUp, Minus, FileText } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { CourseDetail } from "./CourseDetail";
import { learningPathApi } from "@/lib/LearningPath.api";
import { useAuth } from "@/contexts/AuthContexts";
import IndustryNewsSidebar from "@/components/IndustryNewsDialog";
import { fetchIndustryNewsFromDatabase } from "@/lib/news.service";
import type { NewsArticle } from "@/types/careers.types";
import LearningPathSkeleton from "./LearningPathSkeleton";

interface PathDetailProps {
  path: any;
  onBack: () => void;
  onRefresh?: () => void;
}

const LevelAccordion = ({ level, isOpen, onToggle, onCourseSelect }: { level: any, isOpen: boolean, onToggle: () => void, onCourseSelect: (course: any, color: string, title: string) => void }) => {
  const safeLevelColor = level.color.includes('#22C55E') ? 'bg-[#1FAA52]' : level.color;

  return (
    <div className="relative mb-12 last:mb-0">
      <div
        className="flex items-center gap-6 cursor-pointer group"
        onClick={onToggle}
      >
        <div className={`z-10 flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full text-white shadow-md transition-transform group-hover:scale-105 ${safeLevelColor}`}>
          <BookOpen size={20} className="sm:w-6 sm:h-6" />
        </div>
        <div>
          <h3 className="text-[19px] sm:text-[22px] font-bold text-gray-900 group-hover:text-[#4A5DF9] transition-colors leading-tight">{level.title}</h3>
          <p className="text-[13px] sm:text-[14px] text-gray-500 font-medium mt-0.5">{level.courseCount} course{level.courseCount > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out pl-11 sm:pl-[5rem] mt-6 ${isOpen ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0 mt-0"}`}>
        <div className="flex flex-col gap-4 sm:gap-5">
          {level?.courses?.map((course: any) => (
            <div
              key={`course-${course.id}`}
              onClick={() => onCourseSelect(course, safeLevelColor, level.title)}
              className="flex flex-col sm:flex-row bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 gap-4 sm:gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >

              <div className="w-full sm:w-[140px] aspect-video sm:h-[100px] rounded-xl overflow-hidden shrink-0">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>

              <div className="flex flex-col justify-center flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md text-white ${safeLevelColor}`}>
                    {level.title}
                  </span>
                  {course.status === "Complete" ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#E5F7ED] text-[#1FAA52]">
                      <CheckCircle2 size={12} /> Complete
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#FFF4E5] text-[#F97316]">
                      <XCircle size={12} /> Incomplete
                    </span>
                  )}
                </div>

                <h4 className="text-[16px] font-bold text-gray-900 mb-1 group-hover:text-[#4A5DF9] transition-colors">{course.title}</h4>
                <p className="text-[14px] text-gray-500 mb-3 line-clamp-1">{course.description}</p>

                <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium mt-auto">
                  <Clock size={16} /> {course.hours} hours
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export function PathDetail({ path, onBack, onRefresh }: PathDetailProps) {
  const { user } = useAuth();
  const { careerId, courseId } = useParams();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNewsSidebarOpen, setIsNewsSidebarOpen] = useState(false);
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({});

  // Initialize expanded levels from localStorage
  React.useEffect(() => {
    if (!path?.id) return;
    const cacheKey = `lp_expanded_${path.id}`;
    const saved = localStorage.getItem(cacheKey);
    if (saved) {
      try {
        setExpandedLevels(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse expanded levels cache", e);
      }
    } else {
      // Default: First level open
      setExpandedLevels({ "Level 1: Fundamentals": true });
    }
  }, [path?.id]);

  const toggleLevel = (levelTitle: string) => {
    const newState = {
      ...expandedLevels,
      [levelTitle]: !expandedLevels[levelTitle]
    };
    setExpandedLevels(newState);
    
    // Save to cache
    if (path?.id) {
      localStorage.setItem(`lp_expanded_${path.id}`, JSON.stringify(newState));
    }
  };

  const { data: coursesResponse, isLoading: loadingCourses } = useQuery({
    queryKey: ['path-courses', path?.id, user?.id],
    queryFn: () => learningPathApi.getCourses(user!.id, path.id),
    enabled: !!path?.id && !!user,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { data: newsResponse, isLoading: loadingNews } = useQuery({
    queryKey: ['industry-news', path?.industry],
    queryFn: () => fetchIndustryNewsFromDatabase(path.industry),
    enabled: !!path?.industry,
    staleTime: 1000 * 60 * 10, // News cache 10 minutes
  });

  const dynamicLevels = React.useMemo(() => {
    if (!coursesResponse?.data?.courses) return [];
    
    const courses = coursesResponse.data.courses;
    const levelsMap: Record<string, any[]> = {
      beginner: [],
      intermediate: [],
      advanced: []
    };

    courses.forEach((c: any) => {
      const levelKey = c.course_details?.level || 'beginner';
      if (levelsMap[levelKey]) {
        levelsMap[levelKey].push({
          id: c.course_id,
          title: c.course_details?.title || 'Untitled Course',
          description: c.course_details?.description || 'No description available.',
          image: c.course_details?.image_url || "https://via.placeholder.com/150",
          status: c.complete ? "Complete" : "Incomplete",
          hours: c.course_details?.duration_mins ? Math.round(c.course_details.duration_mins / 60) : 0,
          skills: c.course_details?.skills_taught || [],
          outcomes: c.course_details?.learning_outcome || [],
        });
      }
    });

    const newLevels = [];
    let idCounter = 1;
    if (levelsMap.beginner.length > 0) {
      newLevels.push({ id: idCounter++, title: "Level 1: Fundamentals", color: "bg-[#1FAA52]", courseCount: levelsMap.beginner.length, courses: levelsMap.beginner });
    }
    if (levelsMap.intermediate.length > 0) {
      newLevels.push({ id: idCounter++, title: "Level 2: Intermediate", color: "bg-[#F97316]", courseCount: levelsMap.intermediate.length, courses: levelsMap.intermediate });
    }
    if (levelsMap.advanced.length > 0) {
      newLevels.push({ id: idCounter++, title: "Level 3: Advanced", color: "bg-[#EAB308]", courseCount: levelsMap.advanced.length, courses: levelsMap.advanced });
    }
    return newLevels;
  }, [coursesResponse]);

  const industryNews = newsResponse || [];
  const loadingLevels = loadingCourses;

  const handleDeleteConfirm = async () => {
    if (!user || !path?.id) return;
    try {
      await learningPathApi.deletePath(user.id, parseInt(path.id));
      setIsDeleteModalOpen(false);
      if (onRefresh) onRefresh();
      onBack();
    } catch (err) {
      console.error('Failed to delete path', err);
      alert('Failed to delete path. Please try again.');
    }
  };

  // Find active course if courseId is present
  const activeCourseData = React.useMemo(() => {
    if (!courseId) return null;
    for (const level of dynamicLevels) {
      const course = level.courses.find((c: any) => String(c.id) === courseId);
      if (course) return { data: course, color: level.color, title: level.title };
    }
    return null;
  }, [courseId, dynamicLevels]);

  const completedCoursesCount = React.useMemo(() => {
    let count = 0;
    dynamicLevels.forEach(level => {
      level.courses.forEach((course: any) => {
        if (course.status === "Complete") count++;
      });
    });
    return count;
  }, [dynamicLevels]);

  if (loadingLevels) {
    return <LearningPathSkeleton isDetail={true} />;
  }

  if (courseId && activeCourseData) {
    return (
      <CourseDetail
        course={activeCourseData.data}
        levelColor={activeCourseData.color}
        levelTitle={activeCourseData.title}
        onBack={() => navigate(`/learning-path/${careerId}`)}
        onLessonToggled={() => {
          if (onRefresh) onRefresh();
        }}
      />
    );
  }

  return (
    <div className="w-full font-['Inter'] animate-in fade-in duration-300">

      {/* Top Summary Section - Full-bleed white background without a card box */}
      <div className="relative w-[100vw] left-1/2 right-1/2 -mx-[50vw] bg-white border-b border-gray-100 pt-8 pb-10 -mt-4 mb-12">
        <div className="w-full max-w-6xl mx-auto px-8">

          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-[#4A5DF9] transition-colors mb-6"
          >
            <ArrowLeft size={18} /> Back to Learning Paths
          </button>

          {/* Top Summary Content layout */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-[240px] h-[190px] rounded-2xl overflow-hidden shrink-0">
              <img src={path.image} alt={path.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex-grow flex flex-col justify-center">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide ${path.growth === 'High Growth'
                    ? 'bg-growth-high-bg text-growth-high-foreground'
                    : path.growth === 'Medium Growth'
                      ? 'bg-growth-medium-bg text-growth-medium-foreground'
                      : 'bg-growth-stable-bg text-growth-stable-foreground'
                    }`}>
                    {path.growth === 'Stable Growth' ? (
                      <Minus size={14} strokeWidth={4} />
                    ) : (
                      <TrendingUp size={14} strokeWidth={3} />
                    )} {path.growth}
                  </span>
                  <span className="flex items-center bg-white border border-gray-200 text-[#4A5DF9] text-[11px] font-bold px-3 py-1.5 rounded-lg">
                    {path.industry}
                  </span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setIsNewsSidebarOpen(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold text-[#4A5DF9] hover:bg-[#D5E3FF]/20 transition-colors"
                  >
                    <FileText size={16} /> Industry News
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                  >
                    <Trash2 size={16} /> Delete
                  </button>

                </div>
              </div>


              <h1 className="text-[32px] font-bold text-gray-900 mb-2 leading-tight">{path.title}</h1>

              <div className="flex items-center gap-6 text-[15px] font-medium text-gray-600 mb-6">
                <span className="flex items-center gap-2"><BookOpen size={18} /> {path.courses} Courses</span>
                <span className="flex items-center gap-2"><Clock size={18} /> {path.hours} Hours</span>
              </div>

              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[14px] font-bold text-gray-900">Your Progress</span>
                  <span className="text-[14px] font-bold text-[#4A5DF9]">{path.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className="bg-[#4A5DF9] h-full rounded-full transition-all duration-1000" style={{ width: `${path.progress}%` }} />
                </div>
                <span className="text-[12px] text-gray-500 font-medium">{completedCoursesCount} of {path.courses} Courses Complete</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Timeline Section */}
      <div className="pb-20">
        <div className="relative pl-0 sm:pl-8">
          <div className="absolute left-[1.35rem] sm:left-[3.7rem] top-6 bottom-12 w-0.5 bg-gray-200 z-0" />

          {dynamicLevels.length > 0 ? dynamicLevels.map((level: any) => (
            <LevelAccordion
              key={level.id}
              level={level}
              isOpen={!!expandedLevels[level.title]}
              onToggle={() => toggleLevel(level.title)}
              onCourseSelect={(courseData) => navigate(`/learning-path/${careerId}/course/${courseData.id}`)}
            />
          )) : (
            <div className="text-center text-gray-500 mt-10">Loading courses...</div>
          )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 w-full sm:max-w-md shadow-xl"
            style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
          >
            <h3 className="text-[20px] font-bold text-gray-900 mb-3">Delete Learning Path</h3>
            <p className="text-[15px] text-gray-600 mb-8 leading-relaxed">
              Are you sure you want to delete this career from your learning path? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 text-[14px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 text-[14px] font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Industry News Sidebar */}
      <IndustryNewsSidebar
        open={isNewsSidebarOpen}
        onOpenChange={setIsNewsSidebarOpen}
        news={industryNews}
      />

    </div>
  );
}
