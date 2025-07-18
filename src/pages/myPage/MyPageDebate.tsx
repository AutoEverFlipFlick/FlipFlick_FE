import React, { useState, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import zzanggu from './zzanggu.jpg'
import BaseContainer from '@/components/common/BaseContainer'
import { Pagination } from '@mui/material'

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

// 페이지 이름
const Title = styled.h2<IsMobile>`
  font-size: ${p => (p.$ismobile ? '1.2rem' : '1.5rem')};
  margin-bottom: 1rem;
  color: white;
  text-align: center;
`

// 탭
const TabNav = styled.div<IsMobile>`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  justify-content: ${p => (p.$ismobile ? 'space-around' : 'left')};
`
const TabItem = styled.span<{ $active: boolean } & IsMobile>`
  position: relative;
  cursor: pointer;
  padding-bottom: 0.5rem;
  color: ${({ $active }) => ($active ? '#F59E0B' : '#9CA3AF')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  font-size: ${p => (p.$ismobile ? '0.9rem' : '1rem')};
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
  background: transparent;
  border: none;
  color: #fff;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  option {
    background: transparent;
    color: #fff;
  }
`
const ContentGrid = styled.div<IsMobile>`
  display: grid;
  grid-template-columns: ${({ $ismobile }) => ($ismobile ? '1fr' : 'repeat(2, 1fr)')};
  gap: 1rem;
  margin-bottom: 2rem;
`
const DebateCard = styled(BaseContainer)`
  display: flex;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
`
const TopIcons = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 8px;
  z-index: 2;
  & > span {
    cursor: pointer;
    color: #fff;
    font-size: 1rem;
  }
`
const ImageWrapper = styled.div`
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
`
const MovieTitle = styled.div`
  width: 100%;
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
  margin-left: 5px;
  white-space: nowrap;
`
const DebateImage = styled.img<IsMobile>`
  width: 100px;
  aspect-ratio: ${p => (p.$ismobile ? 'auto' : '2/3')};
  object-fit: cover;
  border-radius: 4px;
`
const ImageActions = styled.div`
  display: flex;
  gap: 8px;
  font-size: 0.9rem;
  color: #fff;
  & > span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`
const HeartIcon = styled.span`
  color: #e74c3c;
`
const CommentIcon = styled.span`
  color: #aaa;
`

const DebateContent = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  color: #fff;
  margin-top: 20px;
  word-break: break-word;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
  flex-wrap: wrap;
  gap: 4px;
`
const DebateTitle = styled.div`
  flex: 1;
  margin: 0;
  min-width: 0;
  font-size: 1rem;
  font-weight: bold;
  word-break: break-word;
`
const TimeStamp = styled.div`
  flex-shrink: 0;
  margin-left: 8px; // 제목과 시계 사이 간격
  font-size: 0.75rem;
  color: #777;
`
const DebateText = styled.div`
  font-size: 0.85rem;
  margin-top: 1rem;
  color: #ccc;
  display: -webkit-box; /* Flexbox 처럼 박스 모델 */
  -webkit-box-orient: vertical; /* 세로 방향으로 쌓이게 */
  -webkit-line-clamp: 3; /* 최대 2줄까지만 보이게 */
  overflow: hidden; /* 넘친 텍스트 숨기기 */
`

const dummyDebate = Array.from({ length: 17 }, (_, i) => ({
  id: i,
  movietitle: '스티치',
  articletitle: '게시글 제목입니다',
  text: '너무 귀여워요귀여워ssssssssssssssss요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요귀여워요~~',
  time: '1시간 전',
  likes: Math.floor(Math.random() * 100),
  comments: Math.floor(Math.random() * 50),
  image: zzanggu,
}))

export default function MyPageDebate() {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const [activeTab, setActiveTab] = useState<'내가 쓴 글' | '내가 쓴 댓글'>('내가 쓴 글')
  const [page, setPage] = useState(0)
  const [isLastPage, setIsLastPage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const pageSize = 8
  const totalPages = Math.ceil(dummyDebate.length / pageSize)
  const observer = useRef<IntersectionObserver | null>(null)

  const debateData = isMobile
    ? dummyDebate.slice(0, (page + 1) * pageSize)
    : dummyDebate.slice(page * pageSize, (page + 1) * pageSize)

  const handlePageChange = (_: any, value: number) => {
    setPage(value - 1)
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

  return (
    <Container>
      <ContentWrapper>
        <Title $ismobile={isMobile}>토론장 활동 내역</Title>
        <TabNav $ismobile={isMobile}>
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
        </TabNav>
        <FlexRow>
          <TotalCount>총 {dummyDebate.length}개</TotalCount>
          <SortSelect value="recent" onChange={() => {}}>
            <option value="recent">최근 작성순</option>
          </SortSelect>
        </FlexRow>
        <ContentGrid $ismobile={isMobile}>
          {debateData.map((d, idx, arr) => {
            const isLast = isMobile && idx === arr.length - 1
            return (
              <div key={d.id} ref={isLast ? lastItemRef : undefined}>
                <DebateCard>
                  <TopIcons>
                    <span>✏️</span>
                    <span>🗑️</span>
                  </TopIcons>
                  <ImageWrapper>
                    <MovieTitle>{d.movietitle}</MovieTitle>
                    <DebateImage $ismobile={isMobile} src={d.image} alt={d.title} />
                    <ImageActions>
                      <HeartIcon>❤️</HeartIcon>
                      {d.likes}
                      <CommentIcon>💬</CommentIcon>
                      {d.comments}
                    </ImageActions>
                  </ImageWrapper>
                  <DebateContent>
                    <Header>
                      <DebateTitle>{d.articletitle}</DebateTitle>
                      <TimeStamp>{d.time}</TimeStamp>
                    </Header>
                    <DebateText>{d.text}</DebateText>
                  </DebateContent>
                </DebateCard>
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
                '& .MuiPaginationItem-root': { color: '#fff' },
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
        {isMobile && isLoading && (
          <div style={{ textAlign: 'center', color: '#aaa', padding: 12 }}>내용 불러오는 중...</div>
        )}
      </ContentWrapper>
    </Container>
  )
}
