// src/stories/components/starRating/StarRatingSingle.stories.tsx

import { Meta, StoryObj } from '@storybook/react';
import StarRatingSingle from '@/components/starRating/StarRatingSingle';

const meta: Meta<typeof StarRatingSingle> = {
  title: 'Components/StarRating/StarRatingSingle',
  component: StarRatingSingle,
  tags: ['autodocs'],
  argTypes: {
    fillRatio: {
      control: { type: 'range', min: 0, max: 100, step: 10 },
    },
    size: {
      control: { type: 'number' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof StarRatingSingle>;

export const Default: Story = {
  args: {
    fillRatio: 50,
    size: 40,
  },
};
