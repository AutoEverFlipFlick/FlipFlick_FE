import React, { useState, useEffect, FormEvent } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
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

// 애니메이션 정의
const fadeInUp = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
`
const shimmer = keyframes`
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
`

// 레이아웃 컨테이너
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

// 검색폼
const SearchForm = styled.form`
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
`
const SearchInputWrapper = styled.div`
    position: relative;
    width: 600px;

    @media (max-width: 768px) {
        width: 100%;
        max-width: 600px;
    }
`
const SearchInput = styled.input`
    width: 100%;
    padding: 10px 12px 10px 40px;
    border: none;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 1rem;
    &::placeholder { color: #9ca3af; }

    @media (max-width: 768px) {
        width: 83vw;
        max-width: calc(100% - 32px);
    }
`
const SearchBtnIcon = styled(SearchIcon)`
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: #9ca3af;
`

// 제목·탭·카운트
const Title = styled.h1`
    font-size: 1.5rem; margin: 0 0 16px;
    @media (max-width: 768px) { font-size: 1.25rem; }
`
const TabCountRow = styled.div`
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
`
const Tabs = styled.div`
    display: flex; gap: 32px;
    @media (max-width: 768px) { gap: 16px; }
`
const Tab = styled.div<{ $active: boolean }>`
    position: relative; cursor: pointer; font-size: 1rem;
    font-weight: ${({ $active }) => ($active ? 600 : 400)};
    color: ${({ $active }) => ($active ? '#F59E0B' : '#9CA3AF')};
    &:after {
        content: ''; position: absolute; bottom: -4px; left: 0;
        width: ${({ $active }) => ($active ? '100%' : '0')};
        height: 2px; background: #F59E0B; transition: width 0.3s;
    }
    @media (max-width: 768px) { font-size: 0.875rem; }
`
const CountText = styled.div`
    font-size: 0.875rem; color: #9ca3af;
`

// 그리드 & 카드 공통
const Grid = styled.div<{ cols: number }>`
    display: grid; gap: 24px;
    grid-template-columns: repeat(${(p) => p.cols}, 1fr);
    @media (max-width: 768px) {
        grid-template-columns: 1fr; gap: 16px;
    }
`
const Card = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    overflow: hidden;
    animation: ${fadeInUp} 0.3s ease both;
    cursor: pointer; transition: transform 0.2s;
    &:hover { transform: translateY(-4px); }

    @media (max-width: 768px) {
        display: flex;
        align-items: center;
    }
`
const CardBody = styled.div`
    padding: 12px;

    @media (max-width: 768px) {
        flex: 1;
        padding: 12px 12px 12px 0;
    }
`
const CardTitle = styled.h3`
    margin: 0 0 6px; font-size: 1rem;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    color: #fff;
`
const CardSub = styled.div` font-size: 0.875rem; color: #9ca3af; `

// TagList & Tag (출연작 pill)
const TagList = styled.div`
    display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;
`
const Tag = styled.span`
    display: inline-block; padding: 4px 8px; font-size: 0.875rem;
    background: rgba(255,255,255,0.1); border-radius: 12px;
    color: rgba(255,255,255,0.7);
`

// 캐스트 전용 카드 (항상 가로형 유지)
const CastCard = styled(Card)`
    display: flex; align-items: center;
`
const CastPoster = styled.img`
    width: 100px; height: 100px; object-fit: cover;
    background: #333; flex-shrink: 0; border-radius: 4px; margin-right: 16px;
`
const CastInfo = styled.div`
    flex: 1; padding: 12px 0;
`



// 이미지 로더 + 스켈레톤
const ImageWrapper = styled.div<{ width: string; height: string }>`
    position: relative;
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    background: #333; border-radius: 4px; overflow: hidden; flex-shrink: 0;

    @media (max-width: 768px) {
        width: 100px;
        height: 100px;
        margin-right: 12px;
    }
`
const Skeleton = styled.div`
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.1); overflow: hidden;
    &::before {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        animation: ${shimmer} 1.2s infinite;
    }
`
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
                    src={src} alt={alt}
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    style={{
                        display: loaded ? 'block' : 'none',
                        width: '100%', height: '100%', objectFit: 'cover',
                    }}
                />
            )}
            {error && (
                <img
                    src={FlipflickTransparency} alt="placeholder"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            )}
        </ImageWrapper>
    )
}

// 페이지네이션
const Pager = styled.div`
    display: flex; gap: 8px; justify-content: center;
    margin-top: 32px; flex-wrap: wrap;
`
const PageButton = styled.button<{ $active?: boolean; disabled?: boolean }>`
    width: 32px; height: 32px; border: none; border-radius: 8px;
    background: ${({ $active }) => ($active ? '#52525B' : '#fff')};
    color: ${({ $active, disabled }) => (disabled ? '#555' : $active ? '#fff' : '#000')};
    display: flex; align-items: center; justify-content: center;
    font-size: 0.875rem; cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    transition: background 0.2s;
    &:hover {
        background: ${({ $active, disabled }) =>
                disabled ? ($active ? '#52525B' : '#fff') : $active ? '#52525B' : '#f0f0f0'};
    }
`

