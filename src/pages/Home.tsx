import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import JukeboxImg from '@/assets/home/jukebox-top.webp'

import media from '@/utils/breakpoints'
import axios from 'axios'

import Wavve from '@/assets/home/wavve-seeklogo.svg'
import { Icon } from '@iconify/react'

import { topPopcorn, boxoffice } from '@/services/movie'

import { useNavigate } from 'react-router-dom'

// Styled Components
const PageWrapper = styled.div`
  width: 100vw;
  height: calc(100vh - 80px);
  overflow-y: hidden;
  overflow-x: hidden; /* 가로 스크롤 불가능하게 변경 */
  position: relative;
  background: radial-gradient(ellipse at center, #2a1a14 0%, #100806 70%);

  ${media.tablet`
    height: calc(100vh - 60px);
  `}
`

const ButtonWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;

  ${media.tablet`
    display : none;
  `}
`

const ButtonSection = styled.div`
  flex: 1 1 0;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 3;
`

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;

  ${media.notebook`
      grid-template-columns: repeat(1, 1fr);
    `}
`

const ImageSection = styled.div<{ $imgWidth?: number }>`
  width: ${({ $imgWidth = 0 }) => $imgWidth}px;
  height: 100%;
`

const JukeboxContainer = styled.div`
  position: relative;
  display: inline-block; /* 내용에 맞게 너비 조절 */
  height: calc(100vh - 80px); /* 항상 화면 높이를 꽉 채움 */
  /* min-width: 100vw; 최소 너비는 화면 너비 */
  display: flex;
  justify-content: center;
  align-items: center;

  ${media.tablet`
    height: calc(100vh - 60px);
  `}
`

const JukeboxWrapper = styled.div`
  height: 100%;
  width: auto;

  position: relative;
`

const JukeboxBackground = styled.img`
  height: 100%; /* 핵심: 높이를 100%로 고정 */
  width: auto; /* 너비는 비율에 맞게 자동 조절 */
  object-fit: contain;

  position: relative;
`

const JukeboxAbsoluteCotainer = styled.div`
  position: absolute;
  width: 100%;
  height: 13%;

  bottom: 10%;
  left: 0;

  justify-content: center;
  align-items: center;

  display: none;

  ${media.tablet`
    display: flex;
  `}

  z-index: 3;
`

const JukeAbsGrid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  grid-gap: 1rem;
  margin-top: 5%;
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

const MovieTop = styled.div`
  position: absolute; /* 절대 위치 지정 */
  top: 0.5rem; /* 상단 여백 */
  left: 0.5rem; /* 좌측 여백 */

  padding: 0.25rem 0.5rem; /* 내부 여백 */
  background-color: rgba(0, 0, 0, 0.6); /* 반투명 배경 */
  color: white; /* 글자색 */
  font-weight: 600; /* 글자 굵기 */
  font-size: 0.85rem; /* 글자 크기 */

  border-radius: 1rem; /* 둥근 직사각형 */
  border: 1px solid rgba(255, 107, 53, 0.7); /* 주황빛 테두리 */
  box-shadow: 0 0 6px rgba(255, 107, 53, 0.7); /* 네온 효과 */

  z-index: 50;
`

const PosterImage = styled.img<{ isCenter: boolean; isActive: boolean }>`
  border-radius: 0.5rem;
  box-shadow: ${({ isCenter }) =>
    isCenter
      ? `0 0 60px rgba(255, 107, 53, 0.9), 0 0 120px rgba(255, 107, 53, 0.7), 0 40px 80px rgba(0, 0, 0, 0.8)`
      : `0 10px 20px rgba(0, 0, 0, 0.7)`};
  transform-style: preserve-3d;
  filter: ${({ isActive, isCenter }) => (isActive && !isCenter ? 'blur(1px)' : 'none')};
`

const PosterWrapper = styled.div`
  position: relative;
`

