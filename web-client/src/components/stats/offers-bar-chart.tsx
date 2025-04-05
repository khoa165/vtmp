import React from 'react';
import { BarChart, Bar, Legend, XAxis, YAxis, CartesianGrid } from 'recharts';
import { min } from 'lodash';
import { offerCompanies } from 'src/data/companies';

interface OffersBarChartProps {
  count: number;
  data: {
    company: string;
    count2023: number;
    count2024: number;
  }[];
}
export const OffersBarChart: React.FC<OffersBarChartProps> = ({
  count,
  data,
}) => {
  return (
    <div>
      <h2 className="chart-title">[2023 + 2024] Number of offers: {count}</h2>
      <BarChart
        width={min([1000, window.innerWidth - 10])}
        height={1250}
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
