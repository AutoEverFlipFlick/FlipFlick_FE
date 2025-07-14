import React from 'react'
import styled, { css } from 'styled-components'

// 폰트 사이즈 기본 지정
const FONT_SIZES = {
  sm: '0.875rem',
  md: '1rem',
  lg: '1.25rem',
  xl: '1.7rem',
}

// 타입 정의
type FontSize = 'sm' | 'md' | 'lg' | 'xl'

const Container = styled.div<{ $fontSize?: FontSize }>`
  display: block;

  // 그림자를 보장하기 위한 최소 패딩
  padding: 3px;

  // 그림자를 보장하기 위한 최소 마진
  margin-bottom: 6px;

  // 반투명 배경을 위한 속성들
  /* background: rgba(19, 8, 3, 0.8);*/
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);

  // 테두리
  border-radius: 12px;

  // 그림자
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);

  // 텍스트 색상
  color: #fff;

  // 폰트사이즈 설정
  /* 폰트 크기 설정 */
  ${({ $fontSize = 'md' }) => css`
    font-size: ${FONT_SIZES[$fontSize]};
  `}
`

// React.HTMLAttributes<HTMLDivElement> 의 상속 이유??
// div의 기본적인 DOM 속성들을 사용하기 위해 ( className, style, onClick ) 등
interface BaseContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  fontSize?: FontSize
}

const BaseContainer: React.FC<BaseContainerProps> = ({ children, fontSize, ...props }) => {
  return (
    <Container $fontSize={fontSize} {...props}>
      {children}
    </Container>
  )
}
export default BaseContainer
