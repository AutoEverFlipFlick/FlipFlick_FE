import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { DefaultRating, DefaultRatingProps } from '@/components/starRating/DefaultRating'

const meta: Meta<typeof DefaultRating> = {
  title: 'Components/StarRating/DefaultRating',
  component: DefaultRating,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 5, step: 0.1 },
    },
    precision: {
      control: { type: 'number', min: 0.1, max: 1, step: 0.1 },
    },
    roundTo: {
      control: { type: 'number', min: 0.1, max: 1, step: 0.1 },
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
    },
    readOnly: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof DefaultRating>

/**
 * 사용자가 직접 조작 가능한 인터랙티브 스토리
 */
export const Interactive: Story = {
  args: {
    value: 3.5,
    precision: 0.5,
    roundTo: 0.5,
    min: 1.0,
    size: 'large',
    readOnly: false,
  },
  render: (args: DefaultRatingProps) => {
    function Wrapper() {
      const [rating, setRating] = useState<number | null | undefined>(args.value)

      return (
        <div style={{ background: '#222', padding: '2rem', color: 'white' }}>
          <DefaultRating {...args} value={rating} onChange={(e, newValue) => setRating(newValue)} />
          <div style={{ marginTop: '1rem' }}>현재 별점: {rating}</div>
        </div>
      )
    }

    return <Wrapper />
  },
}

/**
 * 읽기 전용 별점
 */
export const ReadOnly: Story = {
  args: {
    value: 4.3,
    readOnly: true,
    size: 'large',
    precision: 0.1,
    roundTo: 0.1,
  },
  render: (args: DefaultRatingProps) => {
    function Wrapper() {
      const [rating, setRating] = useState<number | null | undefined>(args.value)

      return (
        <div style={{ background: '#222', padding: '2rem', color: 'white' }}>
          <DefaultRating {...args} value={rating} onChange={(e, newValue) => setRating(newValue)} />
          <div style={{ marginTop: '1rem' }}>현재 별점: {rating}</div>
        </div>
      )
    }
    return <Wrapper />
  },
}

/**
 * 커스텀 스타일 테스트용
 */
export const CustomStyle: Story = {
  args: {
    value: 1.7,
    size: 'medium',
    precision: 0.1,
    readOnly: false,
    roundTo: 0.5,
  },
  render: (args: DefaultRatingProps) => (
    <div style={{ background: '#111', padding: '2rem', color: '#fff' }}>
      <DefaultRating {...args} />
      <div style={{ marginTop: '0.5rem' }}>별점: {args.value}</div>
    </div>
  ),
}
