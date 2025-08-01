// src/components/starRating/StarRating.tsx
import React from 'react'
import styled from 'styled-components'
import { DefaultRating } from '@/components/starRating/DefaultRating'

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
  roundTo = 0.5,
  precision = 0.1,
}) => {
  return (
    <Wrapper>
      <DefaultRating
        value={rating}
        readOnly
        roundTo={roundTo}
        precision={precision}
        size="small"
      />
    </Wrapper>
  )
}

export default StarRating
