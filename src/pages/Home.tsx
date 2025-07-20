import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'

// Keyframes (moved from global for component-specific use)
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
  overflow: hidden;
`

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  position: relative;
  z-index: 10;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`

const LogoContainer = styled.div`
  margin-bottom: 2rem;
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
  margin-bottom: 1rem;
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
  height: 500px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: visible;
  touch-action: pan-y;
  perspective: 1200px;
  perspective-origin: center 80%;
`

const NavButton = styled.button`
  position: absolute;
  bottom: 8rem;
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
  bottom: 80px;
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
  margin-top: 4rem;
  text-align: center;
  max-width: 42rem;
  padding: 0 1rem;
  @media (max-width: 768px) {
    margin-top: 2rem;
  }
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
  & > div {
    position: absolute;
    border-radius: 50%;
    filter: blur(3rem);
  }
`

// Center Item Effects
const FloatingGlowEffect = styled.div<{ isActive: boolean }>`
  position: absolute;
  inset: 0;
  border-radius: 0.5rem;
  background: linear-gradient(45deg, transparent, rgba(255, 107, 53, 0.4), transparent);
  animation: ${({ isActive }) => (isActive ? 'pulse 1s' : 'pulse 2s')} ease-in-out infinite
    alternate;
`

const RotatingGlowRing = styled.div<{
  isActive: boolean
  reverse?: boolean
  inset: string
  duration: number
  color: string
  shadow: string
}>`
  position: absolute;
  inset: ${({ inset }) => inset};
  border-radius: 0.5rem;
  border: 2px solid ${({ color }) => color};
  box-shadow: ${({ shadow }) => shadow};
  animation: ${({ isActive, reverse, duration }) =>
    `${reverse ? 'spin-reverse' : 'spin'} ${isActive ? duration / 2 : duration}s linear infinite`};
`

const MovieTitleAbove = styled.div`
  position: absolute;
  top: -6rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
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
    top: -4rem;
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

const ParticlesContainer = styled.div`
  position: absolute;
  inset: -4rem;
  pointer-events: none;
  @media (max-width: 768px) {
    inset: -3rem;
  }
`

const Particle = styled.div<{ delay: number; duration: number; left: string; top: string }>`
  position: absolute;
  width: 0.5rem;
  height: 0.5rem;
  background-color: #ff9966;
  border-radius: 50%;
  opacity: 0.6;
  left: ${({ left }) => left};
  top: ${({ top }) => top};
  animation: float ${({ duration }) => duration}s ease-in-out infinite ${({ delay }) => delay}s;
  @media (max-width: 768px) {
    width: 0.375rem;
    height: 0.375rem;
  }
`

const SpeedIndicatorPing = styled.div`
  position: absolute;
  inset: -5rem;
  border: 2px solid rgba(255, 153, 102, 0.3);
  border-radius: 0.5rem;
  animation: ${pingAnimation} 1s cubic-bezier(0, 0, 0.2, 1) infinite;
  @media (max-width: 768px) {
    inset: -4rem;
  }
`

const NonCenterHoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  border-radius: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  h3 {
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    text-align: center;
  }
  div {
    width: 4rem;
    height: 2px;
    background-color: #ff9966;
    margin-top: 0.5rem;
  }
  @media (max-width: 768px) {
    padding: 0.5rem;
    h3 {
      font-size: 0.75rem;
    }
    div {
      width: 3rem;
    }
  }
`

const PosterWrapper = styled.div`
  position: relative;
  &:hover ${NonCenterHoverOverlay} {
    opacity: 1;
  }
`

const SelectionIndicator = styled.div<{ isActive: boolean }>`
  position: absolute;
  bottom: -2.5rem;
  left: 50%;
  transform: translateX(-50%);
  div {
    width: 1.25rem;
    height: 1.25rem;
    background: linear-gradient(to right, #ff9966, #ff5e62);
    border-radius: 50%;
    box-shadow:
      0 0 20px #ff6b35,
      0 0 40px #ff6b35;
    animation: ${({ isActive }) => (isActive ? 'bounce 1s' : 'bounce 2s')} infinite;
  }
  @media (max-width: 768px) {
    bottom: -2rem;
    div {
      width: 1rem;
      height: 1rem;
    }
  }
`

