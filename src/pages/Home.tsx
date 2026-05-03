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
    import('@/lib/careers.service').then(({ fetchTrendingCareers }) => {
      fetchTrendingCareers().then(setTrendingCareers);
    });
  }, []);

  const displayCareers = trendingCareers.length > 0 ? trendingCareers : careers.slice(0, 3);

  return (
    <OldThemeWrapper>
      <div className="min-h-screen bg-background pt-16">
        <Navbar />
      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-foreground">
              Design your{' '}
              <span className="text-primary">Career</span>,
              <br />
              Master your{' '}
              <span className="text-primary">Skills</span>
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
              <Button size="lg" className="gap-2" onClick={() => navigate('/ai-match')}>
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => navigate('/careers')}
              >
                <Play className="h-4 w-4" /> Explore Careers
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
      <section className="bg-section py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-primary">
              Take It Steps
            </span>
            <h2 className="mt-4 text-3xl font-bold text-foreground">
              Your Journey to Success
            </h2>
            <p className="mt-2 text-muted-foreground">
              Three simple steps to transform your career aspirations into
              reality.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeySteps.map((step) => (
              <div
                key={step.number}
                className="group relative rounded-2xl bg-card p-6 border border-border hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(step.path)}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`h-12 w-12 rounded-xl ${step.iconBg} flex items-center justify-center`}
                  >
                    <step.icon className={`h-6 w-6 ${step.iconColor}`} />
                  </div>
                  <span className="text-6xl font-bold text-muted-foreground/15 select-none leading-none">
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
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between">
          <div>
            <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-primary">
              Popular Careers
            </span>
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
          {displayCareers.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-cta py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
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
          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg" className="gap-2" onClick={() => navigate('/ai-match')}>
              Get Career Match <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
  size="lg"
  variant="outline"
  className="
    gap-2
    border-white
    bg-white
    text-primary
    hover:bg-muted/80
    hover:border-muted-foreground/40
    transition-all
    duration-200
    ease-in-out
  "
  onClick={() => navigate('/careers')}
>
  <Play className="h-4 w-4" /> Browse Careers
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
