import React, { useState, useEffect, KeyboardEvent } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styled, { keyframes, css } from 'styled-components'
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react'

import BackgroundImage from '@/assets/common/backgroud_tile_512px.png'
import FlipflickTransparency from '@/assets/common/flipflick_transparency.png'
import BaseButton from '@/components/common/BaseButton'
import BaseContainer from '@/components/common/BaseContainer'
import {
  PageResult,
  Movie,
  Cast,
  Playlist,
  User as UserType,
  searchMovies,
  searchCasts,
  searchPlaylists,
  searchUsers,
  toggleFollow,
} from '@/services/totalSearch'

type User = UserType & { profileImage?: string | null }

// 애니메이션 keyframes 정의
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`

// 스타일 컴포넌트 정의
const PageWrapper = styled.div`
  min-height: 100vh;
  background-image: url(${BackgroundImage});
  background-repeat: repeat;
  padding: 100px 0;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 60px 0;
    overflow-x: hidden;
  }
`

const Content = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 32px;
  color: #fff;
  font-family: sans-serif;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`

const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0 0 16px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

const TabCountRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const Tabs = styled.div`
  display: flex;
  gap: 32px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`

const Tab = styled.div<{ $active: boolean }>`
  position: relative;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? '#FF7849' : '#9CA3AF')};

  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: ${({ $active }) => ($active ? '100%' : '0')};
    height: 2px;
    background: #FF7849;
    transition: width 0.3s;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

const CountText = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
`

const Grid = styled.div<{ cols: number }>`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(${p => p.cols}, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`

const Card = styled('div')<{ $animate?: boolean }>`
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  animation: none;
  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${fadeInUp} 0.3s ease both;
    `}

  @media (max-width: 768px) {
  display: flex;
  align-items: center;
}
`;

const CardBody = styled.div`
  padding: 12px;

  @media (max-width: 768px) {
    flex: 1;
    padding: 12px 12px 12px 0;
  }
`

const CardTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
`

const CardSub = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
`

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`

const CreatorName = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
`

const MovieCount = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
`

const CastCard = styled(Card)`
  display: flex;
  align-items: center;
`

const CastInfo = styled.div`
  flex: 1;
  padding: 12px 0;
  margin-left: 16px;
`

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`

const Tag = styled.span`
  padding: 4px 8px;
  font-size: 0.875rem;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  color: rgba(255,255,255,0.7);
`

const ImageWrapper = styled.div<{ width: string; height: string }>`
  position: relative;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  background: #333;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    margin-right: 12px;
  }
`

const Skeleton = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.2),
      transparent
    );
    animation: ${shimmer} 1.2s infinite;
  }
`

