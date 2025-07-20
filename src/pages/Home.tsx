'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'

// Keyframes
const pulseAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`
const pingAnimation = keyframes`
  75%, 100% {
    transform: scale(1.2);
    opacity: 0;
  }
`

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden; /* 가로 스크롤 방지 */
`

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  position: relative;
  z-index: 10;
  flex-shrink: 0; /* Nav 높이가 줄어들지 않도록 설정 */
`

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const TrafficLight = styled.div<{ color: string }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`

const NavRight = styled.div`
  display: flex;
  gap: 2rem;
`

const NavLink = styled.a`
  color: #fff;
  transition: color 0.3s;
  &:hover {
    color: #ff9966;
  }
`

const MainContent = styled.main`
  flex-grow: 1; /* 남은 공간을 모두 차지하도록 설정 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 수직 중앙 정렬 */
  padding: 1rem 2rem;
  gap: 1rem; /* 요소들 사이의 간격 추가 */
`

const LogoContainer = styled.div`
  position: relative;
`

const LogoText = styled.div`
  font-size: 3.75rem;
  font-weight: bold;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  background-image: linear-gradient(to right, #ff9966, #ff5e62);
  position: relative;
  z-index: 10;
  text-shadow:
    0 0 5px #ff6b35,
    0 0 10px #ff6b35,
    0 0 15px #ff6b35,
    0 0 20px #ff6b35,
    0 0 35px #ff6b35,
    0 0 40px #ff6b35;
  font-family: serif;
`

const NeonBorder = styled.div`
  position: absolute;
  inset: -1rem;
  border: 2px solid #ff6b35;
  border-radius: 9999px;
  opacity: 0.6;
  box-shadow:
    0 0 10px #ff6b35,
    inset 0 0 10px #ff6b35;
`

const ControlHints = styled.div`
  text-align: center;
  color: #ffcc99;
  font-size: 0.875rem;
  animation: ${pulseAnimation} 2s infinite alternate;
`

const HintSpan = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`
const MobileHintSpan = styled.span`
  @media (min-width: 769px) {
    display: none;
  }
`

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 550px; /* 세로 공간을 조금 더 확보 */
  display: flex;
  align-items: center; /* 수직 중앙 정렬로 변경 */
  justify-content: center;
  overflow: visible;
  touch-action: pan-y;
  perspective: 1200px;
  perspective-origin: center 50%; /* perspective 원점을 중앙으로 변경 */
`

const NavButton = styled.button`
  position: absolute;
  top: 50%; /* 수직 중앙으로 이동 */
  transform: translateY(-50%); /* 정확한 중앙 정렬 */
  z-index: 30;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  padding: 1rem;
  transition: all 0.3s;
  border: 1px solid rgba(255, 107, 53, 0.3);
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 107, 53, 0.7);
  }
  &.left {
    left: 2rem;
  }
  &.right {
    right: 2rem;
  }
  @media (max-width: 768px) {
    padding: 0.75rem;
    &.left {
      left: 1rem;
    }
    &.right {
      right: 1rem;
    }
  }
`

const CarouselItemWrapper = styled.div<{
  transform: string
  opacity: number
  zIndex: number
  transitionDuration: string
}>`
  position: absolute;
  cursor: pointer;
  /* bottom 속성 제거, CarouselContainer의 정렬에 맡김 */
  transform-style: preserve-3d;
  will-change: transform, opacity;
  transition: all ${({ transitionDuration }) => transitionDuration}
    cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: ${({ transform }) => transform};
  opacity: ${({ opacity }) => opacity};
  z-index: ${({ zIndex }) => zIndex};
`

const PosterImage = styled.img<{ isCenter: boolean; isActive: boolean }>`
  border-radius: 0.5rem;
  box-shadow: ${({ isCenter }) =>
    isCenter
      ? `0 0 80px rgba(255, 107, 53, 1), 0 0 160px rgba(255, 107, 53, 0.8), 0 60px 120px rgba(0, 0, 0, 0.9)`
      : `0 25px 50px rgba(0, 0, 0, 0.8), 0 15px 30px rgba(0, 0, 0, 0.6)`};
  transform-style: preserve-3d;
  filter: ${({ isActive, isCenter }) => (isActive && !isCenter ? 'blur(1px)' : 'none')};
`

const MovieInfoSection = styled.section`
  text-align: center;
  max-width: 42rem;
  padding: 0 1rem;
  flex-shrink: 0; /* MovieInfoSection 높이가 줄어들지 않도록 설정 */
`

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #ff9966;
  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
`

const MovieTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`

const MovieDescription = styled.p`
  color: #d1d5db;
  line-height: 1.625;
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

const AmbientLight = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1; /* 다른 콘텐츠 뒤로 보내기 */
  & > div {
    position: absolute;
    border-radius: 50%;
    filter: blur(3rem);
  }
`

