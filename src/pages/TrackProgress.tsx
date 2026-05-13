import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, BookOpen, Clock, Flame } from "lucide-react";
import StatCard from "@/components/track progress/StatCard";
import ActivityHeatmap from "@/components/track progress/ActivityHeatmap";
import OverallProgress from "@/components/track progress/OverallProgress";
import CompletedCoursesDialog from "@/components/track progress/CompletedCoursesDialog";
import { Navbar } from "@/components/navbar and footer/Navbar";
import {
  getUserStats,
  getActivity,
  getCompletedCourses, // ✅ เพิ่ม
} from "@/lib/track_progress.api";



type ActivityItem = {
  date: string;
  count: number;
  lessons: number;
  courses: number;
};

type CompletedCourse = {
  id: number;
  title: string;
  description?: string;
  progress?: number;
  complete?: boolean;
};

import TrackProgressSkeleton from "@/components/track progress/TrackProgressSkeleton";

const TrackProgress = () => {
  const [showCourses, setShowCourses] = useState(false);

  // Fetch Stats using React Query
  const { data: stats = {
    coursesComplete: 0,
    totalLessons: 0,
    totalHours: 0,
    streak: 0,
    overallProgress: 0,
  }, isLoading: loadingStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: getUserStats,
  });

  // Fetch Activity using React Query
  const { data: activity = [], isLoading: loadingActivity } = useQuery({
    queryKey: ['user-activity'],
    queryFn: getActivity,
  });

  // Fetch Completed Courses using React Query
  const { data: courses = [], isLoading: loadingCourses } = useQuery({
    queryKey: ['user-completed-courses'],
    queryFn: getCompletedCourses,
  });

  const loading = loadingStats || loadingActivity || loadingCourses;

  if (loading) {
    return <TrackProgressSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F4F7FF]">

      <Navbar />
      {/* Hero */}
      <div className="w-full bg-white pt-24 pb-10 flex flex-col items-center text-center px-8 shadow-sm z-10 relative">
        <div className="mb-4 flex items-center justify-center rounded-full bg-[#D5E3FF]/50 px-4 py-1.5">
          <span className="text-[14px] font-medium text-[#4A5DF9]">Track Progress</span>
        </div>
        <h1 className="mb-3 text-[32px] font-bold leading-tight text-[#000000]">
          Your Learning Journey
        </h1>
        <p className="text-[16px] text-gray-500">
          Keep up the great work!
        </p>
      </div>


      <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-12 pb-24 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={CheckCircle}
            value={stats.coursesComplete}
            label="Courses Completed"
            colorScheme="purple"
          />
          <StatCard
            icon={BookOpen}
            value={stats.totalLessons}
            label="Lessons Done"
            colorScheme="blue"
          />
          <StatCard
            icon={Clock}
            value={stats.totalHours}
            label="Learning Hours"
            colorScheme="green"
          />
          <StatCard
            icon={Flame}
            value={`${stats.streak} days`}
            label="Day Streak"
            colorScheme="orange"
            highlighted
          />
        </div>

        {/* Activity + Overall */}
        <div className="flex flex-col lg:flex-row gap-4">
          <ActivityHeatmap data={activity} />
          <OverallProgress
            progress={stats.overallProgress}
            completedCourses={stats.coursesComplete}
            clickable
            onClick={() => setShowCourses(true)}
          />
        </div>
      </div>

      <CompletedCoursesDialog
        open={showCourses}
        onOpenChange={setShowCourses}
        courses={courses}
      />

    </div>

  );
};

export default TrackProgress;