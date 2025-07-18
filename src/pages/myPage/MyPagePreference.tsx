import React, { useState, useCallback, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import { Pagination } from '@mui/material'
import BaseContainer from '@/components/common/BaseContainer'
// import zzanggu from './zzanggu.jpg'
import movie from './movie.jpg'
import { useLocation } from 'react-router-dom'

interface IsMobile {
  $ismobile: boolean
}

// 애니메이션 정의
const fadeInUp = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
`
const shimmer = keyframes`
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
`

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
`

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  overflow-x: hidden;
`

const Title = styled.h2<IsMobile>`
  font-size: ${props => (props.$ismobile ? '1.2rem' : '1.5rem')};
  margin-bottom: 1rem;
  color: white;
  text-align: center;
`

const TabNav = styled.div<IsMobile>`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: ${props => (props.$ismobile ? 'space-around' : 'left')};
`

const TabItem = styled.span<{ $active: boolean } & IsMobile>`
  position: relative;
  cursor: pointer;
  padding-bottom: 0.5rem;
  margin-right: 0%.8;
  border-radius: 4px;
  color: ${({ $active }) => ($active ? '#F59E0B' : '#9CA3AF')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  font-size: ${props => (props.$ismobile ? '0.9rem' : '1rem')};
  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: ${({ $active }) => ($active ? '100%' : '0')};
    height: 2px;
    background: #f59e0b;
    transition: width 0.3s;
  }
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
  border: black;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  color: #fff;
  background: transparent;
  option {
    background: transparent;
    color: #fff;
  }
`

const ContentGrid = styled.div<IsMobile>`
  display: grid;
  grid-template-columns: ${props => (props.$ismobile ? '1fr' : 'repeat(4, 1fr)')};
  gap: ${props => (props.$ismobile ? '0.9rem' : '2rem')};
`

const Card = styled(BaseContainer)<IsMobile>`
  overflow: hidden;
  text-align: center;
  padding: 0;
  display: ${p => (p.$ismobile ? 'flex' : 'block')};
  align-items: center;
  margin-bottom: ${p => (p.$ismobile ? '5px' : '0')};
  animation: ${fadeInUp} 0.3s ease both;
`

const CardImage = styled.img<IsMobile>`
  width: ${p => (p.$ismobile ? '90px' : '100%')};
  aspect-ratio: ${p => (p.$ismobile ? 'auto' : '2/3')};
  margin-right: ${p => (p.$ismobile ? '0.8rem' : '0')};
  border-radius: 4px;
  object-fit: cover;
`

// 스켈레톤 래퍼
const ImageWrapper = styled.div<{ width: string; height: string }>`
  position: relative;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  background: #333;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
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

// 이미지 로더 컴포넌트
const ImageLoader: React.FC<{
  src: string
  alt: string
  width: string
  height: string
}> = ({ src, alt, width, height }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  return (
    <ImageWrapper width={width} height={height}>
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
          src={movie}
          alt="placeholder"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </ImageWrapper>
  )
}

const CardInfo = styled.div`
  flex: 1;
`

const CardTitle = styled.div<IsMobile>`
  color: #fff;
  font-size: ${props => (props.$ismobile ? '1.1rem' : '1.2rem')};
  padding-top: 5px;
  margin-bottom: ${props => (props.$ismobile ? '10px' : '-2px')};
  text-align: ${props => (props.$ismobile ? 'left' : 'center')};
`

const CardYear = styled.div<IsMobile>`
  color: #fff;
  opacity: 0.7;
  font-size: ${props => (props.$ismobile ? '0.9rem' : '1rem')};
  padding-bottom: 5px;
  text-align: ${props => (props.$ismobile ? 'left' : 'center')};
`

const dummyData = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  title: '범죄도시4',
  year: 2024,
  image: movie,
}))

const MyPagePreference = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const pageSize = 12
  const totalPages = Math.ceil(dummyData.length / pageSize)

  const [page, setPage] = useState(0)
  const [isLastPage, setIsLastPage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)

  const location = useLocation()
  const locState = (location.state as { tab?: '찜했어요' | '좋아요' | '봤어요' }) || {}
  const [activeTab, setActiveTab] = useState<'찜했어요' | '좋아요' | '봤어요'>(
    locState.tab ?? '찜했어요',
  )
  // 페이지 변경 핸들러 (데스크탑)
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

  // 보여줄 데이터 계산
  const preferenceData = isMobile
    ? dummyData.slice(0, (page + 1) * pageSize)
    : dummyData.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <Container>
      <ContentWrapper>
        <Title $ismobile={isMobile}>{activeTab}</Title>
        <TabNav $ismobile={isMobile}>
          {(['찜했어요', '좋아요', '봤어요'] as const).map(tab => (
            <TabItem
              key={tab}
              $active={activeTab === tab}
              $ismobile={isMobile}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </TabItem>
          ))}
        </TabNav>
        <FlexRow>
          <TotalCount>총 {dummyData.length}개</TotalCount>
          <SortSelect value="recent" onChange={() => {}}>
            <option value="recent">최근 작성순</option>
          </SortSelect>
        </FlexRow>
        <ContentGrid $ismobile={isMobile}>
          {preferenceData.map((item, idx) => (
            <div
              key={item.id}
              ref={isMobile && idx === preferenceData.length - 1 ? lastItemRef : undefined}
            >
              <Card $ismobile={isMobile}>
                {/* 스켈레톤 적용된 이미지로 바꿈 */}
                <ImageLoader
                  src={item.image}
                  alt={item.title}
                  width={isMobile ? '90px' : '100%'}
                  height={isMobile ? '90px' : 'auto'}
                />
                <CardInfo>
                  <CardTitle $ismobile={isMobile}>{item.title}</CardTitle>
                  <CardYear $ismobile={isMobile}>{item.year}</CardYear>
                </CardInfo>
              </Card>
            </div>
          ))}
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

export default MyPagePreference
