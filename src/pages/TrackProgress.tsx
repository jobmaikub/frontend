import { useEffect, useState } from "react";
import { CheckCircle, BookOpen, Clock, Flame } from "lucide-react";
import StatCard from "@/components/track progress/StatCard";
import ActivityHeatmap from "@/components/track progress/ActivityHeatmap";
import OverallProgress from "@/components/track progress/OverallProgress";
import CompletedCoursesDialog from "@/components/track progress/CompletedCoursesDialog";
import {
  getUserStats,
  getCompletedCourses,
  getActivity, // ✅ เพิ่ม
} from "@/lib/track_progress.api";

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

  const [activity, setActivity] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await getUserStats();
        const coursesRes = await getCompletedCourses();
        const activityRes = await getActivity(); // ✅ ใช้ axios แทน fetch

        setStats(statsRes);
        setCourses(coursesRes);
        setActivity(activityRes);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-card border-b border-border py-12 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 text-primary text-sm font-medium mb-4">
          Track Progress
        </span>
        <h1 className="text-4xl font-bold text-card-foreground mb-2">
          Your Learning Journey
        </h1>
        <p className="text-muted-foreground">Keep up the great work!</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={CheckCircle}
            value={stats.coursesComplete}
            label="Courses Complete"
            clickable
            onClick={() => setShowCourses(true)}
          />
          <StatCard
            icon={BookOpen}
            value={stats.totalLessons}
            label="Lessons Done"
          />
          <StatCard
            icon={Clock}
            value={stats.totalHours}
            label="Total Hours"
          />
          <StatCard
            icon={Flame}
            value={`${stats.streak} days`}
            label="Current Streak"
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
    </div>
  );
};

export default TrackProgress;