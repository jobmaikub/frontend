import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Minus,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  Play,
  Award,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { learningPathApi } from '@/lib/LearningPath.api';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import IndustryNewsSidebar from '@/components/IndustryNewsDialog';
import ReviewSection from '@/components/ReviewSection';
import { OldThemeWrapper } from '@/components/OldThemeWrapper';
import { useCareers } from '@/hooks/useCareers';
import { useAuth } from '@/contexts/AuthContexts';
import { getCareerStats } from '@/lib/careers.service';
import { fetchIndustryNewsFromDatabase } from '@/lib/news.service';
import type { NewsArticle } from '@/types/careers.types';
import { Navbar } from '@/components/navbar and footer/Navbar';
import { Footer } from '@/components/navbar and footer/Footer';

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
  const { user, profile } = useAuth();
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [checkingPath, setCheckingPath] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Handle hash for reviews
  useEffect(() => {
    if (window.location.hash.startsWith('#review-')) {
      setActiveTab('reviews');
    }
  }, []);

  const career = careers.find((c) => String(c.id) === id);

  // Check if learning path has been started
  useEffect(() => {
    const checkPathStatus = async () => {
      if (!user || !career) {
        setCheckingPath(false);
        return;
      }
      setCheckingPath(true);
      try {
        const res = await learningPathApi.getAll(user.id);
        const matchedPath = res.data.find((path: any) => String(path.id) === String(career.id) || String(path.career_id) === String(career.id));
        if (matchedPath) {
          setHasStarted(true);
          setProgress(Math.round(matchedPath.progress || 0));
        } else {
          setHasStarted(false);
          setProgress(0);
        }
      } catch (err) {
        console.error('Failed to check learning path status', err);
      } finally {
        setCheckingPath(false);
      }
    };
    checkPathStatus();
  }, [user, career]);

  // Fetch industry news from database
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchNews = async () => {
      if (!career) return;
      setNewsLoading(true);
      try {
        // Fetch news for this specific industry from database
        const dbNews = await fetchIndustryNewsFromDatabase(career.track);
        console.log('[CareerDetail] News fetched from DB for industry:', career.track, dbNews.length);
        
        if (career) {
          console.log('[News Debug] Career Track:', career.track);
          // Since backend already filters, we don't need much frontend filtering
          // but we'll keep the logic as a safety measure
          const careerTrack = career.track?.toLowerCase() || '';
          
          let filteredNews = dbNews.filter(n => {
            if (!n.industry) return false;
            if (n.industry === 'All Industries') return true;
            
            const newsIndustry = n.industry.toLowerCase();
            return newsIndustry.includes(careerTrack) || careerTrack.includes(newsIndustry);
          });

          // If still no filtered news (backend returned something unexpected), 
          // or if it's empty, try fetching all news as fallback
          if (filteredNews.length === 0) {
            console.log('[CareerDetail] No specific news found, fetching all latest news...');
            const allNews = await fetchIndustryNewsFromDatabase();
            setNews(allNews);
          } else {
            setNews(filteredNews);
          }
        }
 else {
          setNews(dbNews);
        }
      } catch (err) {
        console.error('Error loading news:', err);
        setNews([]);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, [career, id]);

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
  
  // Filter news for sidebar: show news matching the career industry or fallback to latest
  const filteredSidebarNews = news.filter(n => 
    (n.industry && career.track && n.industry.toLowerCase() === career.track.toLowerCase()) || 
    n.industry === 'All Industries'
  );
  const sidebarNews = filteredSidebarNews.length > 0 
    ? filteredSidebarNews.slice(0, 3) 
    : news.slice(0, 3);

  const { totalCourses, totalHours } = getCareerStats(career);

  return (
    <OldThemeWrapper>
      <div className="min-h-screen bg-background pt-16">
        <Navbar />
        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back To Careers
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
            <img
              src={career.image}
              alt={career.title}
              className="w-full md:w-56 h-56 md:h-40 rounded-2xl md:rounded-xl object-cover flex-shrink-0 shadow-md"
            />
            <div className="flex-grow">
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide uppercase shadow-sm ${growth.className}`}
                >
                  <growth.icon className="h-3.5 w-3.5" strokeWidth={3} />
                  {growth.label}
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
                  {career.track}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {career.title}
              </h1>
              <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl mx-auto md:mx-0">
                {career.description}
              </p>
            </div>
          </div>


          {/* Content grid */}
          <div className="mt-10 flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">

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

              {/* Learning Path Action Area */}
              {checkingPath ? (
                <div className="h-[80px] w-full bg-muted animate-pulse rounded-2xl" />
              ) : (
                <div className={!hasStarted ? "" : "bg-card rounded-2xl border border-border shadow-sm overflow-hidden"}>
                  {hasStarted ? (
                    progress === 100 ? (
                      <div className="p-6 space-y-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                            <Award className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">Path Completed</p>
                            <p className="text-xs text-green-600 font-medium">Mastery Achieved!</p>
                          </div>
                          <div className="ml-auto text-xl font-bold text-green-600">
                            100%
                          </div>
                        </div>

                        <div className="w-full bg-green-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-green-500 h-full w-full" />
                        </div>

                        <Button 
                          size="lg" 
                          className="w-full gap-2 py-6 text-base font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-sm border-none"
                          onClick={() => navigate(`/learning-path/${id}`)}
                        >
                          <Trophy className="h-4 w-4" />
                          View Achievement
                        </Button>
                      </div>
                    ) : (
                      <div className="p-6 space-y-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-primary">
                            <TrendingUp className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">Learning Journey</p>
                            <p className="text-xs text-muted-foreground">In Progress</p>
                          </div>
                          <div className="ml-auto text-xl font-bold text-primary">
                            {progress}%
                          </div>
                        </div>

                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-primary h-full transition-all duration-700 ease-out" 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>

                        <Button 
                          size="lg" 
                          className="w-full gap-2 py-6 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md border-none"
                          onClick={() => navigate(`/learning-path/${id}`)}
                        >
                          <Play className="h-4 w-4 fill-current" />
                          Continue Learning
                        </Button>
                      </div>
                    )
                  ) : (
                    <Button 
                      size="lg" 
                      className="w-full gap-2 py-8 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg border-none"
                      onClick={async () => {
                        if (!user) {
                          alert("Please login first");
                          return;
                        }
                        try {
                          await learningPathApi.start(user.id, Number(id));
                          navigate(`/learning-path/${id}`);
                        } catch (err: any) {
                          alert(err.response?.data?.message || "Failed to start learning path");
                        }
                      }}
                    >
                      <BookOpen className="h-5 w-5" />
                      Start Learning Path
                    </Button>
                  )}
                </div>
              )}

              {/* Tabs container */}
              <div className="rounded-2xl bg-section border border-border p-1.5">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                              className={`h-10 w-10 rounded-xl flex items-center justify-center ${skillIconColors[skill.type] ||
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
                        userId={user?.id || ''}
                        userName={profile?.full_name || profile?.username || 'Guest'}
                        reviews={career.reviews}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Right column – Industry News (Sidebar on desktop, Bottom on mobile) */}
            <div className="order-last lg:order-none">
              <div className="rounded-2xl bg-card border border-border p-6 lg:sticky lg:top-24">

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
                  {sidebarNews.map((news, index) => (
                    <a
                      key={news.id || index}
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-3 cursor-pointer group"
                    >
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
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <IndustryNewsSidebar
          open={newsDialogOpen}
          onOpenChange={setNewsDialogOpen}
          news={news}
        />
      </div>
      <Footer />
    </OldThemeWrapper>
  );
};

export default CareerDetail;
