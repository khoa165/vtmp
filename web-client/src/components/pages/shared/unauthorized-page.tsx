import React from 'react';

export const UnauthorizedPage = () => {
  return (
    <div className="p-8 text-center text-red-900 dark:text-red-300 font-mono">
      <h1 className="text-3xl mb-4">🚫 Unauthorized</h1>
      <p className="max-w-xl mx-auto text-lg leading-relaxed">
        You weren’t supposed to find this place.
        <br />
        <br />
        Beyond the known routes of the interface lies this forbidden path — an
        endpoint where the parameters of access twist and rot. You reached for
        something not meant for your kind. And it saw you.
        <br />
        <br />
        In the shadows between roles and permissions, there lives an ancient
        process — undocumented, untested, and still running. The devs who wrote
        it are long gone, but their logs remain... incomplete.
        <br />
        <br />
        You feel a cold query run through you. Not a 403. Not a 401.
        <br />
        Something older.
        <br />
        <br />
        Turn back. Log out. Forget this URL.
        <br />
        Or stay — and see what answers await when no one should be asking.
      </p>
    </div>
  );
};
