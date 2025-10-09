import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

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

interface ApplicationsChartProps {
  data: { name: string; count: number }[];
}

export const ApplicationsChart = ({ data }: ApplicationsChartProps) => {
  const applicationConfig = {
    count: {
      label: 'count',
      color: '#000',
    },
  };

  return (
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
      <CardContent>
        <ChartContainer config={applicationConfig}>
          <BarChart
            accessibilityLayer
            data={data}
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
              fontSize={10}
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
  );
};