const MovieTitleAbove = styled.div`
  position: absolute;
  bottom: 95%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 500%;
  white-space: nowrap;

  h3 {
    font-size: 1.8rem;
    font-weight: bold;
    color: white;
    text-shadow:
      0 0 8px #ff6b35,
      0 0 12px #ff6b35,
      0 2px 4px rgba(0, 0, 0, 0.7);
  }

  ${media.mobile`
  width : 300%
  `}
`

const LoadingCotnainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;

  color: var(--color-accent);
`

interface ButtonState {
  name: string
  providerId: number
  logoSrc: string
}

// 버튼 상태를 나타내는 인터페이스
interface OttState {
  name: string // 버튼 표시 이름
  providerId: number // TMDB 프로바이더 ID
  logoSrc: string // 로고 이미지 URL
}

// 버튼 상태 배열
const OttStates: OttState[] = [
  {
    name: '넷플릭스',
    providerId: 8,
    // Netflix 공식 로고 (SVG)
    logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', //  [oai_citation:0‡위키백과](https://en.m.wikipedia.org/wiki/File%3ANetflix_2015_logo.svg)
  },
  {
    name: 'Disney+',
    providerId: 337,
    // Disney+ 공식 로고 (SVG)
    logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg', //  [oai_citation:1‡위키백과](https://en.m.wikipedia.org/wiki/File%3ADisney%2B_logo.svg)
  },
  // {
  //   name: 'Apple TV+',
  //   providerId: 2,
  //   // Apple TV+ 공식 로고 (SVG)
  //   logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg', //  [oai_citation:2‡위키백과](https://en.m.wikipedia.org/wiki/File%3AApple_TV_Plus_Logo.svg)
  // },
  {
    name: '웨이브',
    providerId: 356,
    logoSrc: Wavve,
  },
  {
    name: '왓챠',
    providerId: 97,
    // 아직 찾지 못한 로고 URL — 공식 로고 이미지 URL을 알려주면 업데이트한다.
    logoSrc:
      'https://oopy.lazyrockets.com/api/v2/notion/image?src=https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fd05ded51-54bf-4174-8b7e-e021c6eb6b5a%2FWATCHA_LOGO.svg&blockId=400d70c6-5698-4877-9ddf-83be123fb341',
  },
  // {
  //   name: '티빙',
  //   providerId: 1883,
  //   // TVING 공식 로고 (SVG)
  //   logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/TVING_logo.svg', //  [oai_citation:3‡upload.wikimedia.org](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/TVING_logo.svg/120px-TVING_logo.svg.png)
  // },
]

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  font-size: var(--font-size-sm);
`

