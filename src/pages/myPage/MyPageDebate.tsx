import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import zzanggu from './zzanggu.jpg'
import BaseContainer from '@/components/common/BaseContainer'
import { getUserDebatesBySort, Debate, SortBy } from '@/services/memberPost'
import { ChevronDown, MessageSquare, Pencil, Trash2, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { timeForToday } from '@/utils/timeForToday'
import { useNavigate } from 'react-router-dom'

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
  overflow-x: hidden;
`
const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: hidden;
  box-sizing: border-box;
  width: 100%;
`

// 페이지 이름
const Title = styled.h2<IsMobile>`
  font-size: ${p => (p.$ismobile ? '1.2rem' : '1.5rem')};
  margin-bottom: 1rem;
  color: white;
  text-align: center;
`

// 탭
// const TabNav = styled.div<IsMobile>`
//   display: flex;
//   gap: 1rem;
//   margin-bottom: 1rem;
//   text-align: center;
//   justify-content: ${p => (p.$ismobile ? 'space-around' : 'left')};
// `
// const TabItem = styled.span<{ $active: boolean } & IsMobile>`
//   position: relative;
//   cursor: pointer;
//   padding-bottom: 0.5rem;
//   color: ${({ $active }) => ($active ? '#FF7849' : '#9CA3AF')};
//   font-weight: ${({ $active }) => ($active ? 600 : 400)};
//   font-size: ${props => (props.$ismobile ? '0.9rem' : '1.1rem')};
//   &:after {
//     content: '';
//     position: absolute;
//     bottom: -4px;
//     left: 0;
//     width: ${({ $active }) => ($active ? '100%' : '0')};
//     height: 2px;
//     background: #ff7849;
//     transition: width 0.3s;
//   }
// `
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

const SortContainer = styled.div`
  position: relative;
`

const SortButton = styled.button`
  background: #2a2a2a;
  border: 1px solid #444;
  color: #ccc;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
    color: white;
    border-color: #555;
  }
`

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
  min-width: 120px;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  margin-top: 0.25rem;
`

const DropdownItem = styled.button<{ $active: boolean }>`
  width: 100%;
  background: none;
  border: none;
  color: ${props => (props.$active ? '#ff7849' : '#ccc')};
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
    color: white;
  }

  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`
const ContentGrid = styled.div<IsMobile>`
  display: grid;
  grid-template-columns: ${({ $ismobile }) =>
    $ismobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))'};
  gap: 1rem;
  margin-bottom: 2rem;
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

const DebateCard = styled(BaseContainer)<{ $$ismobile: boolean }>`
  display: flex;
  flex-direction: ${props => (props.$$ismobile ? 'column' : 'row')};
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  height: auto;
  animation: ${fadeInUp} 0.3s ease both;
`
const TopIcons = styled.div<IsMobile>`
  position: ${({ $ismobile }) => ($ismobile ? 'absolute' : 'absolute')};
  top: ${({ $ismobile }) => ($ismobile ? '12px' : '12px')};
  right: ${({ $ismobile }) => ($ismobile ? '12px' : '12px')};
  display: flex;
  gap: 8px;
  z-index: 2;

  & > span {
    cursor: pointer;
    color: #fff;
    font-size: 1rem;
  }
`
const ImageWrapper = styled.div<IsMobile>`
  width: ${({ $ismobile }) => ($ismobile ? '100%' : '140px')};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: ${({ $ismobile }) => ($ismobile ? '0.7rem' : '8px')};
  box-sizing: border-box;
`

const MovieTitle = styled.div<IsMobile>`
  width: 100%;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  white-space: nowrap;
  margin-left: ${({ $ismobile }) => ($ismobile ? '0.5rem' : '0')};
`

const ImageLoader: React.FC<{
  src: string
  alt: string
}> = ({ src, alt }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <ImageWrapper $ismobile={isMobile} style={{ position: 'relative' }}>
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
            borderRadius: '3px',
          }}
        />
      )}
      {error && (
        <img
          src={zzanggu} // fallback image
          alt="fallback"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </ImageWrapper>
  )
}

const ImageActions = styled.div<IsMobile>`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  font-size: 0.9rem;
  color: #fff;
  width: 100%;
  margin-top: 4px;
  position: static;
`

const GroupWrapper = styled.span`
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #fff;

  svg {
    stroke-width: 1.5;
    flex-shrink: 0;
  }

  span {
    font-size: 16px;
    display: inline-block;
    min-width: 14px;
  }
`

