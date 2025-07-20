import React, { useState, useCallback, useRef, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import BaseContainer from '@/components/common/BaseContainer'
import FlipflickTransparency from '@/assets/common/flipflick_transparency.png'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  getBookmarkList,
  getLikeList,
  getWatchedList,
  MovieListResponseDTO,
  MovieListItem,
} from '@/services/moviePreference'

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

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
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
  color: ${({ $active }) => ($active ? '#FF7849' : '#9CA3AF')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  font-size: ${props => (props.$ismobile ? '0.9rem' : '1.1rem')};
  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: ${({ $active }) => ($active ? '100%' : '0')};
    height: 2px;
    background: #ff7849;
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

const ContentGrid = styled.div<IsMobile>`
  display: grid;
  width: 100%;
  margin: 0 auto;
  grid-template-columns: ${({ $ismobile }) =>
    $ismobile ? '1fr' : 'repeat(5, minmax(200px, 1fr))'};
  gap: ${({ $ismobile }) => ($ismobile ? '0.9rem' : '1.5em')};
`

const Card = styled(BaseContainer)<IsMobile>`
  overflow: hidden;
  text-align: center;
  padding: 0;
  display: flex;
  flex-direction: ${({ $ismobile }) => ($ismobile ? 'row' : 'column')};
  align-items: flex-start;
  margin-bottom: ${({ $ismobile }) => ($ismobile ? '5px' : '0')};
  animation: ${fadeInUp} 0.3s ease both;
`

// 스켈레톤 래퍼
const ImageWrapper = styled.div<{ width: string; height: string } & IsMobile>`
  position: relative;
  width: ${p => (p.$ismobile ? '90px' : p.width)};
  height: ${p => (p.$ismobile ? '135px' : p.height || '300px')};
  aspect-ratio: 2 / 3;
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

// 누락된 상태 컴포넌트
const LoadingMessage = styled.div`
  text-align: center;
  color: #ccc;
  font-size: 1.1rem;
  margin: 2rem 0;
`
const ErrorMessage = styled.div`
  text-align: center;
  color: #ff4444;
  font-size: 1.1rem;
  margin: 2rem 0;
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
    <ImageWrapper $ismobile={isMobile} width={width} height={height}>
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

const CardInfo = styled.div<IsMobile>`
  flex: 1;
  padding: 8px;
  text-align: left;
  margin-left: ${props => (props.$ismobile ? '0.7rem' : '0')};
  margin-top: ${props => (props.$ismobile ? '1.2rem' : '0')};
  line-height: 2rem;
`

const CardTitle = styled.div<IsMobile>`
  color: #fff;
  font-size: ${props => (props.$ismobile ? '1.3rem' : '1.1rem')};
  padding-top: 5px;
  margin-bottom: ${props => (props.$ismobile ? '0.1rem' : '-2px')};
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CardYear = styled.div<IsMobile>`
  color: #fff;
  opacity: 0.7;
  font-size: ${props => (props.$ismobile ? '0.9rem' : '0.9rem')};
  padding-bottom: 5px;
`

type TabType = '찜했어요' | '좋아요' | '봤어요'

interface LocationState {
  tab?: TabType
  ownerId: number
}

const MyPagePreference: React.FC = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const navigate = useNavigate()
  const { state } = useLocation<LocationState>()

  // 페칭 상태
  const [loading, setLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 탭·페이징·데이터
  const initialTab = state?.tab ?? '찜했어요'
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)

  const pageSize = 20
  const [page, setPage] = useState(0)
  const [isLastPage, setIsLastPage] = useState(false)
  const [items, setItems] = useState<MovieListItem[]>([])
  const [total, setTotal] = useState(0)

  const profileOwnerId = state?.ownerId
  const observer = useRef<IntersectionObserver | null>(null)

  // 데이터 페칭 함수
  const fetchItems = async () => {
    if (profileOwnerId == null) {
      navigate('/my-page-main')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const fetcher =
        activeTab === '찜했어요'
          ? getBookmarkList
          : activeTab === '좋아요'
            ? getLikeList
            : getWatchedList

      const res = await fetcher(profileOwnerId, page, pageSize)
      const dto = res.data.data as MovieListResponseDTO

      // 페이지 초기(=0)일 때 교체, 이후엔 추가
      setItems(prev => {
        if (isMobile) {
          return page === 0 ? dto.content : [...prev, ...dto.content]
        } else {
          return dto.content // 💡 데스크탑은 항상 교체
        }
      })
      setTotal(dto.totalElements)
      setIsLastPage(dto.content.length < pageSize)
    } catch (err: any) {
      console.error(err)
      setError('데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
      setHasLoaded(true)
    }
  }

  // 탭·페이지 변경 시마다 즉각 호출
  useEffect(() => {
    setHasLoaded(false)
    fetchItems()
  }, [activeTab, page, profileOwnerId])

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
    <ContentContainer>
      <Title $ismobile={isMobile}>{activeTab}</Title>
      <TabNav $ismobile={isMobile}>
        {(['찜했어요', '좋아요', '봤어요'] as const).map(tab => (
          <TabItem
            key={tab}
            $active={activeTab === tab}
            $ismobile={isMobile}
            onClick={() => {
              setActiveTab(tab)
              setPage(0)
            }}
          >
            {tab}
          </TabItem>
        ))}
      </TabNav>

      {loading && !hasLoaded && <LoadingMessage>로딩 중...</LoadingMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!loading && !error && hasLoaded && (
        <>
          <FlexRow>
            <TotalCount>총 {total}개</TotalCount>
          </FlexRow>
          <ContentGrid $ismobile={isMobile}>
            {items.map((item, idx) => (
              <div
                key={item.tmdbId}
                ref={isMobile && idx === items.length - 1 ? lastItemRef : undefined}
              >
                <Card $ismobile={isMobile}>
                  {/* 스켈레톤 적용된 이미지로 바꿈 */}
                  <ImageLoader
                    src={item.posterImage}
                    alt={item.title}
                    width={isMobile ? '90px' : '100%'}
                    height={isMobile ? '135px' : 'auto'}
                  />
                  <CardInfo $ismobile={isMobile}>
                    <CardTitle $ismobile={isMobile}>{item.title}</CardTitle>
                    <CardYear $ismobile={isMobile}>{item.year}</CardYear>
                  </CardInfo>
                </Card>
              </div>
            ))}
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
    </ContentContainer>
  )
}

export default MyPagePreference
