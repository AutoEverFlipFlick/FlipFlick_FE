// src/components/common/RatingCard.tsx
import styled from 'styled-components'
import StarRating from '@/components/starRating/StarRating'
import BaseContainer from '../common/BaseContainer'

type RatingCardProps = {
  title: string
  rating: number
  size?: number
  editable?: boolean
  onRate?: (value: number) => void
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

const RatingCard: React.FC<RatingCardProps> = ({ title, rating, size = 24 }) => {
  return (
    <CardContainer>
      <StarRating rating={rating} size={size} />
      <Title>{title}{title.includes('평점') && `: ${rating.toFixed(1)} / 5.0`}</Title>
    </CardContainer>
  )
}

export default RatingCard
