import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Career } from '@/types/careers.types';
import {
  ArrowRight,
  Play,
  Sparkles,
  BookOpen,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CareerCard from '@/components/CareerCard';
import { OldThemeWrapper } from '@/components/OldThemeWrapper';
import { useCareers } from '@/hooks/useCareers';
import heroImage from '@/assets/hero-career.jpg';
import { Navbar } from '@/components/navbar and footer/Navbar';
import { Footer } from '@/components/navbar and footer/Footer';

const journeySteps = [
  {
    number: '01',
    icon: Sparkles,
    title: 'AI Match',
    description:
      'Answer a few questions about your skills, interests, and goals. Our AI analyzes your profile to find the perfect career matches.',
    iconBg: 'bg-accent',
    iconColor: 'text-accent-foreground',
    path: '/ai-match',
  },
  {
    number: '02',
    icon: BookOpen,
    title: 'Learning Path',
    description:
      'Get a roadmap with curated courses, resources, and milestones to guide your journey from beginner to advanced.',
    iconBg: 'bg-growth-high-bg',
    iconColor: 'text-growth-high',
    path: '/learning-path',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Track Progress',
    description:
      'Monitor your advancement with detailed analytics, achievement badges, and streak tracking to stay motivated.',
    iconBg: 'bg-accent',
    iconColor: 'text-accent-foreground',
    path: '/track-progress',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { careers } = useCareers();
  const [trendingCareers, setTrendingCareers] = useState<Career[]>([]);

  useEffect(() => {
    document.title = "Jobmaikub | ค้นหาอาชีพที่ใช่ด้วย AI";
    import('@/lib/careers.service').then(({ fetchTrendingCareers }) => {
      fetchTrendingCareers().then(setTrendingCareers);
    });
  }, []);

  return (
    <OldThemeWrapper>
      <div className="min-h-screen bg-background pt-16">
        <Navbar />
        {/* ── Hero ── */}
        <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-10 pb-16 lg:pt-16 lg:pb-20">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground flex flex-col gap-4 items-center lg:items-start">
                <span>Design your <span className="text-primary">Career</span></span>
                <span>Master your <span className="text-primary">Skills</span></span>
              </h1>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto lg:mx-0">
                Discover your perfect career path with AI-powered
                recommendations, structured learning roadmaps, and
                comprehensive progress tracking.
              </p>

              {/* Mobile Image: Visible only on mobile/tablet, positioned above buttons */}
              <div className="mt-8 lg:hidden w-full flex justify-center">
                <img
                  src={heroImage}
                  alt="Career development"
                  className="rounded-2xl w-full max-w-sm object-cover shadow-2xl"
                />
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
                <Button size="lg" className="group gap-2 w-full sm:w-auto transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-95" onClick={() => navigate('/ai-match')}>
                  Get Started <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="group gap-2 w-full sm:w-auto transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-95 bg-white"
                  onClick={() => navigate('/careers')}
                >
                  <Play className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-x-1" /> Explore Careers
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex flex-1 justify-end w-full">
              <img
                src={heroImage}
                alt="Career development"
                className="rounded-2xl w-full max-w-sm lg:max-w-md object-cover shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* ── Journey to Success ── */}
        <section className="bg-[#F4F7FF] py-20">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div className="text-center flex flex-col items-center">
              <div className="mb-4 flex items-center justify-center rounded-full bg-[#D5E3FF]/50 px-4 py-1.5">
                <span className="text-[14px] font-medium text-[#4A5DF9]">Take It Steps</span>
              </div>
              <h2 className="mt-4 text-3xl font-bold text-foreground">
                Your Journey to Success
              </h2>
              <p className="mt-2 text-muted-foreground">
                Three simple steps to transform your career aspirations into reality.
              </p>
            </div>


            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {journeySteps.map((step) => (
                <div
                  key={step.number}
                  className="group relative rounded-2xl bg-card p-6 border border-border transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-xl hover:border-primary/20 cursor-pointer"
                  onClick={() => navigate(step.path)}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`h-12 w-12 rounded-xl ${step.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`}
                    >
                      <step.icon className={`h-6 w-6 ${step.iconColor}`} />
                    </div>
                    <span className="text-6xl font-bold text-muted-foreground/15 select-none leading-none transition-all duration-300 group-hover:scale-110 group-hover:text-primary/10">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-card-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trending Career Paths ── */}
        <section className="max-w-6xl mx-auto px-6 sm:px-8 py-20">
          <div className="flex items-end justify-between">
            <div className="flex flex-col items-start">
              <div className="mb-4 flex items-center justify-center rounded-full bg-[#D5E3FF]/50 px-4 py-1.5">
                <span className="text-[14px] font-medium text-[#4A5DF9]">Popular Careers</span>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-foreground">
                Trending Career Paths
              </h2>
              <p className="mt-2 text-muted-foreground">
                Explore the most in-demand careers with high growth potential
              </p>
            </div>
            <button
              onClick={() => navigate('/careers')}
              className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              View All Careers <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCareers.length > 0 ? (
              trendingCareers.map((career) => (
                <CareerCard key={career.id} career={career} />
              ))
            ) : (
              [...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm h-[400px]">
                  <div className="aspect-[3/2] bg-muted animate-pulse" />
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between">
                      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-7 w-full bg-muted animate-pulse rounded" />
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                      <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-cta py-20">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center">
            <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-medium text-cta-foreground">
              Start Your Journey Today
            </span>
            <h2 className="mt-6 text-4xl font-bold text-cta-foreground">
              Ready to discover
              <br />
              your perfect career?
            </h2>
            <p className="mt-4 text-cta-foreground/70 max-w-md mx-auto">
              Take our AI-powered career assessment and get recommendations in
              minutes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 w-full">
              <Button size="lg" className="group gap-2 w-full sm:w-auto transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/20 active:scale-95" onClick={() => navigate('/ai-match')}>
                Get Career Match <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="
                  group
                  gap-2 w-full sm:w-auto
                  border-white bg-white text-primary
                  hover:bg-white/90 hover:border-white/90
                  transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-95
                "
                onClick={() => navigate('/careers')}
              >
                <Play className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-x-1" /> Browse Careers
              </Button>

            </div>
          </div>
        </section>
        <Footer />
      </div>
    </OldThemeWrapper>
  );
};

export default Home;
