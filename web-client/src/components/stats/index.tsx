import { Navigate, Route, Routes } from 'react-router-dom';
import { StatsPage } from './stats-page';
import { StatsType } from 'src/utils/constants';

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
