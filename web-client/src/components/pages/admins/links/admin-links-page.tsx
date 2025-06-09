import { useState } from 'react';

import { ErrorBoundaryWrapper } from '@/components/base/error-boundary';
import { AdminLinksContainer } from '@/components/pages/admins/links/admin-links-container';
import { AdminLinksStatusCards } from '@/components/pages/admins/links/admin-links-status';
import { LinkStatus } from '@vtmp/common/constants';

export interface LinksFilter {
  status?: LinkStatus;
}

export const AdminLinksPage = () => {
  const [linksFilter, setLinksFilter] = useState<LinksFilter>({});

  return (
    <div className="w-full px-10 min-h-screen text-white flex flex-col justify-center gap-6">
      <h1 className="text-3xl font-bold">Review Links Board</h1>
      <ErrorBoundaryWrapper customText="Link Status Cards">
        <AdminLinksStatusCards setLinksFilter={setLinksFilter} />
      </ErrorBoundaryWrapper>
      <ErrorBoundaryWrapper customText="Link Table">
        <AdminLinksContainer linksFilter={linksFilter} />
      </ErrorBoundaryWrapper>
    </div>
  );
};
