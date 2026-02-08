import { format } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { JobPostingsTrendByWeek } from '#vtmp/web-client/components/pages/admins/visualization/validation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/base/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/base/chart';
import { MM_DD_YY } from '@/utils/date';

interface JobPostingsChartProps {
  data: JobPostingsTrendByWeek;
}

export function JobPostingsChart({ data }: JobPostingsChartProps) {
  const trendChartConfig = {
    postings: {
      label: 'Weekly Job Postings',
      color: 'var(--chart-1)',
    },
  };

  const formattedData = data?.map((item) => ({
    ...item,
    dateRange: `${format(new Date(item.startDate), MM_DD_YY)} - ${format(
      new Date(item.endDate),
      MM_DD_YY
    )}`,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">
              Job Postings Trend
            </CardTitle>
          </div>
          <TrendingUp className="h-6 w-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={trendChartConfig}>
          <LineChart
            accessibilityLayer
            data={formattedData}
            margin={{
              left: 30,
              right: 20,
              top: 20,
              bottom: 80,
            }}
            height={200}
            width={400}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dateRange"
              tickLine={false}
              axisLine={false}
              tickMargin={16}
              fontWeight={600}
              fontSize={10}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={true}
              tickMargin={8}
              ticks={[50, 100, 150, 200]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-medium">{value}</span>
                      <span className="text-muted-foreground">postings</span>
                    </div>
                  )}
                />
              }
            />
            <Line
              dataKey="count"
              type="linear"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{
                fill: 'var(--chart-1)',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