export default function Component() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isSwiping, setIsSwiping] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>(null)
  const lastScrollTime = useRef(0)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchStartTime = useRef(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const movies = [
    {
      id: 1,
      title: 'Pulp Fiction',
      // 펄프 픽션 (1994)
      poster: 'https://image.tmdb.org/t/p/w342/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg',
    },
    {
      id: 2,
      title: 'The Godfather',
      // 대부 (1972)
      poster: 'https://image.tmdb.org/t/p/w342/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    },
    {
      id: 3,
      title: 'Casablanca',
      // 카사블랑카 (1942)
      poster: 'https://image.tmdb.org/t/p/w342/oyGRZVIthHJjc98ekKpeWpDh8Ws.jpg',
    },
    {
      id: 4,
      title: 'Citizen Kane',
      // 시민 케인 (1941)
      poster: 'https://image.tmdb.org/t/p/w342/sav0jxhqiH0bPr2vZFU0Kjt2nZL.jpg',
    },
    {
      id: 5,
      title: 'Vertigo',
      // 현기증 (1958)
      poster: 'https://image.tmdb.org/t/p/w342/qFbuT4BhuLvN7Zj4yCJ8Im80mNP.jpg',
    },
    {
      id: 6,
      title: 'Sunset Boulevard',
      // 선셋 대로 (1950)
      poster: 'https://image.tmdb.org/t/p/w342/sC4Dpmn87oz9AuxZ15Lmip0Ftgr.jpg',
    },
    {
      id: 7,
      title: 'Goodfellas',
      // 굿펠라스 (1990)
      poster: 'https://image.tmdb.org/t/p/w342/kct4oTX7j2DuOP2sE2nPwIJ80Zr.jpg',
    },
    {
      id: 8,
      title: 'Apocalypse Now',
      // 지옥의 묵시록 (1979)
      poster: 'https://image.tmdb.org/t/p/w342/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg',
    },
    {
      id: 9,
      title: 'The Shining',
      // 샤이닝 (1980)
      poster: 'https://image.tmdb.org/t/p/w342/xazWoLealQwEgqZ89MLZklLZD3k.jpg',
    },
    {
      id: 10,
      title: 'Taxi Driver',
      // 택시 드라이버 (1976)
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
  }, [movies.length])

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
  }, [movies.length])

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
        </LogoContainer>

        <ControlHints>
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
              alignItems: 'flex-end',
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
              const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 280 : 380
              let translateX, translateY, translateZ, rotateY, scale, opacity
              if (isCenter) {
                translateX = 0
                translateY = typeof window !== 'undefined' && window.innerWidth < 768 ? -200 : -280
                translateZ = typeof window !== 'undefined' && window.innerWidth < 768 ? 100 : 150
                rotateY = 0
                scale = typeof window !== 'undefined' && window.innerWidth < 768 ? 1.2 : 1.5
                opacity = 1
              } else if (absOffset <= 3) {
                translateX = Math.sin(angle) * radius
                translateY = -30 + Math.abs(Math.cos(angle)) * 40
                translateZ =
                  Math.cos(angle) *
                  (typeof window !== 'undefined' && window.innerWidth < 768 ? 80 : 120)
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
                      width={typeof window !== 'undefined' && window.innerWidth < 768 ? 160 : 200}
                      height={typeof window !== 'undefined' && window.innerWidth < 768 ? 240 : 300}
                      isCenter={isCenter}
                      isActive={isActive}
                    />
                    {isCenter && (
                      <>
                        {/* <FloatingGlowEffect isActive={isActive} />
                        <RotatingGlowRing
                          isActive={isActive}
                          inset="-1.5rem"
                          duration={10}
                          color="rgba(255,107,53,0.7)"
                          shadow="0 0 40px rgba(255,107,53,0.8), inset 0 0 40px rgba(255,107,53,0.3)"
                        />
                        <RotatingGlowRing
                          isActive={isActive}
                          inset="-3rem"
                          duration={15}
                          color="rgba(255,0,0,0.5)"
                          shadow="0 0 60px rgba(255,0,0,0.5)"
                          reverse
                        /> */}
                        <MovieTitleAbove>
                          <h3>{movie.title}</h3>
                          <div className="divider" />
                          <div className="featuring">★ NOW FEATURING ★</div>
                        </MovieTitleAbove>
                        <SpotlightBeam isActive={isActive} />
                        {/* <ParticlesContainer>
                          {[...Array(6)].map((_, i) => (
                            <Particle
                              key={i}
                              left={`${20 + i * 15}%`}
                              top={`${10 + (i % 2) * 80}%`}
                              duration={isActive ? 1.5 + i * 0.2 : 3 + i * 0.5}
                              delay={isActive ? i * 0.2 : i * 0.5}
                            />
                          ))}
                        </ParticlesContainer> */}
                        {/* {isActive && <SpeedIndicatorPing />}
                        <SelectionIndicator isActive={isActive}>
                          <div />
                        </SelectionIndicator> */}
                      </>
                    )}
                    {/* {!isCenter && (
                      <NonCenterHoverOverlay>
                        <h3>{movie.title}</h3>
                        <div />
                      </NonCenterHoverOverlay>
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
        </MovieInfoSection>

        <AmbientLight>
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
      </MainContent>
    </PageWrapper>
  )
}