const MovieTitleAbove = styled.div`
  position: absolute;
  bottom: 105%; /* 포스터 바로 위로 위치 조정 */
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 100%;
  h3 {
    font-size: 2.25rem;
    font-weight: bold;
    color: white;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
  div.divider {
    width: 8rem;
    height: 2px;
    background: linear-gradient(to right, #ff9966, #ff5e62, #ff9966);
    margin: 0 auto;
    border-radius: 9999px;
  }
  div.featuring {
    margin-top: 1rem;
    font-size: 0.875rem;
    color: #ffcc99;
    animation: ${pulseAnimation} 2s infinite;
  }
  @media (max-width: 768px) {
    h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    div.divider {
      width: 6rem;
    }
    div.featuring {
      font-size: 0.75rem;
      margin-top: 0.5rem;
    }
  }
`

const SpotlightBeam = styled.div<{ isActive: boolean }>`
  position: absolute;
  inset: -6rem;
  border-radius: 50%;
  opacity: 0.25;
  background: radial-gradient(
    circle,
    rgba(255, 107, 53, 0.8) 0%,
    rgba(255, 107, 53, 0.3) 40%,
    transparent 70%
  );
  animation: ${({ isActive }) => (isActive ? 'pulse 2s' : 'pulse 4s')} ease-in-out infinite
    alternate;
  @media (max-width: 768px) {
    inset: -4rem;
  }
`

const PosterWrapper = styled.div`
  position: relative;
`

