import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  Minus,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import IndustryNewsDialog from '@/components/IndustryNewsDialog';
import ReviewSection from '@/components/ReviewSection';
import { useCareers } from '@/hooks/useCareers';
import { getCareerStats, fetchIndustryNewsFromDatabase } from '@/data/mockData';
import type { NewsArticle } from '@/data/mockData';

const growthConfig = {
  high: {
    label: 'High Growth',
    className: 'bg-growth-high-bg text-growth-high-foreground border border-growth-high/20',
    icon: TrendingUp,
  },
  medium: {
    label: 'Medium Growth',
    className: 'bg-growth-medium-bg text-growth-medium-foreground border border-growth-medium/20',
    icon: TrendingUp,
  },
  stable: {
    label: 'Stable Growth',
    className: 'bg-growth-stable-bg text-growth-stable-foreground border border-growth-stable/20',
    icon: Minus,
  },
};

const skillIconColors: Record<string, string> = {
  Soft: 'bg-growth-high-bg text-growth-high',
  Technical: 'bg-accent text-primary',
  Analytical: 'bg-growth-medium-bg text-growth-medium',
};

const CareerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { careers, loading, error } = useCareers();
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  // Fetch industry news from database
  useEffect(() => {
    const loadNews = async () => {
      setNewsLoading(true);
      try {
        const newsData = await fetchIndustryNewsFromDatabase();
        setNews(newsData);
      } catch (err) {
        console.error('Error loading news:', err);
        setNews([]);
      } finally {
        setNewsLoading(false);
      }
    };
    loadNews();
  }, []);

  const career = careers.find((c) => String(c.id) === id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading career details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-red-500">Error loading career: {error.message}</p>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Career not found</p>
      </div>
    );
  }

  const growth = growthConfig[career.growthRate];
  const sidebarNews = news.slice(0, 3);
  const { totalCourses, totalHours } = getCareerStats(career);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back To Careers
        </button>

        {/* Header */}
        <div className="flex gap-6 items-start">
          <img
            src={career.image}
            alt={career.title}
            className="w-56 h-40 rounded-xl object-cover flex-shrink-0"
          />
          <div>
            <div className="flex gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${growth.className}`}
              >
                <growth.icon className="h-3 w-3" />
                {growth.label}
              </span>
              <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                {career.track}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {career.title}
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl">
              {career.description}
            </p>
          </div>
        </div>

        {/* Content grid */}
        <div className="mt-10 grid grid-cols-[1fr_320px] gap-6">
          {/* Left column */}
          <div className="space-y-4">
            {/* Salary card */}
            <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">
                    Expected Salary Range
                  </p>
                  <p className="text-xs opacity-70">Thailand Market</p>
                </div>
              </div>
              <p className="mt-4 text-4xl font-bold">
                ฿{career.salaryMin} - ฿{career.salaryMax}
              </p>
              <p className="mt-1 text-sm opacity-70">Per month</p>
            </div>

            {/* Start Learning Path */}
            <Button size="lg" className="w-full gap-2 py-6 text-base">
              <BookOpen className="h-5 w-5" />
              Start Learning Path
            </Button>
            <p className="text-center text-xs text-muted-foreground -mt-2">
              {totalCourses} courses • {totalHours} hours total
            </p>

            {/* Tabs container */}
            <div className="rounded-2xl bg-section border border-border p-1.5">
              <Tabs defaultValue="overview">
                <TabsList className="w-full bg-transparent h-auto p-0 gap-0">
                  <TabsTrigger
                    value="overview"
                    className="flex-1 rounded-lg py-3 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className="flex-1 rounded-lg py-3 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent"
                  >
                    Required Skills
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="flex-1 rounded-lg py-3 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent"
                  >
                    Reviews
                  </TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="mt-3">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="text-lg font-bold mb-4">
                      Key Responsibilities
                    </h3>
                    <div className="space-y-3">
                      {career.keyResponsibilities.map((resp) => (
                        <div key={resp} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-growth-high mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {resp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Required Skills */}
                <TabsContent value="skills" className="mt-3">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="text-lg font-bold mb-4">Required Skills</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {career.requiredSkills.map((skill) => (
                        <div key={`${skill.name}-${skill.type}`} className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                              skillIconColors[skill.type] ||
                              'bg-accent text-primary'
                            }`}
                          >
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{skill.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {skill.type}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Reviews */}
                <TabsContent value="reviews" className="mt-3">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <ReviewSection 
                      careerId={Number(id)} 
                      userId=""
                      reviews={career.reviews}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right column – Industry News */}
          <div>
            <div className="rounded-2xl bg-card border border-border p-5 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 font-bold">
                  <FileText className="h-5 w-5 text-primary" />
                  Industry News
                </h3>
                <button
                  onClick={() => setNewsDialogOpen(true)}
                  className="flex items-center gap-0.5 text-sm font-medium text-primary hover:underline"
                >
                  See all <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                {sidebarNews.map((news) => (
                  <div key={news.id} className="flex gap-3 cursor-pointer group">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="h-14 w-16 rounded-lg object-cover flex-shrink-0"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {news.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {news.source}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <IndustryNewsDialog
        open={newsDialogOpen}
        onOpenChange={setNewsDialogOpen}
        news={news}
      />
    </div>
  );
};

export default CareerDetail;
