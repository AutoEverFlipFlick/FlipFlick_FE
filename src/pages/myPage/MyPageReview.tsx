import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Pagination } from '@mui/material'
import { useMediaQuery } from 'react-responsive'
import BaseContainer from '@/components/common/BaseContainer'
import movie from './movie.jpg'
import { getUserReviewsLatest } from '@/services/memberPost'

interface IsMobile {
  $ismobile: boolean
}

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
`

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  overflow-x: hidden;
`

const Title = styled.h2`
  font-size: 1.5rem;
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
  gap: 1rem;
  margin-bottom: 2rem;
`

const ReviewCard = styled(BaseContainer)`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
`

const ReviewImage = styled.img`
  width: 80px;
  object-fit: cover;
`

const InfoWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.8rem;
  color: #fff;
`

const ReviewTitle = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  line-height: 1;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  margin-bottom: 0.5rem;
`

const ReviewRating = styled.div`
  color: #fff;
  font-size: 0.9rem;
  align-self: flex-end;
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
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      const res = await getUserReviewsLatest(nickname, page, pageSize)
      const newReviews = res.data.data.content
      setReviews(newReviews)
      setTotal(res.data.data.totalElements)
      setIsLastPage(res.data.data.last)
      setLoading(false)
    }

    fetchReviews()
  }, [page])

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

  return (
    <Container>
      <ContentWrapper>
        <Title>작성한 리뷰</Title>

        <FlexRow>
          <TotalCount>총 {total}개</TotalCount>
        </FlexRow>

        <ContentGrid $ismobile={isMobile}>
          {reviews.map((review, idx, arr) => {
            const isLast = isMobile && idx === arr.length - 1

            return (
              <div key={review.id} ref={isLast ? lastItemRef : undefined}>
                <ReviewCard>
                  <ReviewImage
                    src={`https://image.tmdb.org/t/p/w500${review.posterImg}`}
                    alt={review.movieTitle}
                  />
                  <InfoWrap>
                    <ReviewRating>★ {review.star}</ReviewRating>
                    <ReviewTitle>{review.movieTitle}</ReviewTitle>
                    <ReviewText>{review.content}</ReviewText>
                    <ReviewTime>{review.createdAt}</ReviewTime>
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
      </ContentWrapper>
    </Container>
  )
}

export default MyPageReview
