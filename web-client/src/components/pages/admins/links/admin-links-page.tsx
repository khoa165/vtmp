import { useState } from 'react';

import { LinkStatus } from '@vtmp/common/constants';

import { ErrorBoundaryWrapper } from '@/components/base/error-boundary';
import { AdminLinksContainer } from '@/components/pages/admins/links/admin-links-container';
import { AdminLinksStatusCards } from '@/components/pages/admins/links/admin-links-status';

export interface LinksFilter {
  status?: LinkStatus;
}

export const AdminLinksPage = () => {
  const [linksFilter, setLinksFilter] = useState<LinksFilter>({});

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-foreground mb-4">
        Review Link Board
      </h1>
      <ErrorBoundaryWrapper customText="Link Status Cards">
        <AdminLinksStatusCards setLinksFilter={setLinksFilter} />
      </ErrorBoundaryWrapper>
      <ErrorBoundaryWrapper customText="Link Table">
        <AdminLinksContainer linksFilter={linksFilter} />
      </ErrorBoundaryWrapper>
    </div>
  );
};
