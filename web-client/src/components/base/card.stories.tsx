import type { Meta, StoryObj } from '@storybook/react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/base/card';
import { Button } from '@/components/base/button';

const meta = {
  component: Card,
  subcomponents: {
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    Button,
  },
  render: (args) => (
    <Card className="w-[600px]" {...args}>
      <CardHeader>
        <CardTitle>Viet Tech Mentorship</CardTitle>
        <CardDescription>
          Growing a community of Vietnamese early career tech talents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="ml-6 list-disc [&>li]:mt-2">
          <li>Dedicated 1-1 mentorship with experienced mentors</li>
          <li>Super-charged learning through group project</li>
          <li>
            Close-knit and inclusive community of career-driven individuals
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant='pink'>Join now</Button>
      </CardFooter>
    </Card>
  ),
  title: 'VTMP / Card',
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TailwindDefaultCard: Story = {};
