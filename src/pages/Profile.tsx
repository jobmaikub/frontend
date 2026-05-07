import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Flame, TrendingUp, Loader2 } from "lucide-react";
import ProfileCard from "@/components/profile/ProfileCard";
import StatsCard from "@/components/profile/StatsCard";
import SkillsMastered from "@/components/profile/SkillsMastered";
import MyReviews, { Review } from "@/components/profile/MyReviews";
import { useAuth } from "@/contexts/AuthContexts";
import { updateReview, deleteReview } from "@/lib/reviews.api";
import { updateProfile, fetchUserDashboard } from "@/lib/users.api";
import { EnrichedSkill } from "@/lib/track_progress.api";
import { Navbar } from "@/components/navbar and footer/Navbar";
import Toast, { ToastType } from "@/components/Toast";

import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

const Profile = () => {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleNameChange = async (newName: string) => {
    if (!user) return;
    try {
      await updateProfile(user.id, { full_name: newName });
      setUserName(newName);
      await refreshProfile();
      setToast({ message: "Name updated successfully", type: 'success' });
    } catch (error) {
      setToast({ message: "Failed to update name", type: 'error' });
    }
  };

  const handleAvatarChange = async (newUrl: string) => {
    if (!user) return;
    try {
      await updateProfile(user.id, { avatar_url: newUrl });
      setAvatarUrl(newUrl);
      await refreshProfile();
      setToast({ message: "Profile picture updated successfully", type: 'success' });
    } catch (error) {
      setToast({ message: "Failed to update profile picture", type: 'error' });
    }
  };

  // Fetch Dashboard Data (Parallel Backend Call)
  const { data: dashboardData, isLoading: loadingDashboard } = useQuery({
    queryKey: ['user-dashboard', user?.id],
    queryFn: () => fetchUserDashboard(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  const reviews = dashboardData?.reviews || [];
  const enrichedSkills = dashboardData?.skills || [];
  const dashboardProfile = dashboardData?.profile;

  useEffect(() => {
    if (profile || dashboardProfile) {
      const p = profile || dashboardProfile;
      setUserName(p.full_name || p.username || "Guest");
      setAvatarUrl(p.avatar_url || "");
    }
  }, [profile, dashboardProfile]);

  // Force refetch on pageshow (BFCache)
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [queryClient]);

  if (authLoading || (user && loadingDashboard && !dashboardData)) {
    return <ProfileSkeleton />;
  }

  const joinedDate = (profile?.joined_at || dashboardProfile?.joined_at)
    ? new Date(profile?.joined_at || dashboardProfile?.joined_at).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
    : "N/A";

  const dayStreak = profile?.current_streak || dashboardProfile?.current_streak || 0;

  const handleEditReview = async (id: string, text: string, rating: number) => {
    try {
      await updateReview(Number(id), { comment: text, rating });
      queryClient.invalidateQueries({ queryKey: ['user-dashboard', user?.id] });
      setToast({ message: "Review updated successfully", type: 'success' });
    } catch (error) {
      setToast({ message: "Failed to update review", type: 'error' });
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview(Number(id));
      queryClient.invalidateQueries({ queryKey: ['user-dashboard', user?.id] });
      setToast({ message: "Review deleted successfully", type: 'success' });
    } catch (error) {
      setToast({ message: "Failed to delete review", type: 'error' });
    }
  };

  return (
    <div className="profile-theme">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="min-h-screen bg-background pt-16">
        <Navbar />
        {/* Header band */}
        <div className="h-40 bg-primary" />

        <div className="mx-auto -mt-20 max-w-5xl px-8 pb-24">
          <div className="grid gap-6 md:grid-cols-[280px_1fr]">
            {/* Left column */}
            <div>
              <ProfileCard
                name={userName}
                email={user?.email || "No email"}
                joinedDate={joinedDate}
                avatarUrl={avatarUrl}
                onAvatarChange={handleAvatarChange}
                onNameChange={handleNameChange}
              />
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard
                  icon={BookOpen}
                  value={profile?.courses_completed || 0}
                  label="Courses Completed"
                  colorClass="bg-brand-light text-primary"
                />
                <StatsCard
                  icon={Flame}
                  value={dayStreak}
                  label="Day Streak"
                  colorClass="bg-warning-light text-warning"
                />
                <StatsCard
                  icon={TrendingUp}
                  value={`${profile?.total_learning_hours || 0}h`}
                  label="Learning Hours"
                  colorClass="bg-success-light text-success"
                />
              </div>

              {/* Skills */}
              <SkillsMastered
                skills={enrichedSkills}
                isLoading={loadingDashboard}
              />

              {/* Reviews */}
              <MyReviews
                reviews={reviews.map((r: any) => ({
                  id: String(r.id),
                  rating: r.rating,
                  author: userName || r.author,
                  text: r.comment || "",
                  career: r.careerTitle || `Career #${r.careerId}`,
                  careerPath: `/careers/${r.careerId}#review-${r.id}`,
                  date: r.date,
                  parentReviewId: r.parentReviewId
                }))}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
