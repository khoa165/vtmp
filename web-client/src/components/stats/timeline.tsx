import moment from 'moment';
import React, { useMemo } from 'react';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line,
  Tooltip,
  ReferenceLine,
} from 'recharts';

import { MergedDateWithCount } from '#vtmp/web-client/types';
import { MentorshipYear } from '#vtmp/web-client/utils/constants';
import { getDatesWithCountOffers } from '#vtmp/web-client/utils/parse';

interface TimelineProps {
  datesWithCount: MergedDateWithCount[];
}
export const Timeline: React.FC<TimelineProps> = ({ datesWithCount }) => {
  const offersCount = useMemo(() => getDatesWithCountOffers(), []);
  const countEverything = useMemo(
    () =>
      offersCount.map((oc, i) => {
        return {
          date: oc.date,
          oc,
          ic: datesWithCount[i],
        };
      }),
    [offersCount, datesWithCount]
  );

  const today = moment().format('MMM DD');
  return (
    <div className="mt-5">
      <h2 className="chart-title">
        [2023 + 2024] Offers & interviews timeline
      </h2>
      <LineChart
        width={Math.min(1200, window.innerWidth - 10)}
        height={600}
        data={countEverything}
        margin={{ top: 20 }}
        className="mt-4"
      >
        <CartesianGrid strokeDasharray="1 15" vertical={false} />
        <Tooltip wrapperClassName="tooltip-box" label={(dc) => dc} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => d.split(',')[0]}
          minTickGap={50}
          tick={{ fill: '#7aa6c2' }}
        />
        <YAxis
          yAxisId="offers"
          label={{
            value: 'Offers',
            angle: -90,
            position: 'insideLeft',
            fill: '#7aa6c2',
          }}
          tick={{ fill: '#7aa6c2' }}
        />
        <YAxis
          yAxisId="interviews"
          label={{
            value: 'Interviews',
            angle: 90,
            position: 'insideRight',
            fill: '#7aa6c2',
          }}
          orientation="right"
          tick={{ fill: '#7aa6c2' }}
        />
        <Legend />
        <Line
          name="Offers 2023"
          yAxisId="offers"
          dataKey={(d) => d.oc?.[MentorshipYear.YEAR_2023]}
          dot={false}
          stroke="#6aaa96"
          legendType="plainline"
        />

        <Line
          name="Offers 2024"
          yAxisId="offers"
          dataKey={(d) => d.oc?.[MentorshipYear.YEAR_2024]}
          dot={false}
          stroke="#dfa06e"
          legendType="plainline"
        />
        <Line
          name="Interviews 2023"
          yAxisId="interviews"
          dataKey={(d) => d.ic?.[MentorshipYear.YEAR_2023]}
          dot={false}
          stroke="#6aaa96"
          legendType="plainline"
          strokeDasharray="7 10"
        />
        <Line
          name="Interviews 2024"
          yAxisId="interviews"
          dataKey={(d) => d.ic?.[MentorshipYear.YEAR_2024]}
          dot={false}
          stroke="#dfa06e"
          legendType="plainline"
          strokeDasharray="7 10"
        />
        <ReferenceLine
          yAxisId="offers"
          x={today}
          stroke="#7aa6c2"
          label={{ value: 'Today', position: 'top' }}
        />
      </LineChart>
    </div>
  );
};
