import { Navigate, Route, Routes } from 'react-router-dom';
import { PeoplePage } from 'src/components/people/people-page';

export const PeopleContainer = () => {
  return (
    <Routes>
      {['all' as const, 2025, 2024, 2023].map((year) => (
        <Route
          key={year}
          path={`/${year}`}
          element={<PeoplePage year={year} />}
        />
      ))}
      <Route path="*" element={<Navigate to="/people/2025" replace />} />
    </Routes>
  );
};
