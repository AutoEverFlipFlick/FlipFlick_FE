// src/components/common/RatingCard.tsx
import styled from 'styled-components'
import BaseContainer from '@/components/common/BaseContainer'
import React, { useState } from 'react'
import { DefaultRating } from '@/components/starRating/DefaultRating'

type RatingCardProps = {
  title: string
  rating: null | undefined | number
  size?: number // MUI 기준: small | medium | large
  editable?: boolean
  onRate?: (value: number | null | undefined) => void
}

const CardContainer = styled(BaseContainer)`
  min-width: 300px;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Title = styled.p`
  margin-top: 10px;
  font-size: 20px;
  font-weight: 600;
  color: white;
`

const RatingCard: React.FC<RatingCardProps> = ({
  title,
  rating,
  size = 24,
  editable = false,
  onRate,
}) => {
  const [localRating, setLocalRating] = useState<number | null | undefined>(rating)

  // MUI Rating size 대응
  const getMUISize = (): 'small' | 'medium' | 'large' => {
    if (size <= 20) return 'small'
    if (size <= 30) return 'medium'
    return 'large'
  }

  return (
    <CardContainer>
      <DefaultRating
        value={localRating}
        precision={editable ? 0.5 : 0.1} // 편집 가능 여부에 따라 소수점 조정
        roundTo={editable ? 0.5 : 0.1} // 편집 가능 여부에 따라 반올림 단위 조정
        size={getMUISize()}
        readOnly={!editable}
        onChange={(e, newValue) => {
          if (newValue !== null) {
            setLocalRating(newValue)
            onRate?.(newValue)
          }
        }}
      />
      <Title>
        {title}
        {!editable && `: ${localRating?.toFixed(1)} / 5.0`}
        {editable && `: ${localRating?.toFixed(1)} / 5.0`}
      </Title>
    </CardContainer>
  )
}

export default RatingCard
