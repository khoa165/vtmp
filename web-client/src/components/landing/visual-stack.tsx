import React from 'react';

interface VisualStackProps {
  activeTile: number;
}

export const VisualStack: React.FC<VisualStackProps> = ({ activeTile }) => {
  return (
    <div className="tiles">
      <div
        style={{ '--r': '45deg' } as React.CSSProperties}
        className={`tile ${activeTile === 2 - 0 ? 'active' : ''}`}
      />
      <div
        style={{ '--r': '275deg' } as React.CSSProperties}
        className={`tile ${activeTile === 2 - 1 ? 'active' : ''}`}
      />
      <div
        style={{ '--r': '190deg' } as React.CSSProperties}
        className={`tile ${activeTile === 2 - 2 ? 'active' : ''}`}
      />
    </div>
  );
};
