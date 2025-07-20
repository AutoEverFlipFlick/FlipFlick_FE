// src/pages/Home.tsx
// ───────────────────── import 구문 ─────────────────────
import React from 'react'
import styled, { keyframes } from 'styled-components'

/* ─────────── 1) 3D 캐러셀 회전 애니메이션 정의 ─────────── */
const rotateY360 = keyframes`
  from { transform: rotateY(0deg); }
  to   { transform: rotateY(360deg); }
`

/* ─────────── 2) styled‑components 정의 ─────────── */
/* 외부 래퍼 영역 */
const Slideshow = styled.section`
  margin: 0 auto;
  padding-top: 50px;
  height: 700px;
  box-sizing: border-box;
`

/* 3D 원근 효과를 주는 컨테이너 */
const Content = styled.div`
  margin: auto;
  width: 190px;
  perspective: 1000px; /* 3D 원근감 */
  position: relative;
  padding-top: 80px;
`

/* 회전하는 캐러셀 */
const Carousel = styled.div`
  width: 100%;
  position: absolute;
  float: right;
  animation: ${rotateY360} 15s infinite linear;
  transform-style: preserve-3d; /* 내부 요소 3D 유지 */

  &:hover {
    /* 마우스 오버 시 회전 정지 */
    animation-play-state: paused;
    cursor: pointer;
  }
`

/* 각 이미지 슬롯 */
const Frame = styled.figure<{ idx: number }>`
  width: 100%;
  height: 120px;
  border: 2px solid orange;
  overflow: hidden;
  position: absolute;
  box-shadow: 0 0 20px 0 black;
  border-radius: 4px;

  /* 9장을 360°에 균등 배치 → 40°씩 회전 후 Z축 이동 */
  transform: ${({ idx }) => `rotateY(${idx * 40}deg) translateZ(300px)`};
`

/* 썸네일 이미지 */
const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  image-rendering: auto;
  transition: all 300ms;

  &:hover {
    /* 호버 시 확대 */
    transform: scale(1.2);
  }
`

/* ─────────── 3) 모킹 이미지 데이터 ─────────── */
const MOCK_IMAGES: string[] = [
  'https://picsum.photos/id/1015/300/450',
  'https://picsum.photos/id/1016/300/450',
  'https://picsum.photos/id/1018/300/450',
  'https://picsum.photos/id/1024/300/450',
  'https://picsum.photos/id/1025/300/450',
  'https://picsum.photos/id/1027/300/450',
  'https://picsum.photos/id/1035/300/450',
  'https://picsum.photos/id/1037/300/450',
  'https://picsum.photos/id/1043/300/450',
]

/* ─────────── 4) 컴포넌트 구현 ─────────── */
interface HomeProps {
  images?: string[] // 옵션: 외부에서 이미지 배열을 넘길 수도 있음
}

/* Home 컴포넌트 */
const Home: React.FC<HomeProps> = ({ images = MOCK_IMAGES }) => {
  /* 최대 9장만 사용한다 */
  const list = images.slice(0, 9)

  return (
    <Slideshow>
      <Content>
        <Carousel>
          {list.map((src, i) => (
            <Frame key={i} idx={i}>
              <Thumbnail src={src} alt={`poster-${i}`} />
            </Frame>
          ))}
        </Carousel>
      </Content>
    </Slideshow>
  )
}

export default Home
