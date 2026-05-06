import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Flame, TrendingUp, Star, Mail, MessageCircle, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { getAllReviews } from "@/lib/reviews.api";
import { fetchCareers, Career } from "@/lib/careers.api";
import { Navbar } from "@/components/navbar and footer/Navbar";
import StatsCard from "@/components/profile/StatsCard";
import SkillsMastered from "@/components/profile/SkillsMastered";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EnrichedSkill } from "@/lib/track_progress.api";


interface PublicProfileData {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  skills_mastered: string[] | null;
  joined_at: string | null;
  courses_completed: number | null;
  current_streak: number | null;
  total_learning_hours: number | null;
}

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  career: string;
  careerId: number;
  date?: string;
  parentReviewId?: number | null;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<PublicProfileData | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;
      try {
        setLoading(true);

        // Fetch public profile from Backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/public-profile/${userId}`);

        if (!response.ok) {
          setNotFound(true);
          return;
        }

        const data = await response.json();
        setProfileData(data);

        // Fetch user reviews
        const allReviews = await getAllReviews();
        const userReviews = allReviews.filter((r: any) => r.userId === userId);

        const careers = await fetchCareers();
        const formattedReviews = userReviews.map((r: any) => ({
          id: String(r.id),
          rating: r.rating,
          comment: r.comment,
          careerId: r.careerId,
          date: r.date,
          parentReviewId: r.parentReviewId,
          career: careers.find((c: Career) => c.career_id === r.careerId)?.title || `Career #${r.careerId}`
        }));
        setReviews(formattedReviews);

      } catch (err) {
        console.error("Error loading profile:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <Navbar />
        <div className="h-40 bg-primary/20" />
        <div className="mx-auto -mt-20 max-w-5xl px-8 pb-24">
          <div className="grid gap-6 md:grid-cols-[280px_1fr]">
            <Skeleton className="h-[200px] w-full rounded-2xl" />
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !profileData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">User not found</p>
        <button onClick={() => navigate(-1)} className="text-primary hover:underline text-sm">
          Go back
        </button>
      </div>
    );
  }

  const displayName = profileData.full_name || "Unknown User";
  const joinedDate = profileData.joined_at
    ? new Date(profileData.joined_at).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    : "N/A";

  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="profile-theme">
      <div className="min-h-screen bg-background pt-16">
        <Navbar />
        {/* Header band */}
        <div className="h-40 bg-primary" />

        <div className="mx-auto -mt-20 max-w-5xl px-8 pb-24">

          <div className="grid gap-6 md:grid-cols-[280px_1fr]">
            {/* Left column - Profile Card */}
            <div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm text-center">
                <Avatar className="mx-auto h-24 w-24 border-4 border-accent">
                  <AvatarImage src={profileData.avatar_url || ""} alt={displayName} />
                  <AvatarFallback className="bg-primary text-3xl font-bold text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <h2 className="mt-4 text-xl font-bold text-foreground">{displayName}</h2>
                
                {profileData.email && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{profileData.email}</span>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard
                  icon={BookOpen}
                  value={profileData.courses_completed || 0}
                  label="Courses Completed"
                  colorClass="bg-brand-light text-primary"
                />
                <StatsCard
                  icon={Flame}
                  value={profileData.current_streak || 0}
                  label="Day Streak"
                  colorClass="bg-warning-light text-warning"
                />
                <StatsCard
                  icon={TrendingUp}
                  value={`${profileData.total_learning_hours || 0}h`}
                  label="Learning Hours"
                  colorClass="bg-success-light text-success"
                />
              </div>

              {/* Skills */}
              <SkillsMastered
                skills={(profileData.skills_mastered || []).map((name): EnrichedSkill => ({
                  name,
                  level: "beginner",
                  courseCount: 1,
                  careers: [],
                  lastUpdated: null,
                }))}
              />

              {/* Reviews */}
              <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="border-b border-border bg-muted/30 px-6 py-4">
                  <h3 className="text-lg font-bold text-foreground">
                    Reviews
                  </h3>
                </div>

                <div className="divide-y divide-border">
                  {reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="group p-6 transition-colors hover:bg-accent/30 cursor-pointer"
                      onClick={() => navigate(`/careers/${review.careerId}#review-${review.id}`)}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          {!review.parentReviewId ? (
                            <StarRating rating={review.rating} />
                          ) : (
                            <span className="text-xs font-bold text-primary/70 bg-primary/5 px-2 py-0.5 rounded">
                              Reply
                            </span>
                          )}
                          {review.date && (
                            <span className="text-xs text-muted-foreground">
                              {review.date}
                            </span>
                          )}
                        </div>

                        <p className="text-sm leading-relaxed text-foreground/90 font-medium italic">
                          "{review.comment}"
                        </p>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">Reviewed for:</span>
                          <span className="font-semibold text-primary">
                            {review.career}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-muted p-4 mb-3">
                        <MessageCircle className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">No reviews yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
