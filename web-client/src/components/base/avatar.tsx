import React from 'react';

export const Avatar = ({ userName }: { userName: string }) => {
  return (
    <>
      <img
        width={24}
        height={24}
        src="https://img.icons8.com/bubbles/100/user.png"
        alt="user"
      />
      <span>{userName}</span>
    </>
  );
};
