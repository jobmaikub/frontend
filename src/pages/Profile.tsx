import { useState } from "react";
import { BookOpen, Flame, TrendingUp } from "lucide-react";
import ProfileCard from "@/components/profile/ProfileCard";
import StatsCard from "@/components/profile/StatsCard";
import SkillsMastered from "@/components/profile/SkillsMastered";
import MyReviews, { Review } from "@/components/profile/MyReviews";

const INITIAL_REVIEWS: Review[] = [
  {
    id: "1",
    rating: 4,
    author: "ROSE",
    text: "จากที่เคยเจอมาตลอด 6 ปีค้นพบได้เลยว่า เหนื่อยมากๆ แต่เงินดีมากเหมือนกัน",
    career: "UX/UI Designer",
    careerPath: "/careers/ux-ui-designer",
  },
  {
    id: "2",
    rating: 3,
    author: "ROSE",
    text: "เจอแต่เพื่อนร่วมงานแย่ค่ะ ตารางงานค่อนข้างแน่น แทบไม่ได้พัก",
    career: "Programmer",
    careerPath: "/careers/programmer",
  },
];

const Profile = () => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userName, setUserName] = useState("ROSE");
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  const handleEditReview = (id: string, text: string, rating: number) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, text, rating } : r))
    );
  };

  const handleDeleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
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
              email="rosesarered@gmail.com"
              joinedDate="ธันวาคม 2025"
              avatarUrl={avatarUrl}
              onAvatarChange={setAvatarUrl}
              onNameChange={setUserName}
            />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              <StatsCard
                icon={BookOpen}
                value={10}
                label="Courses Completed"
                colorClass="bg-brand-light text-primary"
              />
              <StatsCard
                icon={Flame}
                value={3}
                label="Day Streak"
                colorClass="bg-warning-light text-warning"
              />
              <StatsCard
                icon={TrendingUp}
                value="72h"
                label="Learning Hours"
                colorClass="bg-success-light text-success"
              />
            </div>

            {/* Skills */}
            <SkillsMastered
              skills={[
                "UX/UI Design",
                "Wireframing",
                "User Research",
                "Python Programming",
                "Pandas",
                "NumPy",
              ]}
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
