import React from 'react';

interface ProgramValuesProps {
  keyword: string;
  value: string;
}
export const PrgramValues: React.FC<ProgramValuesProps> = ({
  keyword,
  value,
}) => {
  return (
    <div className="program-value-section">
      <h1>{keyword}</h1>
      <hr />
      <p>{value}</p>
    </div>
  );
};
