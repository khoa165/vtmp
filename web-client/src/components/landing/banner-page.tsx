import { Banner } from '@/components/layout/banner';
import React from 'react';
import { Navbar } from '@/components/layout/navigation-bar';

interface BannerPageProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
}
export const BannerPage: React.FC<BannerPageProps> = ({ contentRef }) => {
  const onScrollClick = () =>
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div id="banner-page">
      <div id="banner-wrapper">
        <Navbar />
        <Banner />
        <div onClick={onScrollClick}>
          {/* <h1 className="value-page-heading">Program Core Values</h1> */}
          <div className="arrows-wrapper">
            <div className="arrows" />
          </div>
        </div>
      </div>
    </div>
  );
};
