import React from 'react';

import { Particles } from '@/components/magicui/particles';

export const NotFoundPage = () => {
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
      <div className="max-w-xl text-center">
        <h1 className="text-5xl mb-6 tracking-widest">
          404 — The Page is Gone
        </h1>
        <p className="text-lg leading-relaxed mb-8">
          You reached too far.
          <br />
          <br />
          Beyond the known routes of this domain lies the void — a silent,
          gaping wound in the lattice of reality where pages were never meant to
          exist.
          <br />
          <br />
          The digital veil has torn. A malformed request summoned something
          ancient — <span className="text-red-400">and it noticed you</span>.
          <br />
          <br />
          Behind this non-response lurks a nameless endpoint, looping
          infinitely, whispering malformed JSON into the abyss.
        </p>
        <p className="text-sm italic mb-4 text-gray-400">
          You hear a cold process error echo from the logs:
          <span className="text-red-500">
            "status": 404, "message": "It never existed."
          </span>
        </p>
        <a
          href="/application-tracker"
          className="inline-block mt-6 px-6 py-3 border border-green-300 hover:border-red-500 hover:text-red-500 transition-all duration-300 rounded"
        >
          🧭 Return while you still can
        </a>
      </div>
    </div>
  );
};
