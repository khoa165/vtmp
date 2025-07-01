import React from 'react';
import { Particles } from '@/components/magicui/particles';

export const InvitationErrorPage = ({ message }: { message: string }) => {
  return (
    <div className="min-h-screen bg-black text-green-100 font-mono flex items-center justify-center p-8">
      <Particles
        className="absolute inset-0 z-0"
        quantity={1000}
        ease={100}
        staticity={10}
        size={0.8}
        refresh
      />
      <div className="text-center">
        <h1 className="text-5xl mb-6 tracking-widest">
          Oops! Something went wrong...
        </h1>
        <p className="text-lg leading-relaxed mb-8">{message}</p>
        <p className="text-lg leading-relaxed mb-8">
          Please contact your administrator to get a new invitation.
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-6 py-3 border border-green-300 hover:border-red-500 hover:text-red-500 transition-all duration-300 rounded"
        >
          🧭 Return to home
        </a>
      </div>
    </div>
  );
};
