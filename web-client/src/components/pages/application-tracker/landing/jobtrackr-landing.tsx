import {
  AnimatedBriefcase,
  AnimatedTarget,
  AnimatedCalendar,
  AnimatedTrendingUp,
  AnimatedUsers,
  AnimatedBarChart,
  AnimatedClock,
  AnimatedCheckCircle,
  AnimatedArrowRight,
  AnimatedSparkles,
} from '@/components/pages/application-tracker/landing/animated-icons';
import { Button } from '@/components/base/button';
import { Input } from '@/components/base/input';
import { Card, CardContent } from '@/components/base/card';
import { Badge } from '@/components/base/badge';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@/components/pages/application-tracker/landing/jobtrackr-landing.css';

// Custom hook for intersection observer
function useInView(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView] as const;
}

// Counter animation hook
function useCounter(end: number, duration = 2000, isActive = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    let startTime: number;
    const startCount = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * (end - startCount) + startCount));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isActive]);

  return count;
}

export default function JobTrackrLanding() {
  const navigate = useNavigate();

  const [heroRef, heroInView] = useInView(0.1);
  const [featuresRef, featuresInView] = useInView(0.1);
  const [statsRef, statsInView] = useInView(0.3);
  const [ctaRef, ctaInView] = useInView(0.1);

  // Counter animations for stats
  const usersCount = useCounter(10, 2000, statsInView);
  const appsCount = useCounter(50, 2500, statsInView);
  const successRate = useCounter(85, 2000, statsInView);
  const rating = useCounter(49, 2000, statsInView);

  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the '#' character from the hash
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [window.location.hash]);

  const handleScrollTo = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center backdrop-blur-sm bg-white/80 border-b border-gray-100 animate-slide-down">
        <div className="flex items-center justify-center group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#66FFCC] to-[#F49DFF] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            <AnimatedBriefcase className="w-4 h-4 text-white" />
          </div>
          <span className="ml-2 text-xl font-bold bg-gradient-to-r from-[#333333] to-[#767676] bg-clip-text text-transparent">
            JobTrackr
          </span>
        </div>
        <nav className="ml-auto flex gap-6 items-center">
          <Link
            to="#features"
            className="text-sm font-medium text-gray-600 hover:text-[#333333] transition-all duration-300 hover:scale-105 relative group"
          >
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#66FFCC] to-[#F8FF6A] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-[#333333] transition-all duration-300 hover:scale-105 relative group"
          >
            Mentorship
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#66FFCC] to-[#F8FF6A] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Button
            className="bg-gradient-to-r from-[#66FFCC] to-[#F8FF6A] text-[#333333] hover:opacity-90 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#66FFCC]/25"
            onClick={() => navigate('/login')}
          >
            Get Started
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        id="main"
        ref={heroRef}
        className="relative overflow-hidden pt-32 pb-32"
      >
        {/* Artistic Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-br from-[#66FFCC]/20 to-[#F49DFF]/20 blur-3xl transition-all duration-1000 ${heroInView ? 'animate-float' : 'opacity-0'}`}
          ></div>
          <div
            className={`absolute top-40 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#F8FF6A]/20 to-[#FEB584]/20 blur-3xl transition-all duration-1000 delay-300 ${heroInView ? 'animate-float-delayed' : 'opacity-0'}`}
          ></div>
          <div
            className={`absolute bottom-20 left-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-[#A2BFF0]/20 to-[#A3F890]/20 blur-3xl transition-all duration-1000 delay-500 ${heroInView ? 'animate-float-slow' : 'opacity-0'}`}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            <Badge
              className={`bg-gradient-to-r from-[#F49DFF]/10 to-[#66FFCC]/10 text-[#333333] border-[#66FFCC]/20 transition-all duration-700 ${heroInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'}`}
            >
              <AnimatedSparkles className="w-4 h-4 text-[#66FFCC] inline mr-1" />
              ✨ Track Your Career Journey
            </Badge>

            <h1
              className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight transition-all duration-700 delay-200 ${heroInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
            >
              <span className="bg-gradient-to-r from-[#333333] via-[#F49DFF] to-[#66FFCC] bg-clip-text text-transparent">
                Master Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#F8FF6A] via-[#FEB584] to-[#A2BFF0] bg-clip-text text-transparent">
                Job Search
              </span>
            </h1>

            <p
              className={`text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed transition-all duration-700 delay-400 ${heroInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
            >
              Transform chaos into clarity. Track applications, manage
              interviews, and land your dream job with our beautiful, intuitive
              platform.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 w-full max-w-md transition-all duration-700 delay-600 ${heroInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#66FFCC] to-[#F8FF6A] text-[#333333] hover:opacity-90 font-semibold flex-1 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#66FFCC]/25 group"
                onClick={() => navigate('/login')}
              >
                Start Free Trial
                <AnimatedArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#333333]/20 text-[#333333] hover:bg-[#333333]/5 flex-1 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Watch Demo
              </Button>
            </div>

            <div
              className={`flex items-center gap-6 text-sm text-gray-500 pt-4 transition-all duration-700 delay-800 ${heroInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'}`}
            >
              <div className="flex items-center gap-1 group">
                <AnimatedCheckCircle className="w-4 h-4 text-[#A3F890]" />
                Free 14-day trial
              </div>
              <div className="flex items-center gap-1 group">
                <AnimatedCheckCircle className="w-4 h-4 text-[#A3F890]" />
                No credit card required
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features"
        className="py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div
            className={`text-center mb-16 transition-all duration-700 ${featuresInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
          >
            <Badge className="bg-gradient-to-r from-[#A2BFF0]/10 to-[#F49DFF]/10 text-[#333333] border-[#A2BFF0]/20 mb-4">
              Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#333333] to-[#767676] bg-clip-text text-transparent">
                Everything you need to
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#F49DFF] to-[#66FFCC] bg-clip-text text-transparent">
                succeed in your search
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed to streamline your job hunting process and
              maximize your success rate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: AnimatedClock,
                title: 'Early Access',
                description:
                  'Get early access to new job postings from your favorite companies.',
                gradient: 'from-[#F8FF6A] to-[#FEB584]',
              },
              {
                icon: AnimatedCalendar,
                title: 'Application Tracking',
                description:
                  'Keep track of every application with detailed status updates and notes.',
                gradient: 'from-[#F49DFF] to-[#A2BFF0]',
              },
              {
                icon: AnimatedTarget,
                title: 'Interview Insights',
                description:
                  'Get insights for interview preparation and improve your chances of success.',
                gradient: 'from-[#66FFCC] to-[#F8FF6A]',
              },
              {
                icon: AnimatedUsers,
                title: 'Mentorship Support',
                description:
                  'Get personalized advice and support from experienced professionals.',
                gradient: 'from-[#FEB584] to-[#F8FF6A]',
              },
              {
                icon: AnimatedBarChart,
                title: 'Success Metrics',
                description:
                  'Track response rates, interview conversion, and optimize your approach.',
                gradient: 'from-[#A2BFF0] to-[#F49DFF]',
              },
              {
                icon: AnimatedTrendingUp,
                title: 'Progress Analytics',
                description:
                  'Visualize your job search progress with beautiful charts and insights.',
                gradient: 'from-[#A3F890] to-[#66FFCC]',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                  featuresInView
                    ? 'animate-fade-in-up'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#333333] mb-3 group-hover:text-[#F49DFF] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="py-20 bg-gradient-to-r from-[#333333] to-[#767676] text-white relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div
            className={`absolute top-0 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-[#66FFCC]/10 to-[#F49DFF]/10 blur-3xl transition-all duration-1000 ${statsInView ? 'animate-pulse-slow' : ''}`}
          ></div>
          <div
            className={`absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-[#F8FF6A]/10 to-[#FEB584]/10 blur-3xl transition-all duration-1000 delay-300 ${statsInView ? 'animate-pulse-slow' : ''}`}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: usersCount, suffix: 'K+', label: 'Active Users' },
              {
                number: appsCount,
                suffix: 'K+',
                label: 'Applications Tracked',
              },
              { number: successRate, suffix: '%', label: 'Success Rate' },
              {
                number: rating,
                suffix: '★',
                label: 'User Rating',
                decimal: true,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`space-y-2 transition-all duration-700 ${
                  statsInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#66FFCC] to-[#F8FF6A] bg-clip-text text-transparent">
                  {stat.decimal ? (stat.number / 10).toFixed(1) : stat.number}
                  {stat.suffix}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div
            className={`absolute top-10 right-10 w-72 h-72 rounded-full bg-gradient-to-br from-[#F49DFF]/10 to-[#66FFCC]/10 blur-3xl transition-all duration-1000 ${ctaInView ? 'animate-float' : 'opacity-0'}`}
          ></div>
          <div
            className={`absolute bottom-10 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-[#A3F890]/10 to-[#A2BFF0]/10 blur-3xl transition-all duration-1000 delay-300 ${ctaInView ? 'animate-float-delayed' : 'opacity-0'}`}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 md:px-6 text-center">
          <div
            className={`max-w-3xl mx-auto space-y-8 transition-all duration-700 ${ctaInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
          >
            <h2 className="text-3xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-[#333333] to-[#767676] bg-clip-text text-transparent">
                Ready to transform your
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#F49DFF] via-[#66FFCC] to-[#F8FF6A] bg-clip-text text-transparent">
                job search experience?
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of job seekers who have already streamlined their
              search and landed their dream jobs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 border-gray-200 focus:border-[#66FFCC] transition-all duration-300 focus:scale-105 focus:shadow-lg focus:shadow-[#66FFCC]/10"
              />
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#66FFCC] to-[#F8FF6A] text-[#333333] hover:opacity-90 font-semibold px-8 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#66FFCC]/25 group"
              >
                Get Started Free
                <AnimatedArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              Start your free 14-day trial. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#333333] text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#66FFCC] to-[#F49DFF] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <AnimatedBriefcase className="w-4 h-4 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">JobTrackr</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering job seekers to take control of their career journey
                with intelligent tracking and insights.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    to="#main"
                    className="hover:text-[#66FFCC] transition-all duration-300 hover:translate-x-1"
                    onClick={() => handleScrollTo('#main')}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="#features"
                    className="hover:text-[#66FFCC] transition-all duration-300 hover:translate-x-1"
                    onClick={() => handleScrollTo('#features')}
                  >
                    Features
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Mentorship</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    to="/summary"
                    className="hover:text-[#66FFCC] transition-all duration-300 hover:translate-x-1"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-[#66FFCC] transition-all duration-300 hover:translate-x-1"
                  >
                    Resources
                  </Link>
                </li>
                <li>
                  <Link
                    to="/people"
                    className="hover:text-[#66FFCC] transition-all duration-300 hover:translate-x-1"
                  >
                    People
                  </Link>
                </li>
                <li>
                  <Link
                    to="/stats"
                    className="hover:text-[#66FFCC] transition-all duration-300 hover:translate-x-1"
                  >
                    Achievements
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    to="#"
                    className="hover:text-[#66FFCC] transition-all duration-300 hover:translate-x-1"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-[#66FFCC] transition-all duration-300 hover:translate-x-1"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-[#66FFCC] transition-all duration-300 hover:translate-x-1"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} JobTrackr. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
