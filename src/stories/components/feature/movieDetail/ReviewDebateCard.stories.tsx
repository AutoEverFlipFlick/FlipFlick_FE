import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import ReviewDebateCard from '@/components/feature/movieDetail/ReviewDebateCard'

import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from '@/styles/globalStyle'
import { theme } from '@/styles/theme'


const meta: Meta<typeof ReviewDebateCard> = {
  title: 'Common/ReviewDebateCard',
  component: ReviewDebateCard,
  tags: ['autodocs'], // 필요 시 자동 문서화
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <div style={{ backgroundColor: '--theme.colors.background' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ReviewDebateCard>

export const Default: Story = {
  args: {
    username: '홍길동',
    createdAt: '2025-07-18',
    content: '이 영화 정말 감동적이었어요! 다시 보고 싶을 정도!',
    rating: 4.5,
    likes: 12,
    comments: 3,
    isMyPost: false,
  },
}

export const MyPost: Story = {
  args: {
    username: '나 자신',
    createdAt: '2025-07-17',
    content: '내가 쓴 리뷰입니다. 수정도 하고 싶어요.',
    rating: 3.0,
    likes: 7,
    comments: 0,
    isMyPost: true,
  },
}

export const WithoutRatingAndComments: Story = {
  args: {
    username: '익명',
    createdAt: '2025-07-16',
    content: '별점이나 댓글이 없는 리뷰입니다.',
    likes: 2,
  },
}
