import { format } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';

import { useGetVisualizations } from '#vtmp/web-client/components/pages/admins/visualization/hooks/visualization';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/base/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/base/chart';
import { Skeleton } from '@/components/base/skeleton';
import { MM_DD_YY } from '@/utils/date';
import { CustomError } from '@/utils/errors';

export const VisualizationContainer = () => {
  const { isLoading, error, data: visualizationData } = useGetVisualizations();

  const chart2Data = visualizationData?.APPLICATIONS_COUNT;
  const applicationConfig = {
    count: {
      label: 'count',
      color: '#000',
    },
  } satisfies ChartConfig;

  const trendChartConfig = {
    postings: {
      label: 'Weekly Job Postings',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  const jobPostingChart = visualizationData?.JOB_POSTINGS_TREND?.map(
    (item) => ({
      ...item,
      dateRange: `${format(new Date(item.startDate), MM_DD_YY)} - ${format(new Date(item.endDate), MM_DD_YY)}`,
    })
  );
  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-between py-4">
          <Skeleton className="h-10 w-[24rem] rounded-md" />
          <Skeleton className="h-10 w-[8rem] rounded-md" />
        </div>
        <Skeleton className="h-[32rem] w-full rounded-xl" />
      </>
    );
  }
  if (error) {
    console.log(error);
    throw new CustomError('Error fetching visualization');
  }
  if (!visualizationData) {
    return (
      <p className="text-center text-muted-foreground">
        No visualization data to display.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">
                Applications Per User
              </CardTitle>
            </div>
            <TrendingUp className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="">
          <ChartContainer config={applicationConfig}>
            <BarChart
              accessibilityLayer
              data={chart2Data}
              layout="horizontal"
              margin={{
                top: 20,
                right: 20,
                bottom: 90,
              }}
              barSize={24}
              barGap={4}
              height={200}
              width={400}
            >
              <XAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={true}
                fontSize={13}
                fontWeight={600}
                tickMargin={16}
                angle={-55}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                type="number"
                dataKey="count"
                tickLine={true}
                ticks={[100, 200, 300]}
                fontSize={13}
              />
              <ChartTooltip
                cursor={{ fill: 'var(--accent)', opacity: 0.1 }}
                content={
                  <ChartTooltipContent
                    formatter={(value, _) => (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-medium">{value}</span>
                        <span className="text-muted-foreground">
                          applications
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="count"
                fill="#A3F890"
                radius={[4, 4, 0, 0]}
                barSize={15}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

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
              data={jobPostingChart}
              margin={{
                left: 50,
                right: 20,
                top: 20,
                bottom: 90,
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
    </div>
  );
};