// 검색결과 없음
const NoResult = styled.div`
    text-align: center; color: #9ca3af; font-size: 1rem; margin: 40px 0;
`

// 타입 정의
interface PageResult<T> {
    totalElements: number
    totalPages: number
    page: number
    size: number
    content: T[]
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

// 메인 컴포넌트
const TotalSearch: React.FC = () => {
    const [params, setParams] = useSearchParams()
    const navigate = useNavigate()

    const q = params.get('query') || ''
    const p = parseInt(params.get('page') || '1', 10)
    const [input, setInput] = useState(q)
    const [tab, setTab] = useState<'movie' | 'cast'>('movie')
    const [movies, setMovies] = useState<PageResult<Movie> | null>(null)
    const [casts, setCasts] = useState<PageResult<Cast> | null>(null)
    const [loading, setLoading] = useState(false)

    // 검색 실행
    const onSearch = (e: FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return
        setParams({ query: input.trim(), page: '1' })
    }

    // 데이터 로드
    useEffect(() => {
        if (!q) return
        setLoading(true)
        Promise.all([searchMovies(q, p), searchCasts(q, p)])
            .then(([mv, ct]) => {
                setMovies(mv)
                setCasts(ct)
            })
            .finally(() => setLoading(false))
    }, [q, p])

    // 페이지 이동
    const goPage = (np: number) => setParams({ query: q, page: np.toString() })

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
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </SearchInputWrapper>
                </SearchForm>

                {/* 제목 + 탭 + 총개수 */}
                <Title>"{q}"의 검색결과</Title>
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
                {!loading && tab === 'movie' && movies && (
                    <>
                        {movies.content.length === 0 ? (
                            <NoResult>검색결과가 없습니다.</NoResult>
                        ) : (
                            <>
                                <Grid cols={5}>
                                    {movies.content.map((m) => (
                                        <Card
                                            key={m.tmdbId}
                                            onClick={() => navigate(`/movies/${m.tmdbId}`)}
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
                                {movies.totalPages > 1 && (
                                    <Pager>
                                        <PageButton disabled={p <= 1} onClick={() => p > 1 && goPage(1)}>
                                            <ChevronsLeft size={16} />
                                        </PageButton>
                                        <PageButton disabled={p <= 1} onClick={() => p > 1 && goPage(p - 1)}>
                                            <ChevronLeft size={16} />
                                        </PageButton>
                                        {Array.from({ length: movies.totalPages }, (_, i) => (
                                            <PageButton
                                                key={i + 1}
                                                $active={p === i + 1}
                                                onClick={() => goPage(i + 1)}
                                            >
                                                {i + 1}
                                            </PageButton>
                                        ))}
                                        <PageButton
                                            disabled={p >= movies.totalPages}
                                            onClick={() => p < movies.totalPages && goPage(p + 1)}
                                        >
                                            <ChevronRight size={16} />
                                        </PageButton>
                                        <PageButton
                                            disabled={p >= movies.totalPages}
                                            onClick={() =>
                                                p < movies.totalPages && goPage(movies.totalPages)
                                            }
                                        >
                                            <ChevronsRight size={16} />
                                        </PageButton>
                                    </Pager>
                                )}
                            </>
                        )}
                    </>
                )}

                {/* 인물 그리드 */}
                {!loading && tab === 'cast' && casts && (
                    <>
                        {casts.content.length === 0 ? (
                            <NoResult>검색결과가 없습니다.</NoResult>
                        ) : (
                            <>
                                <Grid cols={2}>
                                    {casts.content.map((c) => (
                                        <CastCard
                                            key={c.tmdbId}
                                            onClick={() => navigate(`/casts/${c.tmdbId}`)}
                                        >
                                            <CastPoster
                                                src={c.profileImage ?? FlipflickTransparency}
                                                alt={c.name}
                                            />
                                            <CastInfo>
                                                <CardTitle>{c.name}</CardTitle>
                                                <TagList>
                                                    {c.knownFor.map((p, i) => (
                                                        <Tag key={i}>{p}</Tag>
                                                    ))}
                                                </TagList>
                                            </CastInfo>
                                        </CastCard>
                                    ))}
                                </Grid>
                                {casts.totalPages > 1 && (
                                    <Pager>
                                        <PageButton disabled={p <= 1} onClick={() => p > 1 && goPage(1)}>
                                            <ChevronsLeft size={16} />
                                        </PageButton>
                                        <PageButton disabled={p <= 1} onClick={() => p > 1 && goPage(p - 1)}>
                                            <ChevronLeft size={16} />
                                        </PageButton>
                                        {Array.from({ length: casts.totalPages }, (_, i) => (
                                            <PageButton
                                                key={i + 1}
                                                $active={p === i + 1}
                                                onClick={() => goPage(i + 1)}
                                            >
                                                {i + 1}
                                            </PageButton>
                                        ))}
                                        <PageButton
                                            disabled={p >= casts.totalPages}
                                            onClick={() => p < casts.totalPages && goPage(p + 1)}
                                        >
                                            <ChevronRight size={16} />
                                        </PageButton>
                                        <PageButton
                                            disabled={p >= casts.totalPages}
                                            onClick={() =>
                                                p < casts.totalPages && goPage(casts.totalPages)
                                            }
                                        >
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