import React from 'react';
import 'src/styles/scss/layout.scss';

interface AvatarProps extends React.ComponentPropsWithoutRef<'img'> {
  url: string;
  size?: string;
}
export const Avatar: React.FC<AvatarProps> = ({ url, size, ...imageProps }) => {
  return (
    <div className="mentorship-avatar">
      <img
        className={`rounded-circle ${size != null ? `size-${size}` : ''}`}
        src={url}
        alt="avatar"
        {...imageProps}
      />
    </div>
  );
};
