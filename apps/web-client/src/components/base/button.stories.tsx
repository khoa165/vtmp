import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '#vtmp/web-client/components/base/button';

const meta = {
  component: Button,
  title: 'VTMP / Button',
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TailwindDefaultButton: Story = {
  args: {
    variant: 'default',
    children: 'Submit',
  },
};

export const TailwindDestructiveButton: Story = {
  args: {
    variant: 'destructive',
    children: 'Submit',
  },
};

export const TailwindOutlineButton: Story = {
  args: {
    variant: 'outline',
    children: 'Submit',
  },
};

export const VTMPGradientButton: Story = {
  args: {
    variant: 'gradient',
    children: 'Submit',
  },
};

export const VTMPPinkButton: Story = {
  args: {
    variant: 'pink',
    children: 'Submit',
  },
};

export const VTMPOrangeButton: Story = {
  args: {
    variant: 'orange',
    children: 'Submit',
  },
};
