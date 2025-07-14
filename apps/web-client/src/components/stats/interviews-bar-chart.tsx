import React from 'react';
import {
  BarChart,
  Bar,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import { MergedInterviewData } from '#vtmp/web-client/types';
import { MentorshipYear } from '#vtmp/web-client/utils/constants';

interface InterviewsBarChartProps {
  data: MergedInterviewData;
}
export const InterviewsBarChart: React.FC<InterviewsBarChartProps> = ({
  data,
}) => {
  const getCount = (d, type) =>
    (d[MentorshipYear.YEAR_2023]?.[type] ?? 0) +
    (d[MentorshipYear.YEAR_2024]?.[type] ?? 0);
  return (
    <div>
      <h2 className="chart-title">
        [2023 + 2024] {data.totalInvitationsCount} invitations and{' '}
        {data.totalInterviewsCount} interviews
      </h2>
      <BarChart
        width={Math.min(1000, window.innerWidth - 10)}
        height={4000}
        data={data.data}
        className="mt-4"
        layout="vertical"
        barSize={10}
      >
        <CartesianGrid strokeDasharray="1 15" horizontal={false} />
        <XAxis type="number" tick={{ fill: '#7aa6c2' }} />
        <YAxis
          dataKey="company"
          type="category"
          textAnchor="end"
          width={125}
          tick={{ fill: '#7aa6c2' }}
        />
        <Tooltip wrapperClassName="tooltip-box" />
        <Bar
          dataKey={(d) => getCount(d, 'mixedCount')}
          fill="#d8aa96"
          name="Mixed"
          stackId="a"
        />
        <Bar
          dataKey={(d) => getCount(d, 'technicalCount')}
          fill="#c7d3bf"
          name="Technical"
          stackId="a"
        />
        <Bar
          dataKey={(d) => getCount(d, 'behavioralCount')}
          fill="#807182"
          name="Behavioral"
          stackId="a"
        />
        <Bar
          dataKey={(d) => getCount(d, 'practicalCount')}
          fill="#f7b1ab"
          name="Practical"
          stackId="a"
        />
        <Legend
          iconType="circle"
          verticalAlign="top"
          content={(props) => renderLegend({ ...props, data })}
        />
      </BarChart>
    </div>
  );
};

const renderLegend = (props) => {
  const { payload, data } = props;
  const colors = ['#d8aa96', '#c7d3bf', '#807182', '#f7b1ab'];
  const funcs = [
    (year) => data[year]?.totalMixedCount ?? 0,
    (year) => data[year]?.totalTechnicalCount ?? 0,
    (year) => data[year]?.totalBehavioralCount ?? 0,
    (year) => data[year]?.totalPracticalCount ?? 0,
  ];

  return (
    <div className="interviews-legend mb-4">
      <div className="d-flex justify-content-center">
        {payload.slice(0, 4).map((entry, index) => (
          <span
            key={`item-${index}`}
            className="mx-3"
            style={{ color: colors[index % 4] }}
          >
            {funcs[index](MentorshipYear.YEAR_2023) +
              funcs[index](MentorshipYear.YEAR_2024)}{' '}
            {data.length} {entry.value}
          </span>
        ))}
      </div>
    </div>
  );
};
