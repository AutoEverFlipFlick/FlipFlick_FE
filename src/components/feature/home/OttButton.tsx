// Next.js와 styled-components를 활용한 OTT 버튼 컴포넌트 구현
import React from 'react'
import styled from 'styled-components'

// 컴포넌트 props 타입 정의
interface OttButtonProps {
  name: string // OTT 서비스 명
  logo: string // 로고 이미지 경로
}

// 화면에서 숨기고 스크린 리더에만 노출되는 텍스트
const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`

// 버튼 자체 스타일 정의
const StyledOttButton = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1; // 정사각형 비율 유지
  background-color: #ed9d24; // 배경색 설정
  border-radius: 0.375rem; // 모서리 둥글게
  overflow: hidden; // 내부 넘침 숨기기
  border: 1px solid transparent; // 기본 테두리
  transition: all 0.2s ease-in-out; // 애니메이션 효과

  &:hover {
    border-color: #f97316; // 호버 시 테두리 색 변경
    transform: scale(1.05); // 살짝 확대
    box-shadow: 0 0 15px rgba(249, 115, 22, 0.5); // 그림자 효과
  }

  &:focus {
    outline: none; // 기본 아웃라인 제거
    box-shadow:                               // 커스텀 포커스 링 적용
      0 0 0 2px #141414,
      0 0 0 4px #f97316;
  }

  &:active {
    transform: scale(1); // 클릭 시 확대 해제
  }

  // 자식 img 요소에 호버 시 확대 효과 적용
  &:hover img {
    transform: scale(1.1);
  }
`

// 로고 이미지 스타일 정의
const LogoImage = styled.img`
  object-fit: contain; // 이미지 비율 유지
  width: 2.5rem; // 기본 크기
  height: 2.5rem;
  transition: transform 0.2s ease-in-out; // 애니메이션 효과

  @media (min-width: 640px) {
    width: 3rem; // 작은 화면 이상 크기 조정
    height: 3rem;
  }
`

// OTT 버튼 컴포넌트 구현
export default function OttButton({ name, logo }: OttButtonProps) {
  return (
    <StyledOttButton target="_blank" rel="noopener noreferrer">
      <SrOnly>{name}</SrOnly> {/* 스크린 리더용 텍스트 */}
      <LogoImage src={logo || '/placeholder.svg'} alt={`${name} Logo`} width={64} height={64} />
    </StyledOttButton>
  )
}
