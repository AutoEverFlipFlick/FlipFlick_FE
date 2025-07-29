// src/components/starRating/StarRating.tsx
import React from 'react'
import styled from 'styled-components'
import { RoundedRating } from '@/components/starRating/RoundedRating'

type StarRatingProps = {
  rating: number // 0.0 ~ 5.0
  size?: number // icon font size
  roundTo?: number // 반올림 단위 (기본값: 0.5)
  precision?: number // 소수점 표시 단위 (기본값: 0.1)
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 20,
  roundTo = 0.5,
  precision = 0.1,
}) => {
  return (
    <Wrapper>
      <RoundedRating
        value={rating}
        readOnly
        roundTo={roundTo}
        precision={precision}
        size="small"
        sx={{
          fontSize: size,
          color: 'gold',
        }}
      />
    </Wrapper>
  )
}

export default StarRating
