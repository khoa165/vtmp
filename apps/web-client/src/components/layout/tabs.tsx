import React, { useState } from 'react';

interface TabsProps {
  tabNames: {
    title: string;
  }[];
}

export const Tabs: React.FC<TabsProps> = ({ tabNames }) => {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
      {tabNames.map((entry, index) => (
        <div key={index}>
          <div
            className={`tab cursor-pointer transition-colors duration-200 ${
              index === tabIndex ? 'tab-active' : 'tab-non-active'
            }`}
            onClick={() => setTabIndex(index)}
          >
            <p className="m-0">{entry.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
