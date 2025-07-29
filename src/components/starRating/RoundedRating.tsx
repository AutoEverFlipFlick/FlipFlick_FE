import React from 'react'
import { Rating, RatingProps } from '@mui/material'

export interface RoundedRatingProps extends Omit<RatingProps, 'value' | 'onChange'> {
  value: number | null
  onChange?: (event: React.SyntheticEvent, value: number | null) => void
  /** 표시할 반올림 단위 (기본값: 0.5) */
  roundTo?: number
  /** 최소 선택 가능한 값 (기본값: 1) */
  min?: number
}

export const RoundedRating: React.FC<RoundedRatingProps> = ({
  value,
  onChange,
  roundTo = 0.5,
  precision = 0.1,
  min = 1,
  ...rest
}) => {
  // 시각적으로 표시할 값을 roundTo 단위로 반올림
  const roundedValue = value === null ? null : Math.round(value / roundTo) * roundTo

  return (
    <Rating
      {...rest}
      value={roundedValue}
      precision={precision}
      onChange={(event, newValue) => {
        // 최소값 필터링 적용
        const finalValue = newValue !== null && newValue < min ? min : newValue
        onChange?.(event, finalValue)
      }}
    />
  )
}
