import React from 'react';

interface AvatarProps extends React.ComponentPropsWithoutRef<'img'> {
  url: string;
  size?: string;
}
export const Avatar: React.FC<AvatarProps> = ({ url, size, ...imageProps }) => {
  return (
    <div className="mentorship-avatar">
      <img
        className={`rounded-full ${size != null ? `size-${size}` : ''}`}
        src={url}
        alt="avatar"
        {...imageProps}
      />
    </div>
  );
};
