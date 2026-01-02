import React from 'react';
import { BarChart, Bar, Legend, XAxis, YAxis, CartesianGrid } from 'recharts';

import { offerCompanies } from '@vtmp/common/people';

interface OffersBarChartProps {
  count: number;
  data: {
    company: string;
    count2023: number;
    count2024: number;
    count2025: number;
  }[];
}
export const OffersBarChart: React.FC<OffersBarChartProps> = ({
  count,
  data,
}) => {
  return (
    <div>
      <h2 className="chart-title">
        [2023 + 2024 + 2025] Number of offers: {count}
      </h2>
      <BarChart
        width={Math.min(1000, window.innerWidth - 10)}
        height={3500}
        data={data}
        className="mt-4"
        layout="vertical"
        barSize={10}
        barGap={2}
      >
        <CartesianGrid strokeDasharray="1" horizontal={false} />
        <XAxis type="number" tick={{ fill: '#7aa6c2' }} domain={[0, 8]} />
        <YAxis
          dataKey={(d) =>
            offerCompanies[d['company']]?.displayName ?? 'INVALID!'
          }
          type="category"
          textAnchor="end"
          width={125}
          tick={{ fill: '#7aa6c2' }}
        />
        <Bar dataKey="count2023" stackId="a" fill="#6aaa96" name="VTMP 2023" />
        <Bar dataKey="count2024" stackId="a" fill="#dfa06e" name="VTMP 2024" />
        <Bar dataKey="count2025" stackId="a" fill="#807182" name="VTMP 2025" />
        <Legend
          iconType="circle"
          verticalAlign="top"
          align="right"
          chartHeight={10}
        />
      </BarChart>
    </div>
  );
};
