import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import BaseContainer from '@/components/common/BaseContainer'
import { getUserReviewsLatest } from '@/services/memberPost'
import { timeForToday } from '@/utils/timeForToday'
import FlipflickTransparency from '@/assets/common/flipflick_transparency.png'
import { ThumbsUp, ThumbsDown, Star, ArrowLeft } from 'lucide-react'
interface IsMobile {
  $ismobile: boolean
}

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
`

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: hidden;
`

const Spacer = styled.div`
  width: 24px; // BackButton과 동일한 너비
`

const HeaderRow = styled.div<IsMobile>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  margin-bottom: 1rem;
`

const BackButton = styled.button<IsMobile>`
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: left;
  justify-content: left;
  margin-left: ${props => (props.$ismobile ? '3%' : '6%')};
  padding: 0;

  &:hover {
    color: #ff7849;
  }
`

const Title = styled.h2<IsMobile>`
  font-size: ${props => (props.$ismobile ? '1.2rem' : '1.5rem')};
  color: #fff;
  text-align: center;
  margin-bottom: 1rem;
`

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const TotalCount = styled.div`
  color: #fff;
  font-size: 0.9rem;
`

const ContentGrid = styled.div<IsMobile>`
  display: grid;
  grid-template-columns: ${({ $ismobile }) => ($ismobile ? '1fr' : 'repeat(2, 1fr)')};
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-direction: column;
`

const ReviewCard = styled(BaseContainer)<IsMobile>`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  padding: 0;
  animation: ${fadeInUp} 0.3s ease both;
`

interface ImageWrapperProps {
  $width: string
  $height: string
}

const ImageWrapper = styled.div<ImageWrapperProps & IsMobile>`
  flex: 0 0 100px; /* 좌측에 120px 너비 확보 */
  aspect-ratio: 2 / 3;
  overflow: hidden;
  flex-shrink: 0;
  width: ${p => p.$width};
  height: ${p => p.$height};
`

const Skeleton = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: ${shimmer} 1.2s infinite;
  }
`

// 누락된 상태 컴포넌트
const LoadingMessage = styled.div`
  text-align: center;
  color: #ccc;
  font-size: 1rem;
  margin: 2rem 0;
`
const ErrorMessage = styled.div`
  text-align: center;
  color: #ff4444;
  font-size: 1.1rem;
  margin: 2rem 0;
`

const EmptyMessage = styled.div`
  text-align: center;
  color: #ccc;
  font-size: 1rem;
  margin: 2rem 0;
`

const InfoWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  color: #fff;
`

const ReviewTitle = styled.div<IsMobile>`
  font-size: 1.1rem;
  font-weight: bold;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  margin-top: ${({ $ismobile }) => ($ismobile ? '0.5rem' : '2px')};
  margin-bottom: 0.5rem;
`

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  color: #fff;
  font-size: 0.9rem;
  align-self: flex-end;
  padding-top: 0;

  span {
    font-size: 16px;
  }

  svg {
    stroke-width: 1.5;
  }
`

const ReviewText = styled.div`
  font-size: 0.9rem;
  margin: 0.5rem 0;
  color: #ccc;
  overflow-wrap: break-word;
  word-break: break-word;
  display: -webkit-box; /* Flexbox 처럼 박스 모델 */
  -webkit-box-orient: vertical; /* 세로 방향으로 쌓이게 */
  -webkit-line-clamp: 1; /* 최대 2줄까지만 보이게 */
  overflow: hidden; /* 넘친 텍스트 숨기기 */
`

const ReviewTime = styled.div`
  font-size: 0.8rem;
  color: #777;
  margin-left: auto;
`

const ReviewActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  div {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #ccc;

    svg {
      width: 16px;
      height: 16px;
      stroke: #fff;
    }

    span {
      font-size: 0.85rem;
      color: #ccc;
      display: inline-block;
      min-width: 2ch;
      text-align: right;
    }
  }
`

const ReviewBottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`

const PaginationButton = styled.button<{ $active?: boolean }>`
  background: ${props => (props.$active ? '#ff6b35' : 'transparent')};
  border: 1px solid ${props => (props.$active ? '#ff6b35' : '#555')};
  color: ${props => (props.$active ? 'white' : '#ccc')};
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 0.2rem;

  &:hover {
    background: #ff6b35;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
const MobileLoading = styled.div`
  text-align: center;
  color: #aaa;
  padding: 1rem 0;
