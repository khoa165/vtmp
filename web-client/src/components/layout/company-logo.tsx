import React from 'react';

import { CompanyMetadataWithOffers } from '@/types';

interface CompanyLogoProps {
  company: CompanyMetadataWithOffers;
  maxHeight?: number;
}
export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  company,
  maxHeight,
}) => {
  return (
    <div className="company-logo-card">
      <div className="company-logo-wrapper">
        <img
          className="company-logo"
          src={company.logoUrl}
          alt={company.displayName}
          style={{
            maxWidth: 90,
            maxHeight: ((maxHeight ?? 110) * company.maxLogoSize) / 100,
          }}
        />
      </div>
      <div className="offers-count-wrapper">
        <div className="offers-count">
          <div className="offers-count-background app-flex">
            <div className="offers-count-background-separate-layer" />
          </div>
          <div className="offers-count-value">
            <span>x{company.offersCountTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
