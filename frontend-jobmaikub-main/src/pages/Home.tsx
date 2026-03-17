import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  Sparkles,
  BookOpen,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CareerCard from '@/components/CareerCard';
import { useCareers } from '@/hooks/useCareers';
import heroImage from '@/assets/hero-career.jpg';

const journeySteps = [
  {
    number: '01',
    icon: Sparkles,
    title: 'AI Match',
    description:
      'Answer a few questions about your skills, interests, and goals. Our AI analyzes your profile to find the perfect career matches.',
    iconBg: 'bg-accent',
    iconColor: 'text-accent-foreground',
  },
  {
    number: '02',
    icon: BookOpen,
    title: 'Learning Path',
    description:
      'Get a roadmap with curated courses, resources, and milestones to guide your journey from beginner to advanced.',
    iconBg: 'bg-growth-high-bg',
    iconColor: 'text-growth-high',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Track Progress',
    description:
      'Monitor your advancement with detailed analytics, achievement badges, and streak tracking to stay motivated.',
    iconBg: 'bg-accent',
    iconColor: 'text-accent-foreground',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { careers } = useCareers();
  const trendingCareers = careers.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <div className="flex items-center gap-12">
          <div className="flex-1">
            <h1 className="text-5xl font-bold leading-tight text-foreground">
              Design your{' '}
              <span className="text-primary">Career</span>,
              <br />
              Master your{' '}
              <span className="text-primary">Skills</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-lg">
              Discover your perfect career path with AI-powered
              recommendations, structured learning roadmaps, and
              comprehensive progress tracking.
            </p>
            <div className="mt-8 flex gap-3">
              <Button size="lg" className="gap-2">
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
          <div className="flex-1 flex justify-end">
            <img
              src={heroImage}
              alt="Career development"
              className="rounded-2xl w-full max-w-md object-cover"
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

          <div className="mt-12 grid grid-cols-3 gap-6">
            {journeySteps.map((step) => (
              <div
                key={step.number}
                className="group relative rounded-2xl bg-card p-6 border border-border hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate('/careers')}
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
                {/* Arrow inside card */}
                <div className="mt-4 h-8 w-8 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight className="h-4 w-4 text-primary-foreground" />
                </div>
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
        <div className="mt-8 grid grid-cols-3 gap-6">
          {trendingCareers.map((career) => (
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
            <Button size="lg" className="gap-2">
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
    </div>
  );
};

export default Home;
