import React, { useState, useEffect, FormEvent } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styled, { keyframes, css } from 'styled-components'
import {
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
    Search as SearchIcon,
} from 'lucide-react'
import BackgroundImage from '@/assets/common/backgroud_tile_512px.png'
import FlipflickTransparency from '@/assets/common/flipflick_transparency.png'
import { searchMovies, searchCasts } from '@/services/totalSearch'

// 애니메이션: 카드 페이드 인/업 효과
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`

// 애니메이션: 스켈레톤 로더 반짝임 효과
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`

// 페이지 전체 래퍼: 배경 이미지, 최소 높이, 가운데 정렬
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

// 콘텐츠 최대 너비 및 기본 패딩, 모바일 반응형 처리
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

// 검색 폼 래퍼
const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`

// 검색 입력창 래퍼
const SearchInputWrapper = styled.div`
  position: relative;
  width: 600px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 600px;
  }
`

// 실제 검색 입력창
const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: none;
  border-radius: 4px;
  background: rgba(255,255,255,0.1);
  color: #fff;
  font-size: 1rem;

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 768px) {
    width: 83vw;
    max-width: calc(100% - 32px);
  }
`

// 검색 아이콘
const SearchBtnIcon = styled(SearchIcon)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`

// 제목 스타일
const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0 0 16px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

// 탭과 카운트 영역
const TabCountRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

// 탭 버튼 래퍼
const Tabs = styled.div`
  display: flex;
  gap: 32px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`

// 개별 탭 스타일
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

// 총 개수 텍스트
const CountText = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
`

// 결과 카드 그리드
const Grid = styled.div<{ cols: number }>`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(${p => p.cols}, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`

// 기본 카드 스타일, 모바일 시 가로형
const Card = styled.div<{ $animate?: boolean }>`
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
`

// 카드 본문 영역
const CardBody = styled.div`
  padding: 12px;

  @media (max-width: 768px) {
    flex: 1;
    padding: 12px 12px 12px 0;
  }
`

// 카드 제목
const CardTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
`

// 카드 부제목(연도 등)
const CardSub = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
`

// 출연작품 태그리스트
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

// 캐스트 카드: 항상 가로형
const CastCard = styled(Card)`
  display: flex;
  align-items: center;
`
const CastInfo = styled.div`
  flex: 1;
  padding: 12px 0;
  margin-left: 16px;
`

// 이미지 로더 래퍼(스켈레톤)
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

// 이미지 로더 컴포넌트: 로딩/에러 처리
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
                    src={FlipflickTransparency}
                    alt="placeholder"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            )}
        </ImageWrapper>
    )
}

// 데스크탑 전용 페이지네이션 래퍼
const Pager = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 32px;
  flex-wrap: wrap;