const ImageLoader: React.FC<{
  src: string | null
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
          src={src || FlipflickTransparency}
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

// 동그란 아바타: 이미지 없으면 nickname.charAt(0) 표시
const Avatar = styled.div<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
  background: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(${({ size }) => size} / 2);
  color: #fff;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

// 페이지네이션 컨테이너
const Pager = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 32px;
  flex-wrap: wrap;
`

// 페이지 버튼
const PageButton = styled.button<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? '#52525B' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#000')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;

  &:disabled {
    cursor: default;
    color: #555;
  }
  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? '#52525B' : '#f0f0f0')};
  }
`

// 결과 없을 때
const NoResult = styled.div`
  text-align: center;
  color: #9ca3af;
  font-size: 1rem;
  margin: 40px 0;
`

// BaseContainer에 애니메이션 적용
const AnimatedContainer = styled(BaseContainer)<{ $animate?: boolean }>`
  ${({ $animate }) =>
  $animate &&
  css`
      animation: ${fadeInUp} 0.3s ease both;
    `}
`

// 인터랙티브 정보 영역: role, tabIndex, 키보드 지원
const InteractiveInfo = styled.div`
  cursor: pointer;
  outline: none;
`

// 페이징 블록 계산
const calcPages = (totalPages: number, currentPage: number) => {
  const block = Math.floor((currentPage - 1) / 10)
  const start = block * 10 + 1
  const end = Math.min(start + 9, totalPages)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

type TabType = 'movie' | 'cast' | 'playlist' | 'member'

const TotalSearch: React.FC = () => {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()

  const q = params.get('query') || ''
  const p = parseInt(params.get('page') || '1', 10)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  // 리사이즈 감지
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const [tab, setTab] = useState<TabType>('movie')
  const [movies, setMovies] = useState<PageResult<Movie> | null>(null)
  const [casts, setCasts] = useState<PageResult<Cast> | null>(null)
  const [playlists, setPlaylists] = useState<PageResult<Playlist> | null>(null)
  const [users, setUsers] = useState<PageResult<User> | null>(null)
  const [loading, setLoading] = useState(false)

  // 탭 변경 시 초기화
  useEffect(() => {
    setParams({ query: q, page: '1' })
    setMovies(null)
    setCasts(null)
    setPlaylists(null)
    setUsers(null)
  }, [tab])

  // 데이터 로드
  useEffect(() => {
    if (!q) return
    setLoading(true)
    ;(async () => {
      try {
        if (tab === 'movie') {
          const res = await searchMovies(q, p)
          setMovies(prev =>
            isMobile && prev && p > 1
              ? { ...res, content: [...prev.content, ...res.content] }
              : res
          )
        }
        if (tab === 'cast') {
          const res = await searchCasts(q, p)
          setCasts(prev =>
            isMobile && prev && p > 1
              ? { ...res, content: [...prev.content, ...res.content] }
              : res
          )
        }
        if (tab === 'playlist') {
          const res = await searchPlaylists(q, p - 1) // 0-based
          setPlaylists(prev =>
            isMobile && prev && p > 1
              ? { ...res, content: [...prev.content, ...res.content] }
              : res
          )
        }
        if (tab === 'member') {
          const res = await searchUsers(q, p - 1) // 0-based
          setUsers(prev =>
            isMobile && prev && p > 1
              ? { ...res, content: [...prev.content, ...res.content] }
              : res
          )
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [q, p, tab, isMobile])

  // 모바일 무한 스크롤
  useEffect(() => {
    if (!isMobile) return
    const onScroll = () => {
      const data =
        tab === 'movie'
          ? movies
          : tab === 'cast'
            ? casts
            : tab === 'playlist'
              ? playlists
              : users
      if (
        !loading &&
        data &&
        !data.last &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        setParams({ query: q, page: (p + 1).toString() })
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile, loading, movies, casts, playlists, users, tab, p, q])

  // 페이지 이동
  const goPage = (np: number) => setParams({ query: q, page: np.toString() })

  // 로그인 여부 확인
  const accessToken = localStorage.getItem('accessToken')

  // 키보드 Enter/Space 처리
  const handleKey = (e: KeyboardEvent<HTMLDivElement>, fn: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fn()
    }
  }

  return (
    <PageWrapper>
      <Content>
        <Title>“{q}”의 검색결과</Title>
        <TabCountRow>
          <Tabs>
            <Tab $active={tab === 'movie'} onClick={() => setTab('movie')}>
              영화
            </Tab>
            <Tab $active={tab === 'cast'} onClick={() => setTab('cast')}>
              인물
            </Tab>
            <Tab $active={tab === 'playlist'} onClick={() => setTab('playlist')}>
              플레이리스트
            </Tab>
            <Tab $active={tab === 'member'} onClick={() => setTab('member')}>
              회원
            </Tab>
          </Tabs>
          <CountText>
            총{' '}
            {tab === 'movie'
              ? movies?.totalElements ?? 0
              : tab === 'cast'
                ? casts?.totalElements ?? 0
                : tab === 'playlist'
                  ? playlists?.totalElements ?? 0
                  : users?.totalElements ?? 0}
            개
          </CountText>
        </TabCountRow>

        {/* 영화 탭 */}
        {tab === 'movie' && movies && (
          movies.content.length === 0 ? (
            <NoResult>검색결과가 없습니다.</NoResult>
          ) : (
            <>
              <Grid cols={5}>
                {movies.content.map(m => (
                  <Card
                    key={m.tmdbId}
                    onClick={() => navigate(`/movie/detail/${m.tmdbId}`)}
                    $animate={!isMobile || p === 1}
                  >
                    <ImageLoader
                      src={m.image}
                      alt={m.title}
                      width="100%"
                      height="300px"
                    />
                    <CardBody>
                      <CardTitle>{m.title}</CardTitle>
                      <CardSub>
                        {m.releaseDate ? m.releaseDate.slice(0, 4) : '(개봉예정)'}
                      </CardSub>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
              {!isMobile && movies.totalPages > 1 && (
                <Pager>
                  <PageButton disabled={p <= 1} onClick={() => goPage(1)}>
                    <ChevronsLeft size={16} />
                  </PageButton>
                  <PageButton disabled={p <= 1} onClick={() => goPage(p - 1)}>
                    <ChevronLeft size={16} />
                  </PageButton>
                  {calcPages(movies.totalPages, p).map(page => (
                    <PageButton
                      key={page}
                      $active={p === page}
                      onClick={() => goPage(page)}
                    >
                      {page}
                    </PageButton>
                  ))}
                  <PageButton
                    disabled={p >= movies.totalPages}
                    onClick={() => goPage(p + 1)}
                  >
                    <ChevronRight size={16} />
                  </PageButton>
                  <PageButton
                    disabled={p >= movies.totalPages}
                    onClick={() => goPage(movies.totalPages)}
                  >
                    <ChevronsRight size={16} />
                  </PageButton>
                </Pager>
              )}
            </>
          )
        )}

        {/* 인물 탭 */}
        {tab === 'cast' && casts && (
          casts.content.length === 0 ? (
            <NoResult>검색결과가 없습니다.</NoResult>
          ) : (
            <>
              <Grid cols={2}>
                {casts.content.map(c => (
                  <CastCard
                    key={c.tmdbId}
                    onClick={() => navigate(`/filmography/${c.tmdbId}`)}
                    $animate={!isMobile || p === 1}
                  >
                    <ImageLoader
                      src={c.profileImage}
                      alt={c.name}
                      width="100px"
                      height="100px"
                    />
                    <CastInfo>
                      <CardTitle>{c.name}</CardTitle>
                      <TagList>
                        {c.knownFor.map((t, i) => (
                          <Tag key={i}>{t}</Tag>
                        ))}
                      </TagList>
                    </CastInfo>
                  </CastCard>
                ))}
              </Grid>
              {!isMobile && casts.totalPages > 1 && (
                <Pager>
                  <PageButton disabled={p <= 1} onClick={() => goPage(1)}>
                    <ChevronsLeft size={16} />
                  </PageButton>
                  <PageButton disabled={p <= 1} onClick={() => goPage(p - 1)}>
                    <ChevronLeft size={16} />
                  </PageButton>
                  {calcPages(casts.totalPages, p).map(page => (
                    <PageButton
                      key={page}
                      $active={p === page}
                      onClick={() => goPage(page)}
                    >
                      {page}
                    </PageButton>
                  ))}
                  <PageButton
                    disabled={p >= casts.totalPages}
                    onClick={() => goPage(p + 1)}
                  >
                    <ChevronRight size={16} />
                  </PageButton>
                  <PageButton
                    disabled={p >= casts.totalPages}
                    onClick={() => goPage(casts.totalPages)}
                  >
                    <ChevronsRight size={16} />
                  </PageButton>
                </Pager>
              )}
            </>
          )
        )}

        {/* 플레이리스트 탭 */}
        {tab === 'playlist' && playlists && (
          playlists.content.length === 0 ? (
            <NoResult>검색결과가 없습니다.</NoResult>
          ) : (
            <>
              <Grid cols={5}>
                {playlists.content.map(pl => (
                  <Card
                    key={pl.playListId}
                    onClick={() => navigate(`/playlist/${pl.playListId}`)}
                    $animate={!isMobile || p === 1}
                  >
                    <ImageLoader
                      src={pl.thumbnailUrl}
                      alt={pl.title}
                      width="100%"
                      height="300px"
                    />
                    <CardBody>
                      <CardTitle>{pl.title}</CardTitle>
                      <BottomRow>
                        <CreatorName>{pl.nickname}</CreatorName>
                        <MovieCount>{pl.movieCount}개</MovieCount>
                      </BottomRow>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
              {!isMobile && playlists.totalPages > 1 && (
                <Pager>
                  <PageButton disabled={p <= 1} onClick={() => goPage(1)}>
                    <ChevronsLeft size={16} />
                  </PageButton>
                  <PageButton disabled={p <= 1} onClick={() => goPage(p - 1)}>
                    <ChevronLeft size={16} />
                  </PageButton>
                  {calcPages(playlists.totalPages, p).map(page => (
                    <PageButton
                      key={page}
                      $active={p === page}
                      onClick={() => goPage(page)}
                    >
                      {page}
                    </PageButton>
                  ))}
                  <PageButton
                    disabled={p >= playlists.totalPages}
                    onClick={() => goPage(p + 1)}
                  >
                    <ChevronRight size={16} />
                  </PageButton>
                  <PageButton
                    disabled={p >= playlists.totalPages}
                    onClick={() => goPage(playlists.totalPages)}
                  >
                    <ChevronsRight size={16} />
                  </PageButton>
                </Pager>
              )}
            </>
          )
        )}

        {/* 회원 탭 */}
        {tab === 'member' && users && (
          users.content.length === 0 ? (
            <NoResult>검색결과가 없습니다.</NoResult>
          ) : (
            <>
              <Grid cols={3}>
                {users.content.map(u => (
                  <AnimatedContainer
                    key={u.memberId}
                    $animate={!isMobile || p === 1}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '12px',
                    }}
                  >
                    <Avatar size="80px">
                      {u.profileImage ? (
                        <img src={u.profileImage} alt={u.nickname} />
                      ) : (
                        u.nickname.charAt(0)
                      )}
                    </Avatar>

                    <InteractiveInfo
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/my-page?id=${u.memberId}`)}
                      onKeyDown={e =>
                        handleKey(e, () => navigate(`/my-page?id=${u.memberId}`))
                      }
                    >
                      <CardTitle>{u.nickname}</CardTitle>
                      <CardSub>팔로워 {u.followCnt}명</CardSub>
                    </InteractiveInfo>

                    <div style={{ marginLeft: 'auto' }}>
                      <BaseButton
                        variant={u.followed ? 'dark' : 'orange'}
                        disabled={!accessToken}
                        onClick={async () => {
                          if (!accessToken) return
                          const now = await toggleFollow(u.memberId, u.followed)
                          u.followed = now
                          u.followCnt += now ? 1 : -1
                          setUsers({ ...users })
                        }}
                      >
                        {u.followed ? '팔로잉' : '팔로우'}
                      </BaseButton>
                    </div>
                  </AnimatedContainer>
                ))}
              </Grid>

              {!isMobile && users.totalPages > 1 && (
                <Pager>
                  <PageButton disabled={p <= 1} onClick={() => goPage(1)}>
                    <ChevronsLeft size={16} />
                  </PageButton>
                  <PageButton disabled={p <= 1} onClick={() => goPage(p - 1)}>
                    <ChevronLeft size={16} />
                  </PageButton>
                  {calcPages(users.totalPages, p).map(page => (
                    <PageButton
                      key={page}
                      $active={p === page}
                      onClick={() => goPage(page)}
                    >
                      {page}
                    </PageButton>
                  ))}
                  <PageButton disabled={p >= users.totalPages} onClick={() => goPage(p + 1)}>
                    <ChevronRight size={16} />
                  </PageButton>
                  <PageButton disabled={p >= users.totalPages} onClick={() => goPage(users.totalPages)}>
                    <ChevronsRight size={16} />
                  </PageButton>
                </Pager>
              )}
            </>
          )
        )}
      </Content>
    </PageWrapper>
  )
}

export default TotalSearch