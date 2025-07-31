// src/components/starRating/DefaultRating.tsx
import React from 'react'
import Rating from '@mui/material/Rating'
import { styled } from 'styled-components'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'

export interface DefaultRatingProps {
  value: number | null
  precision?: number // 소수점 표시 단위 (기본값: 0.1)
  onChange?: (event: React.SyntheticEvent, value: number | null) => void
  roundTo?: number // 시각적으로 표시할 반올림 단위 (기본값: 0.5)
  min?: number // 최소 선택 가능한 값 (기본값: 1)
  readOnly?: boolean // 사용자 수정 가능 여부
  size?: 'small' | 'medium' | 'large'
}

const StarFull = styled(StarIcon)`
  fill: gold;
  stroke: white;
  stroke-width: 0.1;
`

const StarEmpty = styled(StarIcon)`
  stroke: white;
  stroke-width: 0.1;
  fill: transparent;
`

export const DefaultRating: React.FC<DefaultRatingProps> = ({
                                                              value,
                                                              onChange,
                                                              precision = 0.1,
                                                              roundTo = 0.1,
                                                              min = 1,
                                                              readOnly = false,
                                                              size = 'medium',
                                                            }) => {
  const roundedValue = value === null ? null : Math.round(value / roundTo) * roundTo

  return (
    <Rating
      value={roundedValue}
      precision={precision}
      readOnly={readOnly}
      size={size}
      icon={<StarFull fontSize="inherit" />}
      emptyIcon={<StarEmpty fontSize="inherit" />}
      onChange={(event, newValue) => {
        if (!readOnly) {
          const finalValue = newValue !== null && newValue < min ? min : newValue
          onChange?.(event, finalValue)
        }
      }}
    />
  )
}
