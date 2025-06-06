import React from 'react';
import { Link } from 'react-router-dom';

export const Banner = () => {
  return (
    <div
      id="mentorship-banner"
      className="relative min-h-screen bg-gradient-to-br from-vtmp-dark-blue via-vtmp-primary to-vtmp-secondary"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center min-h-screen">
        <div className="lg:col-span-8 px-1 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
            Viet Tech Mentorship Program
          </h1>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-white/90">
            Seeks to build a sustainable pipeline of early career talent and
            empower Vietnamese students to break into the tech industry
          </p>
          <Link
            to="/summary"
            className="relative inline-block px-3 sm:px-8 py-4 text-lg sm:text-xl font-medium text-white hover:scale-105 transition-all duration-300 rounded-lg border-[3px] border-transparent [background:linear-gradient(#00000000,#00000000)_padding-box,linear-gradient(to_right,#66ffcc,#005de3)_border-box] bg-white/5"
          >
            View our achievements
          </Link>
        </div>
        <div className="hidden lg:col-span-4 lg:block">
          <div className="viettech-logo-wrapper p-[3px] rounded-[50%] border-transparent [background:linear-gradient(#00000000,#00000000)_padding-box,linear-gradient(to_right,#66ffcc,#005de3)_border-box] max-w-[300px] mx-auto">
            <img
              src="https://res.cloudinary.com/khoa165/image/upload/v1718192551/viettech/VTMP_logo.png"
              alt="Viet Tech logo banner"
              className="w-full h-auto rounded-[50%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
