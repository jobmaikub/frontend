import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Flame, TrendingUp, Loader2 } from "lucide-react";
import ProfileCard from "@/components/profile/ProfileCard";
import StatsCard from "@/components/profile/StatsCard";
import SkillsMastered from "@/components/profile/SkillsMastered";
import MyReviews, { Review } from "@/components/profile/MyReviews";
import { useAuth } from "@/contexts/AuthContexts";
import { reviewsApi, getAllReviews, updateReview, deleteReview } from "@/lib/reviews.api";
import { fetchCareers, Career } from "@/lib/careers.api";
import { updateProfile } from "@/lib/users.api";
import { getEnrichedSkills, EnrichedSkill } from "@/lib/track_progress.api";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar and footer/Navbar";

import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

const Profile = () => {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userName, setUserName] = useState("");

  const handleNameChange = async (newName: string) => {
    if (!user) return;
    try {
      await updateProfile(user.id, { full_name: newName });
      setUserName(newName);
      await refreshProfile();
      toast.success("Name updated successfully");
    } catch (error) {
      toast.error("Failed to update name");
    }
  };

  const handleAvatarChange = async (newUrl: string) => {
    if (!user) return;
    try {
      await updateProfile(user.id, { avatar_url: newUrl });
      setAvatarUrl(newUrl);
      await refreshProfile();
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error("Failed to update profile picture");
    }
  };

  // Fetch Skills using React Query
  const { data: enrichedSkills = [], isLoading: loadingSkills } = useQuery({
    queryKey: ['user-skills', user?.id],
    queryFn: getEnrichedSkills,
    enabled: !!user,
  });

  // Fetch Reviews using React Query
  const { data: reviews = [], isLoading: loadingReviews } = useQuery({
    queryKey: ['user-reviews', user?.id],
    queryFn: async () => {
      if (!user) return [];
      try {
        const res = await reviewsApi.get("/", { params: { user_id: user.id } });
        
        // Handle nested data structures correctly
        const rawData = res.data;
        const userReviews = Array.isArray(rawData) 
          ? rawData 
          : (rawData?.data && Array.isArray(rawData.data) ? rawData.data : []);
        
        return userReviews.map((r: any) => {
          // Robust mapping for both snake_case and camelCase
          const reviewId = r.review_id || r.id;
          const careerId = r.career_id || r.careerId;
          const careerTitle = r.career_title || r.careerTitle || `Career #${careerId}`;
          const commentText = r.comment || r.text || r.commentText || "";
          const reviewDate = r.date || (r.created_at ? new Date(r.created_at).toLocaleDateString('th-TH') : "");

          return {
            id: String(reviewId),
            userId: r.user_id || r.userId,
            rating: r.rating || 0,
            author: r.author || userName,
            text: commentText,
            date: reviewDate,
            parentReviewId: r.parent_review_id || r.parentReviewId,
            career: careerTitle,
            careerPath: `/careers/${careerId}#review-${reviewId}`
          };
        });
      } catch (err) {
        console.error("Error fetching reviews:", err);
        return [];
      }
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setUserName(profile.full_name || profile.username || "Guest");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  if (authLoading || (user && loadingReviews && reviews.length === 0)) {
    return <ProfileSkeleton />;
  }

  const joinedDate = profile?.joined_at
    ? new Date(profile.joined_at).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
    : "N/A";

  const dayStreak = profile?.current_streak || 0;

  const handleEditReview = async (id: string, text: string, rating: number) => {
    try {
      await updateReview(Number(id), { comment: text, rating });
      queryClient.invalidateQueries({ queryKey: ['user-reviews', user?.id] });
      toast.success("Review updated successfully");
    } catch (error) {
      toast.error("Failed to update review");
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview(Number(id));
      queryClient.invalidateQueries({ queryKey: ['user-reviews', user?.id] });
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="profile-theme">
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
                isLoading={loadingSkills}
              />

              {/* Reviews */}
              <MyReviews
                reviews={reviews.map(r => ({ ...r, author: userName }))}
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
