import { useEffect, useState } from "react";
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
import { Footer } from "@/components/navbar and footer/Footer";


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

const TrackProgress = () => {
  const [showCourses, setShowCourses] = useState(false);

  const [stats, setStats] = useState({
    coursesComplete: 0,
    totalLessons: 0,
    totalHours: 0,
    streak: 0,
    overallProgress: 0,
    perYear: {},
  });

  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [courses, setCourses] = useState<CompletedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, coursesRes, activityRes] = await Promise.allSettled([
          getUserStats(),
          getCompletedCourses(),
          getActivity(),
        ]);

        if (statsRes.status === "fulfilled" && statsRes.value) {
          setStats((prev) => ({ ...prev, ...statsRes.value }));
        } else {
          console.error("Failed to load stats:", statsRes.status === "rejected" ? statsRes.reason : "Unknown error");
        }

        if (coursesRes.status === "fulfilled" && Array.isArray(coursesRes.value)) {
          setCourses(coursesRes.value);
        } else {
          console.error("Failed to load completed courses:", coursesRes.status === "rejected" ? coursesRes.reason : "Unknown error");
        }

        if (activityRes.status === "fulfilled" && Array.isArray(activityRes.value)) {
          setActivity(activityRes.value);
        } else {
          console.error("Failed to load activity:", activityRes.status === "rejected" ? activityRes.reason : "Unknown error");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <Navbar />
        <div className="bg-card border-b border-border py-12 text-center">
          <div className="h-6 w-32 bg-muted rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-10 w-64 bg-muted rounded-lg mx-auto mb-2 animate-pulse" />
          <div className="h-4 w-40 bg-muted rounded mx-auto animate-pulse" />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border bg-card p-6 h-32 animate-pulse bg-muted/30" />
            ))}
          </div>
          <div className="rounded-xl border bg-card p-6 h-52 animate-pulse bg-muted/30" />
        </div>
      </div>
    );
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


      <div className="max-w-6xl mx-auto px-8 pt-12 pb-24 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={CheckCircle}
            value={stats.coursesComplete}
            label="Courses Completed"
            clickable
            onClick={() => setShowCourses(true)}
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
          />
        </div>
      </div>

      <CompletedCoursesDialog
        open={showCourses}
        onOpenChange={setShowCourses}
        courses={courses}
      />
      <Footer />
    </div>

  );
};

export default TrackProgress;