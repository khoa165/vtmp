import { useRef } from 'react';
import { PrgramValues } from './program-values';
import { mentorshipProgramValues } from '@/utils/values';
import { VisualStack } from './visual-stack';
import { BannerPage } from './banner-page';

export const LandingContainer = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const onScrollClick = (keyword) => {
    const element = document.getElementById(`value-${keyword.toLowerCase()}`);
    element?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <div id="landing-page">
      <BannerPage contentRef={contentRef} />
      <div id="content-wrapper" ref={contentRef}>
        {mentorshipProgramValues.map((group, index) => (
          <div
            key={index}
            className="value-page-wrapper"
            id={`value-${group.keyword.toLowerCase()}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
              <div className="visual-stack-wrapper">
                <VisualStack activeTile={index} />
              </div>
              <div className="program-value-wrapper">
                <PrgramValues
                  key={index}
                  keyword={group.keyword}
                  value={group.value}
                />
              </div>
            </div>
            {index < mentorshipProgramValues.length - 1 && (
              <div
                className="arrows-wrapper"
                onClick={() => onScrollClick(group.nextKeyword)}
              >
                <div className="arrows" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