const RetroButton = styled.button<{ iconSize?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  padding: 10px 15px;
  background-color: #e7e5e4;
  border-radius: 0.5rem;
  font-family: serif;
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 2rem;
  color: rgba(146, 64, 14, 0.8);
  border-top: 2px solid #f5f5f4;
  border-left: 2px solid #a8a29e;
  border-right: 2px solid #a8a29e;
  border-bottom: 8px solid #a8a29e;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: transform 150ms ease-in-out;

  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:active {
    transform: translateY(0.25rem);
    border-bottom-width: 4px;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  & img {
    width: ${({ iconSize = '1.5rem' }) => iconSize};
    height: ${({ iconSize = '1.5rem' }) => iconSize};
    object-fit: contain;
  }
`

const StyledBtn = styled.button`
  box-sizing: border-box;
  appearance: none;
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid #fff;
  border-radius: 0.6em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1;
  padding: 0.2em 0.4em;
  min-width: 60px;
  text-decoration: none;
  text-align: center;
  text-transform: uppercase;
  transition:
    background 0.2s,
    color 0.2s;

  &:hover,
  &:focus {
    border: 2px solid #fff;
    color: #000;
    background: #fff;
    outline: 0;
  }

  ${media.mobile`
      padding: 0.2rem 0rem;
    `}
`

const BtnImg = styled.img`
  width: 3em;
  height: 2rem;
  object-fit: contain;
  vertical-align: middle;
`

// 하단 버튼 영역(모바일/데스크탑 모두)
const FixedBottomBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 12%;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  pointer-events: none;
`

const ButtonBarGrid = styled.div`
  display: flex;
  gap: 0.7rem;
  pointer-events: auto;

  ${media.mobile`
      gap : 0.05rem;
    `}
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
  const [posterDimensions, setPosterDimensions] = useState({ width: 180, height: 270 })
  const [transformValues, setTransformValues] = useState({
    radius: 250,
    shelfY: 210,
    centerRiseY: -40,
    centerRiseZ: 200,
    sideRiseY: 15,
    sidePushZ: -60,
  })
  const [checkMobile, setCheckMobile] = useState(window.innerWidth <= 767)
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      setCheckMobile(window.innerWidth <= 767)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const updateLayout = useCallback(() => {
    if (jukeboxRef.current) {
      const rect = jukeboxRef.current.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const isMobile = window.innerWidth < 768

      setCarouselStyle({
        width: `${rect.width * 0.68}px`,
        height: `${rect.height * 0.65}px`,
        top: `${rect.top + rect.height * 0.48}px`,
        left: `${rect.left + rect.width * 0.5}px`,
        transform: 'translate(-50%, -50%)',
      })

      const newPosterWidth = rect.width * (isMobile ? 0.15 : 0.18)
      setPosterDimensions({
        width: newPosterWidth,
        height: newPosterWidth * 1.5,
      })

      setTransformValues({
        radius: rect.width * (isMobile ? 0.23 : 0.25),
        shelfY: rect.height * (isMobile ? 0.14 : 0.17),
        centerRiseY: rect.height * (isMobile ? -0.06 : -0.03),
        centerRiseZ: rect.width * 0.2,
        sideRiseY: rect.height * 0.012,
        sidePushZ: rect.width * -0.06,
      })
    }
  }, [])

  useEffect(() => {
    updateLayout()
    window.addEventListener('resize', updateLayout)
    const imgElement = jukeboxRef.current
    imgElement?.addEventListener('load', updateLayout)

    return () => {
      window.removeEventListener('resize', updateLayout)
      imgElement?.removeEventListener('load', updateLayout)
    }
  }, [updateLayout])

  // 영화 데이터 상태 및 로딩 상태
  const [movies, setMovies] = useState<{ id: number; title: string; poster: string }[]>([])

  // 영화 프로바이더에 따라 api 호출
  const [provider, setProvider] = useState(8)

  // 영화 데이터 API 호출
  useEffect(() => {
    if (provider < 0) return

    const fetchMovies = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
          params: {
            api_key: 'b18e798ff377ef49f1c335283e7c43d6',
            language: 'ko-KR',
            region: 'KR',
            sort_by: 'popularity.desc',
            with_watch_providers: provider,
            watch_region: 'KR',
            page: 1,
          },
        })
        // 필요 데이터 매핑: id, title, backdrop_path → poster URL
        const results = response.data.results.map((item: any) => ({
          id: item.id,
          title: item.title,
          poster: `https://image.tmdb.org/t/p/w342${item.poster_path}`,
        }))
        console.log(results)
        setMovies(results.slice(0, 10))
      } catch (error) {
        console.error('영화 데이터 로드 실패', error)
      } finally {
        setIsLoading(false)
      }
    }
    setIsLoading(true)
    fetchMovies()
  }, [provider])

  const isCustomClicked = (mode: string) => {
    setProvider(-1)
    setIsLoading(true)
    const fetchMovies = async () => {
      try {
        const res = mode === 'popcorn' ? await topPopcorn(10) : await boxoffice()
        console.log(res)
        const result =
          mode === 'popcorn'
            ? res.data.map((item: any) => ({
                id: item.tmdbId,
                title: item.title,
                poster: item.posterUrl,
              }))
            : res.data.movies.map((item: any) => ({
                id: item.tmdbId,
                title: item.title,
                poster: item.posterUrl,
              }))

        console.log(result)
        setMovies(result)
      } catch (e) {
        console.error('볼래말래 영화 TOP10 불러오기 실패', e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }

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
  }, [isLoading])

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
  }, [isLoading])

  return (
    <PageWrapper>
      <FixedBottomBar>
        <ButtonBarGrid
          onClick={() => {
            // 다른 순위를 봤을 땐 다시 0으로 초기화
            setCurrentIndex(0)
          }}
        >
          <StyledBtn
            key={-2}
            onClick={() => isCustomClicked('boxoffice')}
            aria-label={'박스오피스'}
          >
            <div>예매</div>
          </StyledBtn>
          {OttStates.map(({ name, providerId, logoSrc }) => (
            <StyledBtn key={providerId} onClick={() => setProvider(providerId)} aria-label={name}>
              <BtnImg src={logoSrc} alt={name} />
            </StyledBtn>
          ))}
          <StyledBtn key={-1} onClick={() => isCustomClicked('popcorn')} aria-label={'팝콘'}>
            <div>팝콘</div>
          </StyledBtn>
        </ButtonBarGrid>
      </FixedBottomBar>

      <JukeboxContainer>
        <JukeboxWrapper>
          <JukeboxBackground
            ref={jukeboxRef}
            src={JukeboxImg}
            alt="Wurlitzer Jukebox background"
            width={943}
            height={1005}
          />
        </JukeboxWrapper>
        {/* 여기서 loading을 확인할 필요가 있음 */}
        {isLoading ? (
          <LoadingCotnainer>
            <Icon icon="line-md:loading-twotone-loop" fontSize={100} />
          </LoadingCotnainer>
        ) : (
          <CarouselContainer ref={carouselRef} style={carouselStyle}>
            {!checkMobile && (
              <>
                <NavButton className="left" onClick={prevMovie}>
                  <ChevronLeft color="white" />
                </NavButton>
                <NavButton className="right" onClick={nextMovie}>
                  <ChevronRight color="white" />
                </NavButton>
              </>
            )}

            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '-28%',
              }}
            >
              {movies.map((movie, index) => {
                let offset = index - currentIndex
                if (offset > movies.length / 2) offset -= movies.length
                else if (offset < -movies.length / 2) offset += movies.length

                if (Math.abs(offset) > 3) return null

                const isCenter = offset === 0
                let translateX, translateY, translateZ, rotateY, scale, opacity

                if (isCenter) {
                  translateX = 0
                  translateY = transformValues.centerRiseY
                  translateZ = transformValues.centerRiseZ
                  rotateY = 0
                  scale = 1.3
                  opacity = 1
                } else {
                  const angle = offset * 0.55
                  translateX = Math.sin(angle) * transformValues.radius
                  translateY =
                    transformValues.shelfY + Math.abs(Math.cos(angle)) * transformValues.sideRiseY
                  translateZ =
                    Math.cos(angle) * (transformValues.radius * 0.2) + transformValues.sidePushZ
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
                    onClick={() => {
                      setCurrentIndex(index)
                      if (isCenter) {
                        console.log(`${movie.id}의 tmdbId로 이동`)
                        navigate(`movie/detail/${movie.id}`)
                      }
                    }}
                  >
                    <MovieTop>{index + 1}</MovieTop>
                    <PosterWrapper>
                      <PosterImage
                        src={movie.poster}
                        alt={movie.title}
                        width={posterDimensions.width}
                        height={posterDimensions.height}
                        isCenter={isCenter}
                        isActive={isActive}
                      />
                      {isCenter && (
                        <MovieTitleAbove>
                          <h3 style={{ fontSize: `${posterDimensions.width * 0.01}rem` }}>
                            {movie.title}
                          </h3>
                        </MovieTitleAbove>
                      )}
                    </PosterWrapper>
                  </CarouselItemWrapper>
                )
              })}
            </div>
          </CarouselContainer>
        )}
      </JukeboxContainer>
    </PageWrapper>
  )
}
