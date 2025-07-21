import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import JukeboxBg from '@/assets/home/jukebox-bg.png'

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: #100806;
  display: flex;
  align-items: center;
  justify-content: center;
`

const JukeboxBackground = styled.img`
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
`

const CarouselContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  perspective: 1200px;
  perspective-origin: center 90%;
`

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 0.5rem;
  transition: all 0.3s;
  border: 1px solid rgba(255, 107, 53, 0.2);
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 107, 53, 0.5);
  }
  &.left {
    left: -1rem;
  }
  &.right {
    right: -1rem;
  }

  @media (max-width: 768px) {
    padding: 0.25rem;
    &.left {
      left: 0.2rem;
    }
    &.right {
      right: 0.2rem;
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
      ? `0 0 60px rgba(37, 9, 4, 0.9), 0 0 120px rgba(37, 9, 0, 0.7), 0 40px 80px rgba(0, 0, 0, 0.8)`
      : `0 10px 20px rgba(0, 0, 0, 0.7)`};
  transform-style: preserve-3d;
  filter: ${({ isActive, isCenter }) => (isActive && !isCenter ? 'blur(1px)' : 'none')};
`

const PosterWrapper = styled.div`
  position: relative;
`

const MovieTitleAbove = styled.div`
  position: absolute;
  bottom: 105%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 120%;
  h3 {
    font-size: 1.8rem;
    font-weight: bold;
    color: white;
    text-shadow:
      0 0 8px #ff6b35,
      0 0 12px #ff6b35,
      0 2px 4px rgba(0, 0, 0, 0.7);
  }
  @media (max-width: 1024px) {
    h3 {
      font-size: 1.5rem;
    }
  }
  @media (max-width: 768px) {
    h3 {
      font-size: 1rem;
    }
  }
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
  const jukeboxRef = useRef<HTMLImageElement>(null)
  const [carouselStyle, setCarouselStyle] = useState({})
  const [isMobile, setIsMobile] = useState(false)

  const updateLayout = useCallback(() => {
    if (jukeboxRef.current) {
      const rect = jukeboxRef.current.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      setCarouselStyle({
        width: `${rect.width * 0.68}px`,
        height: `${rect.height * 0.65}px`,
        top: `${rect.top + rect.height * 0.48}px`,
        left: `${rect.left + rect.width * 0.5}px`,
        transform: 'translate(-50%, -50%)',
      })
    }
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [updateLayout])

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
      <JukeboxBackground
        ref={jukeboxRef}
        src={JukeboxBg}
        alt="Wurlitzer Jukebox background"
        width={1000}
        height={1238}
        onLoad={updateLayout}
      />
      <CarouselContainer ref={carouselRef} style={carouselStyle}>
        <NavButton className="left" onClick={prevMovie}>
          <ChevronLeft color="white" size={isMobile ? 16 : 24} />
        </NavButton>
        <NavButton className="right" onClick={nextMovie}>
          <ChevronRight color="white" size={isMobile ? 16 : 24} />
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

            if (Math.abs(offset) > 3) {
              return null
            }

            const isCenter = offset === 0
            let translateX, translateY, translateZ, rotateY, scale, opacity

            if (isCenter) {
              translateX = 0
              translateY = isMobile ? -20 : -40
              translateZ = isMobile ? 140 : 200
              rotateY = 0
              scale = isMobile ? 1.1 : 1.3
              opacity = 1
            } else {
              const shelfY = isMobile ? 140 : 210
              const radius = isMobile ? 160 : 250
              const angle = offset * 0.55

              translateX = Math.sin(angle) * radius
              translateY = shelfY + Math.abs(Math.cos(angle)) * 15
              translateZ = Math.cos(angle) * 50 - 60
              rotateY = Math.sin(angle) * 25
              scale = 0.7
              opacity = Math.max(0.4, 1 - Math.abs(offset) * 0.2)
            }

            const transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`
            const isActive = isScrolling || isSwiping

            return (
              <CarouselItemWrapper
                key={movie.id}
                transform={transform}
                opacity={opacity}
                zIndex={isCenter ? 25 : 15 - Math.abs(offset)}
                transitionDuration={isActive ? '0.2s' : '0.6s'}
                onClick={() => setCurrentIndex(index)}
              >
                <PosterWrapper>
                  <PosterImage
                    src={movie.poster}
                    alt={movie.title}
                    width={isMobile ? 120 : 180}
                    height={isMobile ? 180 : 270}
                    isCenter={isCenter}
                    isActive={isActive}
                  />
                  {/* {isCenter && (
                    <MovieTitleAbove>
                      <h3>{movie.title}</h3>
                    </MovieTitleAbove>
                  )} */}
                </PosterWrapper>
              </CarouselItemWrapper>
            )
          })}
        </div>
      </CarouselContainer>
    </PageWrapper>
  )
}
