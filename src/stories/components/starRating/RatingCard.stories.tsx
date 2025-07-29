// src/components/starRating/RatingCard.stories.tsx
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import RatingCard from '@/components/starRating/RatingCard'

const meta: Meta<typeof RatingCard> = {
  title: 'components/StarRating/RatingCard',
  component: RatingCard,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof RatingCard>

export const StaticRating: Story = {
  args: {
    title: '전체 평점',
    rating: 4.2,
    editable: false,
  },
}

export const EditableRating: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.rating ?? 3.0)

    return (
      <RatingCard
        {...args}
        rating={value}
        editable={true}
        onRate={(val) => setValue(val)}
        title="나의 평점"
      />
    )
  },
  args: {
    rating: 3.0,
  },
}