const DebateContent = styled.div<IsMobile>`
  flex: 1;
  padding: ${({ $ismobile }) => ($ismobile ? '1rem 1rem 1.5rem 1rem' : '1rem')};
  display: flex;
  flex-direction: column;
  color: #fff;
  margin-top: ${({ $ismobile }) => ($ismobile ? '0' : '25px')};
  word-break: break-word;
  box-sizing: border-box;
  width: 100%;
`

const Header = styled.div<IsMobile>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
`
const DebateTitle = styled.div<IsMobile>`
  flex: 1;
  margin: 0;
  min-width: 0;
  font-size: 1.1rem;
  font-weight: bold;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  margin-top: 5px;
  margin-left: ${({ $ismobile }) => ($ismobile ? '0.3rem' : '0')};
`
const TimeStamp = styled.div`
  flex-shrink: 0;
  margin-left: 8px;
  font-size: 0.75rem;
  color: #777;
`
const DebateText = styled.div<IsMobile>`
  font-size: 0.85rem;
  margin: ${({ $ismobile }) => ($ismobile ? '0.7rem' : '0')};
  margin-top: 0.7rem;
  color: #ccc;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ $ismobile }) => ($ismobile ? '1' : '3')};
  overflow: hidden;
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

export default function MyPageDebate() {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const navigate = useNavigate()
  // const [activeTab, setActiveTab] = useState<'내가 쓴 글' | '내가 쓴 댓글'>('내가 쓴 글')
  const [debates, setDebates] = useState<Debate[]>([])
  const [page, setPage] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const location = useLocation()
  const nickname = location.state?.nickname || ''
  const [isLastPage, setIsLastPage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const pageSize = 8
  const observer = useRef<IntersectionObserver | null>(null)
  const [sortBy, setSortBy] = useState<SortBy>('latest')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const { user } = useAuth()
  const totalPages = Math.ceil(totalElements / pageSize)

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
  ]

  const getSortLabel = (sort: SortBy) => {
    switch (sort) {
      case 'popular':
        return '인기순'
      case 'latest':
        return '최신순'
      default:
        return '최신순'
    }
  }

  useEffect(() => {
    setPage(0)
  }, [nickname, sortBy])

  const handleSortChange = (newSortBy: SortBy) => {
    setSortBy(newSortBy)
    setCurrentPage(0)
    setIsDropdownOpen(false)
    setHasLoaded(false) // 추가: 정렬 변경 시 로딩 상태 초기화
  }

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

  const fetchDebates = async (pageNum = 0) => {
    try {
      setIsLoading(true)
      setHasError(false)
      const res = await getUserDebatesBySort(nickname, pageNum, pageSize, sortBy)
      const newData = res.data.data.content
      const total = res.data.data.totalElements
      setTotalElements(total)
      setIsLastPage(newData.length < pageSize)
      if (isMobile) {
        setDebates(prev => (pageNum === 0 ? newData : [...prev, ...newData]))
      } else {
        setDebates(newData)
      }
      setHasLoaded(true)
    } catch (err) {
      console.error(err)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (nickname) {
      fetchDebates(0)
    }
  }, [nickname, sortBy])

  useEffect(() => {
    if (!isMobile && nickname) {
      fetchDebates(page) // 페이지 변경 시 데이터 불러오기
    }
  }, [page, isMobile, nickname])

  const formatCount = (count: number): string => {
    return count > 99 ? '99+' : count.toString()
  }

  return (
    <Container>
      <ContentWrapper>
        <Title $ismobile={isMobile}>토론장 활동 내역</Title>
        {/* <TabNav $ismobile={isMobile}>
          {(['내가 쓴 글', '내가 쓴 댓글'] as const).map(tab => (
            <TabItem
              key={tab}
              $active={activeTab === tab}
              $ismobile={isMobile}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </TabItem>
          ))}
        </TabNav> */}
        <FlexRow>
          <TotalCount>총 {totalElements}개</TotalCount>
          <SortContainer ref={dropdownRef}>
            <SortButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              {getSortLabel(sortBy)} <ChevronDown size={16} />
            </SortButton>
            <DropdownMenu $isOpen={isDropdownOpen}>
              {sortOptions.map(option => (
                <DropdownItem
                  key={option.value}
                  $active={sortBy === option.value}
                  onClick={() => handleSortChange(option.value)}
                >
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </SortContainer>
        </FlexRow>
        {isLoading && !hasLoaded && <LoadingMessage>토론 글을 불러오는 중입니다...</LoadingMessage>}
        {hasError && <ErrorMessage>토론 글을 불러오는 중 오류가 발생했습니다.</ErrorMessage>}
        {!isLoading && !hasError && hasLoaded && debates.length === 0 && (
          <EmptyMessage>작성한 토론 글이 없습니다.</EmptyMessage>
        )}
        {!isLoading && !hasError && hasLoaded && debates.length > 0 && (
          <ContentGrid $ismobile={isMobile}>
            {debates.map((d, idx) => {
              const isLast = isMobile && idx === debates.length - 1
              const isOwner = user?.nickname === nickname
              return (
                <div key={d.debateId} ref={isLast ? lastItemRef : undefined}>
                  {isMobile ? (
                    <>
                      <DebateCard $$ismobile={isMobile}>
                        {isOwner && (
                          <TopIcons $ismobile={isMobile}>
                            <span>
                              <Pencil size={20} onClick={() => navigate('/')} />
                            </span>
                            <span>
                              <Trash2 size={20} onClick={() => navigate('/')} />
                            </span>
                          </TopIcons>
                        )}
                        <ImageWrapper $ismobile={isMobile}>
                          <MovieTitle $ismobile={isMobile}>{d.movieTitle}</MovieTitle>
                          <Header $ismobile={isMobile}>
                            <DebateTitle $ismobile={isMobile}>{d.debateTitle}</DebateTitle>
                            <TimeStamp>{timeForToday(d.createdAt)}</TimeStamp>
                          </Header>
                          <ImageLoader src={zzanggu} alt="프로필" />

                          <DebateText $ismobile={isMobile}>{d.content}</DebateText>
                          <ImageActions $ismobile={isMobile}>
                            <GroupWrapper>
                              <ThumbsUp stroke="#fff" size={20} />
                              <span>{formatCount(d.likeCnt)}</span>
                            </GroupWrapper>
                            <GroupWrapper>
                              <ThumbsDown stroke="#fff" size={20} />
                              <span>{formatCount(d.hateCnt)}</span>
                            </GroupWrapper>
                            <GroupWrapper>
                              <MessageSquare stroke="#fff" size={20} />
                              <span>{formatCount(d.commentCount)}</span>
                            </GroupWrapper>
                          </ImageActions>
                        </ImageWrapper>
                      </DebateCard>
                    </>
                  ) : (
                    <>
                      <DebateCard $$ismobile={isMobile}>
                        {isOwner && (
                          <TopIcons $ismobile={isMobile}>
                            <span>
                              <Pencil size={20} />
                            </span>
                            <span>
                              <Trash2 size={20} />
                            </span>
                          </TopIcons>
                        )}
                        <ImageWrapper $ismobile={isMobile}>
                          <MovieTitle $ismobile={isMobile}>{d.movieTitle}</MovieTitle>
                          <ImageLoader src={zzanggu} alt="프로필" />
                          <ImageActions $ismobile={isMobile}>
                            <GroupWrapper>
                              <ThumbsUp stroke="#fff" size={20} />
                              <span>{formatCount(d.likeCnt)}</span>
                            </GroupWrapper>
                            <GroupWrapper>
                              <ThumbsDown stroke="#fff" size={20} />
                              <span>{formatCount(d.hateCnt)}</span>
                            </GroupWrapper>
                            <GroupWrapper>
                              <MessageSquare stroke="#fff" size={20} />
                              <span>{formatCount(d.commentCount)}</span>
                            </GroupWrapper>
                          </ImageActions>
                        </ImageWrapper>
                        <DebateContent $ismobile={isMobile}>
                          <Header $ismobile={isMobile}>
                            <DebateTitle $ismobile={isMobile}>{d.debateTitle}</DebateTitle>
                            <TimeStamp>{timeForToday(d.createdAt)}</TimeStamp>
                          </Header>
                          <DebateText $ismobile={isMobile}>{d.content}</DebateText>
                        </DebateContent>
                      </DebateCard>
                    </>
                  )}
                </div>
              )
            })}
          </ContentGrid>
        )}
        {!isMobile && totalPages > 1 && (
          <PaginationWrapper>
            <PaginationButton disabled={page === 0} onClick={() => setPage(0)}>
              &lt;&lt;
            </PaginationButton>
            <PaginationButton disabled={page === 0} onClick={() => setPage(prev => prev - 1)}>
              &lt;
            </PaginationButton>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(0, page - 2)
              const pageNum = start + i
              if (pageNum >= totalPages) return null
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
              disabled={page >= totalPages - 1}
              onClick={() => setPage(prev => prev + 1)}
            >
              &gt;
            </PaginationButton>
            <PaginationButton
              disabled={page >= totalPages - 1}
              onClick={() => setPage(totalPages - 1)}
            >
              &gt;&gt;
            </PaginationButton>
          </PaginationWrapper>
        )}
      </ContentWrapper>
    </Container>
  )
}