export default function Component() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isSwiping, setIsSwiping] = useState(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScrollTime = useRef(0)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchStartTime = useRef(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768)
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const movies = [
    {
      id: 1,
      title: 'Pulp Fiction',
      poster: 'https://image.tmdb.org/t/p/w342/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg',
    },
    {
      id: 2,
      title: 'The Godfather',
      poster: 'https://image.tmdb.org/t/p/w342/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    },
    {
      id: 3,
      title: 'Casablanca',
      poster: 'https://image.tmdb.org/t/p/w342/oyGRZVIthHJjc98ekKpeWpDh8Ws.jpg',
    },
    {
      id: 4,
      title: 'Citizen Kane',
      poster: 'https://image.tmdb.org/t/p/w342/sav0jxhqiH0bPr2vZFU0Kjt2nZL.jpg',
    },
    {
      id: 5,
      title: 'Vertigo',
      poster: 'https://image.tmdb.org/t/p/w342/qFbuT4BhuLvN7Zj4yCJ8Im80mNP.jpg',
    },
    {
      id: 6,
      title: 'Sunset Boulevard',
      poster: 'https://image.tmdb.org/t/p/w342/sC4Dpmn87oz9AuxZ15Lmip0Ftgr.jpg',
    },
    {
      id: 7,
      title: 'Goodfellas',
      poster: 'https://image.tmdb.org/t/p/w342/kct4oTX7j2DuOP2sE2nPwIJ80Zr.jpg',
    },
    {
      id: 8,
      title: 'Apocalypse Now',
      poster: 'https://image.tmdb.org/t/p/w342/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg',
    },
    {
      id: 9,
      title: 'The Shining',
      poster: 'https://image.tmdb.org/t/p/w342/xazWoLealQwEgqZ89MLZklLZD3k.jpg',
    },
    {
      id: 10,
      title: 'Taxi Driver',
      poster: 'https://image.tmdb.org/t/p/w342/ekstpH614fwDX8DUln1a2Opz0N8.jpg',
    },
  ] as const

  const nextMovie = () => setCurrentIndex(prev => (prev + 1) % movies.length)
  const prevMovie = () => setCurrentIndex(prev => (prev - 1 + movies.length) % movies.length)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!carouselRef.current || !carouselRef.current.contains(e.target as Node)) return
      e.preventDefault()
      const now = Date.now()
      if (now - lastScrollTime.current < 50) return
      lastScrollTime.current = now
      setIsScrolling(true)
      if (e.deltaY > 0) nextMovie()
      else prevMovie()
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 100)
    }
    const carouselElement = carouselRef.current
    carouselElement?.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      carouselElement?.removeEventListener('wheel', handleWheel)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!carouselRef.current || !carouselRef.current.contains(e.target as Node)) return
      const touch = e.touches[0]
      touchStartX.current = touch.clientX
      touchStartY.current = touch.clientY
      touchStartTime.current = Date.now()
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (!carouselRef.current || !carouselRef.current.contains(e.target as Node)) return
      const touch = e.touches[0]
      const deltaX = Math.abs(touch.clientX - touchStartX.current)
      const deltaY = Math.abs(touch.clientY - touchStartY.current)
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault()
        setIsSwiping(true)
      }
    }
    const handleTouchEnd = (e: TouchEvent) => {
      if (!carouselRef.current || !carouselRef.current.contains(e.target as Node)) return
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartX.current
      const deltaTime = Date.now() - touchStartTime.current
      if (Math.abs(deltaX) > 50 && deltaTime < 500) {
        setIsSwiping(true)
        if (deltaX > 0) prevMovie()
        else nextMovie()
        setTimeout(() => setIsSwiping(false), 200)
      } else {
        setIsSwiping(false)
      }
    }
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <PageWrapper>
      {/* <Nav>
        <NavLeft>
          <TrafficLight color="#ff5f56" />
          <TrafficLight color="#ffbd2e" />
          <TrafficLight color="#27c93f" />
          <span style={{ marginLeft: '1rem', color: '#9ca3af' }}>hiternet</span>
        </NavLeft>
        <NavRight>
          <NavLink href="#">HOME</NavLink>
          <NavLink href="#">REVIEWS</NavLink>
          <NavLink href="#">ABOUT</NavLink>
        </NavRight>
      </Nav> */}
      <MainContent>
        {/* <LogoContainer>
          <LogoText>Wurlitzer</LogoText>
          <NeonBorder />
        </LogoContainer> */}
        {/* <ControlHints>
          <HintSpan>🖱️ Mouse wheel</HintSpan>
          <MobileHintSpan>👆 Swipe left/right</MobileHintSpan>
          <span> or </span>
          <span>🖱️ Click buttons</span>
        </ControlHints> */}
        <CarouselContainer ref={carouselRef}>
          <NavButton className="left" onClick={prevMovie}>
            <ChevronLeft color="white" size={24} />
          </NavButton>
          <NavButton className="right" onClick={nextMovie}>
            <ChevronRight color="white" size={24} />
          </NavButton>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {movies.map((movie, index) => {
              let offset = index - currentIndex
              if (offset > movies.length / 2) offset -= movies.length
              else if (offset < -movies.length / 2) offset += movies.length
              const absOffset = Math.abs(offset)
              const isCenter = offset === 0
              const totalAngle = Math.PI * 1.2
              const anglePerStep = totalAngle / 6
              const angle = offset * anglePerStep
              const radius = isMobile ? 280 : 380
              let translateX, translateY, translateZ, rotateY, scale, opacity

              if (isCenter) {
                translateX = 0
                translateY = isMobile ? -60 : -80 // 중앙 포스터의 수직 이동량 감소
                translateZ = isMobile ? 100 : 150
                rotateY = 0
                scale = isMobile ? 1.2 : 1.5
                opacity = 1
              } else if (absOffset <= 3) {
                translateX = Math.sin(angle) * radius
                translateY = 20 + Math.abs(Math.cos(angle)) * 40 // 주변 포스터 위치 조정
                translateZ = Math.cos(angle) * (isMobile ? 80 : 120)
                rotateY = angle * (180 / Math.PI) * 0.6
                scale = Math.max(0.6, 1 - absOffset * 0.15)
                opacity = Math.max(0.4, 1 - absOffset * 0.2)
              } else {
                return null
              }
              const transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`
              const isActive = isScrolling || isSwiping
              return (
                <CarouselItemWrapper
                  key={movie.id}
                  transform={transform}
                  opacity={opacity}
                  zIndex={isCenter ? 25 : 15 - absOffset}
                  transitionDuration={isActive ? '0.2s' : '0.6s'}
                  onClick={() => setCurrentIndex(index)}
                >
                  <PosterWrapper>
                    <PosterImage
                      src={movie.poster}
                      alt={movie.title}
                      width={isMobile ? 160 : 200}
                      height={isMobile ? 240 : 300}
                      isCenter={isCenter}
                      isActive={isActive}
                      priority={isCenter}
                    />
                    {/* {isCenter && (
                      <>
                        <MovieTitleAbove>
                          <h3>{movie.title}</h3>
                          <div className="divider" />
                          <div className="featuring">★ NOW FEATURING ★</div>
                        </MovieTitleAbove>
                        <SpotlightBeam isActive={isActive} />
                      </>
                    )} */}
                  </PosterWrapper>
                </CarouselItemWrapper>
              )
            })}
          </div>
        </CarouselContainer>
        {/* <MovieInfoSection>
          <SectionTitle>Featured Movie</SectionTitle>
          <MovieTitle>{movies[currentIndex].title}</MovieTitle>
          <MovieDescription>
            Experience classic cinema in our immersive gallery. Use your mouse wheel or swipe
            left/right on mobile to quickly browse through our collection, or click the navigation
            buttons for precise control. Watch as your selected film rises from the collection to
            take center stage.
          </MovieDescription>
        </MovieInfoSection> */}
      </MainContent>
      {/* <AmbientLight>
        <div
          style={{
            top: '33.33%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '24rem',
            height: '24rem',
            backgroundColor: 'rgba(255, 107, 53, 0.1)',
          }}
        />
        <div
          style={{
            bottom: '25%',
            left: '25%',
            width: '16rem',
            height: '16rem',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
          }}
        />
        <div
          style={{
            bottom: '33.33%',
            right: '25%',
            width: '20rem',
            height: '20rem',
            backgroundColor: 'rgba(255, 255, 0, 0.1)',
          }}
        />
      </AmbientLight> */}
    </PageWrapper>
  )
}
