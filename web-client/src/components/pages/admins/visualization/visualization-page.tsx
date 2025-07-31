import React from 'react';

import { VisualizationContainer } from '#vtmp/web-client/components/pages/admins/visualization/visualization-container';
import { ErrorBoundaryWrapper } from '@/components/base/error-boundary';

export const VisualizationPage = () => {
  return (
    <div className="w-full h-full p-10">
      <div className="flex flex-col mb-4">
        <p className="text-3xl font-bold text-foreground mb-4">Visualization</p>
      </div>
      <ErrorBoundaryWrapper customText="Invitations Table">
        <VisualizationContainer />
      </ErrorBoundaryWrapper>
    </div>
  );
};
