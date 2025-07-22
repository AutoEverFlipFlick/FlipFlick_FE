import React from 'react'
import styled from 'styled-components'

// 팝콘 이미지들 (src/assets/popcorn 폴더)
import popcornMachine from '@/assets/popcorn/popcorn8.png'
import popcornFull from '@/assets/popcorn/popcorn7.png'
import popcorn23 from '@/assets/popcorn/popcorn6.png'
import popcorn13 from '@/assets/popcorn/popcorn5.png'
import popcornEmpty from '@/assets/popcorn/popcorn4.png'
import corn3 from '@/assets/popcorn/popcorn3.png'
import corn2 from '@/assets/popcorn/popcorn2.png'
import corn1 from '@/assets/popcorn/popcorn1.png'

const popcornImages = {
  machine: popcornMachine, // 팝콘기계 (81+)
  full: popcornFull, // 1 팝콘 (71-80)
  twoThird: popcorn23, // 2/3 팝콘 (61-70)
  oneThird: popcorn13, // 1/3 팝콘 (51-60)
  empty: popcornEmpty, // 빈 팝콘 (41-50)
  corn3: corn3, // 옥수수 3 (31-40)
  corn2: corn2, // 옥수수 2 (21-30)
  corn1: corn1, // 옥수수 1 (0-20)
}

const PopcornIconWrapper = styled.div<{ size?: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || 24}px;
  height: ${props => props.size || 24}px;
`

const PopcornImage = styled.img<{ size?: number }>`
  width: ${props => props.size || 24}px;
  height: ${props => props.size || 24}px;
  object-fit: contain;
`

interface PopcornIconProps {
  score: number
  size?: number
  showText?: boolean
}

const getPopcornLevel = (score: number): { image: string; text: string } => {
  if (score >= 81) return { image: popcornImages.machine, text: '팝콘기계' }
  if (score >= 71) return { image: popcornImages.full, text: '1 팝콘' }
  if (score >= 61) return { image: popcornImages.twoThird, text: '2/3 팝콘' }
  if (score >= 51) return { image: popcornImages.oneThird, text: '1/3 팝콘' }
  if (score >= 41) return { image: popcornImages.empty, text: '빈 팝콘' }
  if (score >= 31) return { image: popcornImages.corn3, text: '옥수수 3' }
  if (score >= 21) return { image: popcornImages.corn2, text: '옥수수 2' }
  return { image: popcornImages.corn1, text: '옥수수 1' }
}

const PopcornIcon: React.FC<PopcornIconProps> = ({ score, size = 24, showText = false }) => {
  const { image, text } = getPopcornLevel(score)

  return (
    <PopcornIconWrapper size={size}>
      <PopcornImage src={image} alt={text} size={size} title={`${text} (${score}점)`} />
    </PopcornIconWrapper>
  )
}

export default PopcornIcon