`

// 페이지 버튼 스타일
const PageButton = styled.button<{ $active?: boolean; disabled?: boolean }>`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? '#52525B' : '#fff')};
  color: ${({ $active, disabled }) =>
    disabled ? '#555' : $active ? '#fff' : '#000'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transition: background 0.2s;

  &:hover {
    background: ${({ $active, disabled }) =>
    disabled
        ? $active
            ? '#52525B'
            : '#fff'
        : $active
            ? '#52525B'
            : '#f0f0f0'};
  }
`

// 결과 없을 때 표시
const NoResult = styled.div`
  text-align: center;
  color: #9ca3af;
  font-size: 1rem;
  margin: 40px 0;
`

// 타입 정의
interface PageResult<T> {
    totalElements: number
    totalPages: number
    page: number
    size: number
    content: T[]
    last: boolean // 무한스크롤용 마지막 페이지 여부
}
interface Movie {
    tmdbId: number
    title: string
    releaseDate: string | null
    image: string | null
}
interface Cast {
    tmdbId: number
    name: string
    profileImage: string | null
    knownFor: string[]
}

// 페이지 버튼 계산: 블록 단위(1–10, 11–20, ...)
const calcPages = (totalPages: number, currentPage: number) => {
    const block = Math.floor((currentPage - 1) / 10)
    const start = block * 10 + 1
    const end = Math.min(start + 9, totalPages)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

// 메인 컴포넌트
const TotalSearch: React.FC = () => {
    const [params, setParams] = useSearchParams()
    const navigate = useNavigate()

    const q = params.get('query') || ''       // 검색어
    const p = parseInt(params.get('page') || '1', 10) // URL 페이지
    const [input, setInput] = useState(q)
    const [tab, setTab] = useState<'movie' | 'cast'>('movie')
    const [movies, setMovies] = useState<PageResult<Movie> | null>(null)
    const [casts, setCasts] = useState<PageResult<Cast> | null>(null)
    const [loading, setLoading] = useState(false)

    // 탭 변경 시 page 파라미터 1로 리셋
    useEffect(() => {
        setParams({ query: q, page: '1' })
    }, [tab])

    // 검색어 변경 시 데이터 초기화
    const [pageState, setPageState] = useState(p)
    useEffect(() => {
        setPageState(1)
        setMovies(null)
        setCasts(null)
    }, [q])

    // 모바일 여부 체크
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    // 현재 페이지 결정 (모바일 무한스크롤용)
    useEffect(() => {
        setPageState(p)
    }, [p])
    const currentPage = isMobile ? pageState : p

    const initialLoading = loading && currentPage === 1

    // 검색 실행
    const onSearch = (e: FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return
        setParams({ query: input.trim(), page: '1' })
    }

    // 페이지 이동
    const goPage = (np: number) => {
        if (isMobile) setPageState(np)
        else setParams({ query: q, page: np.toString() })
    }

    // 모바일 무한스크롤
    useEffect(() => {
        if (!isMobile) return
        const onScroll = () => {
            if (loading) return
            const data = tab === 'movie' ? movies : casts
            if (
                data &&
                !data.last &&
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
            ) {
                goPage(currentPage + 1)
            }
        }
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [isMobile, loading, movies, casts, tab, currentPage])

    // 데이터 호출
    useEffect(() => {
        if (!q) return
        setLoading(true)
        Promise.all([searchMovies(q, currentPage), searchCasts(q, currentPage)])
            .then(([mv, ct]) => {
                if (isMobile && currentPage > 1) {
                    // 모바일 추가 로드 시 이어 붙임
                    setMovies(prev =>
                        prev ? { ...mv, content: [...prev.content, ...mv.content] } : mv
                    )
                    setCasts(prev =>
                        prev ? { ...ct, content: [...prev.content, ...ct.content] } : ct
                    )
                } else {
                    setMovies(mv)
                    setCasts(ct)
                }
            })
            .finally(() => setLoading(false))
    }, [q, currentPage, isMobile])

    return (
        <PageWrapper>
            <Content>
                {/* 검색창 */}
                <SearchForm onSubmit={onSearch}>
                    <SearchInputWrapper>
                        <SearchBtnIcon size={18} />
                        <SearchInput
                            placeholder="영화 또는 인물 검색"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                    </SearchInputWrapper>
                </SearchForm>

                {/* 제목 + 탭 + 총개수 */}
                <Title>“{q}”의 검색결과</Title>
                <TabCountRow>
                    <Tabs>
                        <Tab $active={tab === 'movie'} onClick={() => setTab('movie')}>
                            영화
                        </Tab>
                        <Tab $active={tab === 'cast'} onClick={() => setTab('cast')}>
                            인물
                        </Tab>
                    </Tabs>
                    <CountText>
                        총 {tab === 'movie' ? movies?.totalElements ?? 0 : casts?.totalElements ?? 0}개
                    </CountText>
                </TabCountRow>

                {/* 영화 그리드 */}
                {!initialLoading && tab === 'movie' && movies && (
                    <>
                        {movies.content.length === 0 ? (
                            <NoResult>검색결과가 없습니다.</NoResult>
                        ) : (
                            <>
                                <Grid cols={5}>
                                    {movies.content.map(m => (
                                        <Card
                                            key={m.tmdbId}
                                            onClick={() => navigate(`/movies/${m.tmdbId}`)}
                                            $animate={isMobile ? currentPage === 1 : true}
                                        >
                                            <ImageLoader
                                                src={m.image ?? FlipflickTransparency}
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

                                {/* 데스크탑 페이징 */}
                                {!isMobile && movies.totalPages > 1 && (
                                    <Pager>
                                        <PageButton disabled={p <= 1} onClick={() => goPage(1)}>
                                            <ChevronsLeft size={16} />
                                        </PageButton>
                                        <PageButton disabled={p <= 1} onClick={() => goPage(p - 1)}>
                                            <ChevronLeft size={16} />
                                        </PageButton>
                                        {calcPages(movies.totalPages, currentPage).map(page => (
                                            <PageButton
                                                key={page}
                                                $active={p === page}
                                                onClick={() => goPage(page)}
                                            >
                                                {page}
                                            </PageButton>
                                        ))}
                                        <PageButton disabled={p >= movies.totalPages} onClick={() => goPage(p + 1)}>
                                            <ChevronRight size={16} />
                                        </PageButton>
                                        <PageButton disabled={p >= movies.totalPages} onClick={() => goPage(movies.totalPages)}>
                                            <ChevronsRight size={16} />
                                        </PageButton>
                                    </Pager>
                                )}
                            </>
                        )}
                    </>
                )}

                {/* 인물 그리드 */}
                {!initialLoading && tab === 'cast' && casts && (
                    <>
                        {casts.content.length === 0 ? (
                            <NoResult>검색결과가 없습니다.</NoResult>
                        ) : (
                            <>
                                <Grid cols={2}>
                                    {casts.content.map(c => (
                                        <CastCard
                                            key={c.tmdbId}
                                            onClick={() => navigate(`/filmography/${c.tmdbId}`)}
                                            $animate={isMobile ? currentPage === 1 : true}
                                        >
                                            <ImageLoader
                                                src={c.profileImage ?? FlipflickTransparency}
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

                                {/* 데스크탑 페이징 */}
                                {!isMobile && casts.totalPages > 1 && (
                                    <Pager>
                                        <PageButton disabled={p <= 1} onClick={() => goPage(1)}>
                                            <ChevronsLeft size={16} />
                                        </PageButton>
                                        <PageButton disabled={p <= 1} onClick={() => goPage(p - 1)}>
                                            <ChevronLeft size={16} />
                                        </PageButton>
                                        {calcPages(casts.totalPages, currentPage).map(page => (
                                            <PageButton
                                                key={page}
                                                $active={p === page}
                                                onClick={() => goPage(page)}
                                            >
                                                {page}
                                            </PageButton>
                                        ))}
                                        <PageButton disabled={p >= casts.totalPages} onClick={() => goPage(p + 1)}>
                                            <ChevronRight size={16} />
                                        </PageButton>
                                        <PageButton disabled={p >= casts.totalPages} onClick={() => goPage(casts.totalPages)}>
                                            <ChevronsRight size={16} />
                                        </PageButton>
                                    </Pager>
                                )}
                            </>
                        )}
                    </>
                )}
            </Content>
        </PageWrapper>
    )
}

export default TotalSearch
