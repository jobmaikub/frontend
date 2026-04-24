import { useState, useEffect } from "react";
import { BookOpen, Flame, TrendingUp, Loader2 } from "lucide-react";
import ProfileCard from "@/components/profile/ProfileCard";
import StatsCard from "@/components/profile/StatsCard";
import SkillsMastered from "@/components/profile/SkillsMastered";
import MyReviews, { Review } from "@/components/profile/MyReviews";
import { useAuth } from "@/contexts/AuthContexts";
import { getAllReviews, updateReview, deleteReview } from "@/lib/reviews.api";
import { fetchCareers, Career } from "@/lib/careers.api";
import { updateProfile } from "@/lib/users.api";
import { toast } from "sonner";

const Profile = () => {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    if (profile) {
      setUserName(profile.full_name || profile.username || "Guest");
      setAvatarUrl(profile.avatar_url || "");
      loadUserReviews();
    }
  }, [profile]);

  const handleNameChange = async (newName: string) => {
    if (!user) return;
    try {
      await updateProfile(user.id, { full_name: newName });
      setUserName(newName);
      await refreshProfile();
      toast.success("อัปเดตชื่อเรียบร้อยแล้ว");
    } catch (error) {
      toast.error("ไม่สามารถอัปเดตชื่อได้");
    }
  };

  const handleAvatarChange = async (newUrl: string) => {
    if (!user) return;
    try {
      await updateProfile(user.id, { avatar_url: newUrl });
      setAvatarUrl(newUrl);
      await refreshProfile();
      toast.success("อัปเดตรูปโปรไฟล์เรียบร้อยแล้ว");
    } catch (error) {
      toast.error("ไม่สามารถอัปเดตรูปโปรไฟล์ได้");
    }
  };

  const loadUserReviews = async () => {
    if (!user) return;
    try {
      setLoadingReviews(true);
      const [allReviews, allCareers] = await Promise.all([
        getAllReviews(),
        fetchCareers()
      ]);

      const careerMap = new Map((allCareers as Career[]).map(c => [c.career_id, c.title]));

      const userReviews = allReviews
        .filter((r: any) => r.userId === user.id)
        .map((r: any) => ({
          id: String(r.id),
          userId: r.userId,
          rating: r.rating,
          author: r.author,
          text: r.comment,
          career: careerMap.get(r.careerId) || `Career #${r.careerId}`,
          careerPath: `/careers/${r.careerId}`
        }));

      setReviews(userReviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      toast.error("ไม่สามารถโหลดข้อมูลรีวิวได้");
    } finally {
      setLoadingReviews(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const joinedDate = profile?.joined_at 
    ? new Date(profile.joined_at).toLocaleDateString('th-TH', { 
        month: 'long', 
        year: 'numeric' 
      }) 
    : "ไม่ระบุ";

  const dayStreak = profile?.current_streak || 0;

  const handleEditReview = async (id: string, text: string, rating: number) => {
    try {
      await updateReview(Number(id), { comment: text, rating });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, text, rating } : r))
      );
      toast.success("แก้ไขรีวิวเรียบร้อยแล้ว");
    } catch (error) {
      toast.error("ไม่สามารถแก้ไขรีวิวได้");
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview(Number(id));
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("ลบรีวิวเรียบร้อยแล้ว");
    } catch (error) {
      toast.error("ไม่สามารถลบรีวิวได้");
    }
  };

  return (
    <div className="profile-theme">
      <div className="min-h-screen bg-background">
      {/* Header band */}
      <div className="h-40 bg-primary" />

      <div className="mx-auto -mt-20 max-w-5xl px-4 pb-12">
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
            <div className="grid grid-cols-3 gap-4">
              <StatsCard
                icon={BookOpen}
                value={0}
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
                value="0h"
                label="Learning Hours"
                colorClass="bg-success-light text-success"
              />
            </div>

            {/* Skills */}
            <SkillsMastered
              skills={profile?.skills || []}
            />

            {/* Reviews */}
            {loadingReviews ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <MyReviews
                reviews={reviews.map(r => ({ ...r, author: userName }))}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Profile;
