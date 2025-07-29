// src/stories/RoundedRating.stories.tsx
import React, { useState, useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RoundedRating, RoundedRatingProps } from '@/components/starRating/RoundedRating'

const meta: Meta<typeof RoundedRating> = {
  title: 'components/Rating/RoundedRating',
  component: RoundedRating,
  argTypes: {
    value: { control: { type: 'number' } },
    roundTo: { control: { type: 'number' } },
    precision: { control: { type: 'number' } },
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
  },
}
export default meta

type Story = StoryObj<typeof RoundedRating>

const ControlledTemplate = (args: RoundedRatingProps) => {
  const [value, setValue] = useState<number | null>(args.value ?? 3.5)

  // 외부 컨트롤러 값이 바뀌면 반영
  useEffect(() => {
    setValue(args.value ?? 3.5)
  }, [args.value])

  return (
    <div style={{ padding: 24 }}>
      <RoundedRating
        {...args}
        value={value}
        onChange={(e, newVal) => setValue(newVal)}
      />
      <p style={{ marginTop: 12 }}>현재 선택한 점수: <strong>{value}</strong></p>
    </div>
  )
}

export const WithControls: Story = {
  args: {
    value: 3.5,
    roundTo: 0.5,
    precision: 0.1,
    min: 1,
    max: 5,
  },
  render: ControlledTemplate,
}
