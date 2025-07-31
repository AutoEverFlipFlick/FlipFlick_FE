// src/components/starRating/RatingCard.stories.tsx
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import RatingCard from '@/components/starRating/RatingCard'

const meta: Meta<typeof RatingCard> = {
  title: 'Components/StarRating/RatingCard',
  component: RatingCard,
  tags: ['autodocs'],
  argTypes: {
    rating: {
      control: { type: 'number', min: 0, max: 5, step: 0.1 },
    },
    editable: {
      control: 'boolean',
    },
    size: {
      control: { type: 'number', min: 16, max: 48, step: 4 },
    },
  },
}
export default meta

type Story = StoryObj<typeof RatingCard>

export const StaticRating: Story = {
  render: (args) => {
    const [value, setValue] = useState<number>(args.rating ?? 3.0)

    return (
      <RatingCard
        {...args}
        rating={value}
        onRate={(val) => setValue(val)}
      />
    )
  },
  args: {
    title: '전체 평점',
    rating: 4.2,
    editable: false,

  },
}

export const EditableRating: Story = {
  render: (args) => {
    const [value, setValue] = useState<number>(args.rating ?? 3.0)

    return (
      <RatingCard
        {...args}
        title="나의 평점"
        rating={value}
        editable={true}
        onRate={(val) => setValue(val)}
      />
    )
  },
  args: {
    rating: 3.0,

  },
}
