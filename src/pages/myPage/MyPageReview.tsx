import React, { useState, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { Pagination } from '@mui/material'
import { useMediaQuery } from 'react-responsive'
import BaseContainer from '@/components/common/BaseContainer'
import movie from './movie.jpg'

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

const SortSelect = styled.select`
  background: transparent;
  border: none;
  color: #fff;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;

  option {
    background: #130803;
    color: #fff;
  }
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

// 더미 리뷰 데이터
const dummyReviews = Array.from({ length: 17 }, (_, i) => ({
  id: i,
  title: '제목',
  rating: 4.5,
  text: '너무 귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요워요귀여워요귀여워요~~',
  time: '1시간 전',
  image: movie,
}))

const MyPageReview = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const [page, setPage] = useState(0)
  const [isLastPage, setIsLastPage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const pageSize = 8
  const totalPages = Math.ceil(dummyReviews.length / pageSize)
  const reviewData = isMobile
    ? dummyReviews.slice(0, (page + 1) * pageSize)
    : dummyReviews.slice(page * pageSize, (page + 1) * pageSize)
  const observer = useRef<IntersectionObserver | null>(null)
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1)
  }

  // 무한스크롤: 마지막 요소 관찰
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!isMobile) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !isLastPage) {
          setIsLoading(true)
          setPage(prev => {
            const next = prev + 1
            if (next >= totalPages - 1) setIsLastPage(true)
            return next
          })
          setIsLoading(false)
        }
      })
      if (node) observer.current.observe(node)
    },
    [isMobile, isLastPage, totalPages],
  )

  return (
    <Container>
      <ContentWrapper>
        <Title>작성한 리뷰</Title>

        <FlexRow>
          <TotalCount>총 {dummyReviews.length}개</TotalCount>
          <SortSelect value="recent" onChange={() => {}}>
            <option value="recent">최근 작성순</option>
          </SortSelect>
        </FlexRow>

        <ContentGrid $ismobile={isMobile}>
          {reviewData.map((r, idx, arr) => {
            // 모바일일 때 마지막 아이템인지 체크
            const isLast = isMobile && idx === arr.length - 1

            return (
              // ref를 div에 걸어서 IntersectionObserver로 관찰
              <div key={r.id} ref={isLast ? lastItemRef : undefined}>
                <ReviewCard>
                  <ReviewImage src={r.image} alt={r.title} />
                  <InfoWrap>
                    <ReviewRating>★ {r.rating}</ReviewRating>
                    <ReviewTitle>{r.title}</ReviewTitle>
                    <ReviewText>{r.text}</ReviewText>
                    <ReviewTime>{r.time}</ReviewTime>
                  </InfoWrap>
                </ReviewCard>
              </div>
            )
          })}
        </ContentGrid>
        {!isMobile && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={handlePageChange}
              shape="rounded"
              siblingCount={1}
              boundaryCount={1}
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#fff',
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  backgroundColor: '#FF6B3D',
                  color: '#fff',
                },
                '& .MuiPaginationItem-root:hover': {
                  backgroundColor: '#FF6B3D',
                  color: '#fff',
                },
              }}
            />
          </div>
        )}
        {/* 모바일 로딩 인디케이터 */}
        {isMobile && isLoading && (
          <div style={{ textAlign: 'center', color: '#aaa', padding: 12 }}>내용 불러오는 중...</div>
        )}
      </ContentWrapper>
    </Container>
  )
}

export default MyPageReview
