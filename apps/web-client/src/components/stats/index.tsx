import { Navigate, Route, Routes } from 'react-router-dom';

import { StatsPage } from '#vtmp/web-client/components/stats/stats-page';
import { StatsType } from '#vtmp/web-client/utils/constants';

export const StatsContainer = () => {
  return (
    <Routes>
      {Object.values(StatsType).map((type) => (
        <Route
          key={type}
          path={`/${type}`}
          element={<StatsPage type={type} />}
        />
      ))}
      <Route
        path="*"
        element={<Navigate to={`/stats/${StatsType.LOGOS}`} replace />}
      />
    </Routes>
  );
};
