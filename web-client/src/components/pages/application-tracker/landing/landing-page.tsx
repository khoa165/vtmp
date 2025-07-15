import { FileText, Calendar, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

import { TreverseFullLogo } from '#vtmp/web-client/components/base/treverse-full-logo';

export const LandingPage = () => {
  const landingPageCards = [
    {
      logo: FileText,
      title: 'Application Tracker',
      url: '/applications',
      overview:
        'Track your job application status, and interview stages seamlessly',
    },
    {
      logo: Calendar,
      title: 'Job Board',
      url: '/jobs',
      overview:
        'Our job board features the latest postings that the community contributes to',
    },
    {
      logo: MessageSquare,
      title: 'Interview News Feed',
      url: '/interviews',
      overview:
        'Leverage interview insights from other applicants via a curated interview news feed',
    },
  ];
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative backdrop-blur-[100px]">
      <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-r from-[#333333] via-[#F8FF6A] via-30% to-[#66FFCC] to-20%"></div>{' '}
      <div className="absolute top-1/4 left-0 right-0 h-1/4 bg-gradient-to-r from-[#333333] to-[#333333]"></div>
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-r from-transparent to-[#333333] backdrop-blur-[100px]"></div>{' '}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#333333] "></div>
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        {/* Header Section */}
        <div className="space-y-4">
          {/* SVG Logo */}
          <div className="flex justify-center mb-4">
            <TreverseFullLogo className="w-[320px] h-[49px]" />
          </div>

          <h2 className="text-xl md:text-2xl text-white font-medium">
            For Viet Tech, by Viet Tech
          </h2>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Track applications, manage interviews, and gain helpful insights
            from a strong network of mentors and mentees
          </p>
        </div>
        <div></div>
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {landingPageCards.map((card, index) => (
            <Link to={card.url}>
              <div
                key={index}
                className="group bg-black/30 backdrop-blur-md rounded-xl p-8 text-center space-y-6 border border-white/20 hover:bg-black/40 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
              >
                <div className="flex justify-center">
                  <div className="p-4 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors duration-300">
                    <card.logo
                      className="w-8 h-8 text-white"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl">{card.title}</h3>
                <p className="text-white/80 text-base leading-relaxed">
                  {card.overview}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