`

// 이미지 로더 컴포넌트
const ImageLoader: React.FC<{
  src: string
  alt: string
  width: string
  height: string
}> = ({ src, alt, width, height }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  return (
    <ImageWrapper $ismobile={isMobile} $width={width} $height={height}>
      {!loaded && !error && <Skeleton />}
      {!error && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            display: loaded ? 'block' : 'none',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      {error && (
        <img
          src={FlipflickTransparency}
          alt="placeholder"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </ImageWrapper>
  )
}

interface reviewArray {
  id: number
  movieTitle: string
  posterImg: string
  content: string
  star: number
  createdAt: string
  likeCnt: number
  hateCnt: number
}

const MyPageReview: React.FC = () => {
  const location = useLocation()
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const [page, setPage] = useState(0)
  const [isLastPage, setIsLastPage] = useState(false)
  const pageSize = 8
  const observer = useRef<IntersectionObserver | null>(null)
  const [total, setTotal] = useState(0)
  const [reviews, setReviews] = useState<reviewArray[]>([])
  const nickname = location.state?.nickname
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      setError(false)
      try {
        const res = await getUserReviewsLatest(nickname, page, pageSize)
        const newReviews = res.data.data.reviews

        if (isMobile) {
          setReviews(prev => (page === 0 ? newReviews : [...prev, ...newReviews]))
        } else {
          setReviews(newReviews)
        }

        setTotal(res.data.data.totalElements)
        setIsLastPage(res.data.data.last)
        setLoaded(true)
      } catch (e) {
        console.error(e)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [page, isMobile])

  // 모바일 무한스크롤
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!isMobile || loading || isLastPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [isMobile, loading, isLastPage],
  )

  const formatCount = (count: number): string => {
    return count > 99 ? '99+' : count.toString()
  }

  return (
    <Container>
      <ContentWrapper>
        <HeaderRow $ismobile={isMobile}>
          <BackButton $ismobile={isMobile} onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </BackButton>
          <Title $ismobile={isMobile}>작성한 리뷰</Title>
          <Spacer /> {/* 오른쪽 빈 칸 */}
        </HeaderRow>

        {/* 로딩 중 */}
        {loading && !loaded && <LoadingMessage>리뷰를 불러오는 중입니다...</LoadingMessage>}

        {/* 에러 발생 시 */}
        {error && <ErrorMessage>리뷰를 불러오는 중 오류가 발생했습니다.</ErrorMessage>}

        {/* 정상 로딩 완료 시 */}

        <FlexRow>
          <TotalCount>총 {total}개</TotalCount>
        </FlexRow>

        {reviews.length === 0 ? (
          <EmptyMessage>작성한 리뷰가 없습니다.</EmptyMessage>
        ) : (
          <>
            <ContentGrid $ismobile={isMobile}>
              {reviews.map((review, idx, arr) => {
                const isLast = isMobile && idx === arr.length - 1
                const key = review.id || `${review.movieTitle}-${idx}`

                return (
                  <div key={key} ref={isLast ? lastItemRef : undefined}>
                    <ReviewCard $ismobile={isMobile}>
                      <ImageLoader
                        src={`https://image.tmdb.org/t/p/w500${review.posterImg}`}
                        alt={review.movieTitle}
                        width={'auto'}
                        height={'auto'}
                      ></ImageLoader>
                      <InfoWrap>
                        <ReviewRating>
                          <Star fill="yellow" stroke="#yellow" size={18} />
                          <span>{review.star}</span>
                        </ReviewRating>
                        <ReviewTitle $ismobile={isMobile}>{review.movieTitle}</ReviewTitle>
                        <ReviewText>{review.content}</ReviewText>

                        <ReviewBottomRow>
                          <ReviewActions>
                            <div>
                              <ThumbsUp />
                              <span>{formatCount(review.likeCnt)}</span>
                            </div>
                            <div>
                              <ThumbsDown />
                              <span>{formatCount(review.hateCnt)}</span>
                            </div>
                          </ReviewActions>
                          <ReviewTime>{timeForToday(review.createdAt)}</ReviewTime>
                        </ReviewBottomRow>
                      </InfoWrap>
                    </ReviewCard>
                  </div>
                )
              })}
            </ContentGrid>
            {/* 데스크탑 페이징 */}
            {!isMobile && total > pageSize && (
              <PaginationWrapper>
                <PaginationButton disabled={page === 0} onClick={() => setPage(0)}>
                  &lt;&lt;
                </PaginationButton>
                <PaginationButton disabled={page === 0} onClick={() => setPage(prev => prev - 1)}>
                  &lt;
                </PaginationButton>

                {/* 페이지 번호 렌더링 */}
                {Array.from({ length: Math.min(5, Math.ceil(total / pageSize)) }, (_, i) => {
                  const start = Math.max(0, page - 2)
                  const pageNum = start + i
                  if (pageNum >= Math.ceil(total / pageSize)) return null
                  return (
                    <PaginationButton
                      key={pageNum}
                      $active={page === pageNum}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum + 1}
                    </PaginationButton>
                  )
                })}

                <PaginationButton
                  disabled={page >= Math.ceil(total / pageSize) - 1}
                  onClick={() => setPage(prev => prev + 1)}
                >
                  &gt;
                </PaginationButton>
                <PaginationButton
                  disabled={page >= Math.ceil(total / pageSize) - 1}
                  onClick={() => setPage(Math.ceil(total / pageSize) - 1)}
                >
                  &gt;&gt;
                </PaginationButton>
              </PaginationWrapper>
            )}
            {/* 모바일 로딩 */}
            {isMobile && loading && <MobileLoading>내용 불러오는 중...</MobileLoading>}
          </>
        )}
      </ContentWrapper>
    </Container>
  )
}

export default MyPageReview
