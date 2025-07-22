import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import Swal from 'sweetalert2'
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import BaseButton from '../../components/common/BaseButton'
import {
  getPlaylistDetail,
  deletePlaylist,
  PlaylistDetail as PlaylistDetailType,
} from '../../services/playlist'
import { useBookmark } from '../../context/BookmarkContext'
import { useAuth } from '../../context/AuthContext'

// 애니메이션 정의
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
`

const Container = styled.div`
  color: white;
  min-height: 100vh;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333;
    @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`

const LeftSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`
const RightSection = styled.div`
  display: flex;
  gap: 1rem;

  @media(max-width: 768px){
    width: 100%;
    justify-content: flex-end;
    gap: 0.5rem;
  }
`

const BackButton = styled.button`
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ff7849;
    background: rgba(255, 120, 73, 0.1);
  }
`

const TitleSection = styled.div`
  flex: 1;
`

const PlaylistTitle = styled.h1`
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  font-weight: bold;
`

const PlaylistMeta = styled.div`
  color: #aaa;
  font-size: 1rem;
  margin-bottom: 1rem;
`

const BookmarkButton = styled.button<{ $isBookmarked: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => (props.$isBookmarked ? '#ff7849' : 'transparent')};
  border: 2px solid ${props => (props.$isBookmarked ? '#ff7849' : '#555')};
  color: ${props => (props.$isBookmarked ? 'white' : '#ccc')};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => (props.$isBookmarked ? '#e66a42' : '#ff7849')};
    border-color: ${props => (props.$isBookmarked ? '#e66a42' : '#ff7849')};
    color: white;
  }

    @media(max-width: 768px){
      display: flex;
      align-items: flex-end;
      width: 50%;      
  }
`

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.5s ease;
`

const MovieCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`

const ImageSkeleton = styled.div`
  width: 100%;
  height: 100%;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.8rem;
  text-align: center;
  flex-direction: column;
  gap: 0.5rem;
`

const MovieImage = styled.img<{ $loaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${props => (props.$loaded ? 'block' : 'none')};
`

const NoImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.8rem;
  text-align: center;
  flex-direction: column;
  gap: 0.5rem;
`

const MovieInfo = styled.div`
  padding: 0.5rem;
`

const MovieTitle = styled.h3`
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  color: #fff;
`;

const MovieYear = styled.span`
  font-size: 0.8rem;
  color: #aaa;
`

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`

const PaginationButton = styled.button<{ $active?: boolean }>`
  background: ${props => (props.$active ? '#ff7849' : 'transparent')};
  border: 1px solid ${props => (props.$active ? '#ff7849' : '#555')};
  color: ${props => (props.$active ? 'white' : '#ccc')};
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #ff7849;
    color: white;
    border-color: #ff7849;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background: transparent;
      color: #555;
      border-color: #555;
    }
  }
`

const LoadingMessage = styled.div`
  text-align: center;
  color: #ccc;
  font-size: 1.1rem;
  margin: 4rem 0;
`

const ErrorMessage = styled.div`
  text-align: center;
  color: #ff4444;
  font-size: 1.1rem;
  margin: 4rem 0;
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`

const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #aaa;
`

const BreadcrumbItem = styled.button`
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
  transition: color 0.2s;

  &:hover {
    color: #ff7849;
  }
`

const BreadcrumbSeparator = styled.span`
  margin: 0 0.5rem;
  color: #666;
`

const CurrentPage = styled.span`
  color: #fff;
  font-weight: 500;
`

// 이미지 로더 컴포넌트
const ImageLoader: React.FC<{
  src: string
  alt: string
  onError?: () => void
}> = ({ src, alt, onError }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setLoaded(true)
  }

  const handleError = () => {
    setError(true)
    setLoaded(false)
    onError?.()
  }

  return (
    <ImageContainer>
      {!src || src === 'null' || src.trim() === '' ? (
        <NoImagePlaceholder>
          <ImageIcon size={24} />
          <span>포스터 없음</span>
        </NoImagePlaceholder>
      ) : (
        <>
          {!loaded && !error && <ImageSkeleton>이미지 로딩 중...</ImageSkeleton>}

          {!error && (
            <MovieImage
              src={src}
              alt={alt}
              $loaded={loaded}
              onLoad={handleLoad}
              onError={handleError}
            />
          )}

          {error && (
            <NoImagePlaceholder>
              <ImageIcon size={24} />
              <span>포스터 없음</span>
            </NoImagePlaceholder>
          )}
        </>
      )}
    </ImageContainer>
  )
}

const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { isBookmarked, toggleBookmark } = useBookmark()

  const [playlist, setPlaylist] = useState<PlaylistDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookmarking, setBookmarking] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [loadingPage, setLoadingPage] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [allMovies, setAllMovies] = useState<any[]>([])
  const moviesPerPage = 18

  const containerRef = useRef<HTMLDivElement>(null)

  // 플레이리스트 상세 정보 가져오기
  const fetchPlaylistDetail = async (page: number = 0, append = false) => {
    if (!id) return

    if (page === 0 && !append) {
      setLoading(true)
    } else {
      setLoadingPage(true)
    }
    setError(null)

    try {
      const response = await getPlaylistDetail(id, page, moviesPerPage)

      if (response.success) {
        const playlistData = response.data

        // 권한 검사: hidden이 true인 경우 작성자만 접근 가능
        if (playlistData.hidden) {
          if (!user || user.nickname !== playlistData.nickname) {
            await Swal.fire({
              title: '접근 권한 없음',
              text: '비공개 플레이리스트는 작성자만 볼 수 있습니다.',
              icon: 'error',
              confirmButtonText: '확인',
              confirmButtonColor: '#FF7849'
            })
            navigate('/playlist')
            return
          }
        }

        setPlaylist(playlistData)
        setCurrentPage(page)

        // 무한스크롤: 영화 누적
        if (append) {
          setAllMovies(prev => [...prev, ...(playlistData.movies.content || [])])
        } else {
          setAllMovies(playlistData.movies.content || [])
        }
      } else {
        setError(response.message || '플레이리스트를 불러올 수 없습니다.')
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        await Swal.fire({
          title: '네트워크 오류',
          text: '네트워크 오류가 발생했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
          confirmButtonColor: '#FF7849'
        })
        navigate('/playlist')
        return
      }

      setError(err.response?.data?.message || '플레이리스트를 불러오는 중 오류가 발생했습니다.')
      console.error('Error fetching playlist detail:', err)
    } finally {
      setLoading(false)
      setLoadingPage(false)
      setIsFetchingMore(false)
    }
  }

  // 북마크 토글
  const handleToggleBookmark = async () => {
    if (!playlist || bookmarking) return
    
    if (!isAuthenticated) {
      const result = await Swal.fire({
        title: '로그인이 필요합니다',
        text: '북마크 기능을 이용하려면 로그인이 필요합니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '로그인하러 가기',
        cancelButtonText: '취소',
        confirmButtonColor: '#FF7849',
        cancelButtonColor: '#6c757d'
      })

      if (result.isConfirmed) {
        navigate('/login')
      }
      return
    }

    setBookmarking(true)

    try {
      const success = await toggleBookmark(playlist.playListId.toString())

      if (success) {
        setPlaylist(prev =>
          prev
            ? {
              ...prev,
              isBookmarked: !prev.isBookmarked,
              bookmarkCount: prev.isBookmarked ? prev.bookmarkCount - 1 : prev.bookmarkCount + 1,
            }
            : null,
        )
      } else {
        await Swal.fire({
          title: '북마크 실패',
          text: '북마크 처리에 실패했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
          confirmButtonColor: '#FF7849'
        })
      }
    } catch (err: any) {
      console.error('Error toggling bookmark:', err)
      await Swal.fire({
        title: '오류 발생',
        text: '북마크 처리 중 오류가 발생했습니다.',
        icon: 'error',
        confirmButtonText: '확인',
        confirmButtonColor: '#FF7849'
      })
    } finally {
      setBookmarking(false)
    }
  }

  // 플레이리스트 삭제 함수
  const handleDeletePlaylist = async () => {
    if (!playlist || deleting) return

    if (!isAuthenticated || !user) {
      const result = await Swal.fire({
        title: '로그인이 필요합니다',
        text: '플레이리스트를 삭제하려면 로그인이 필요합니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '로그인하러 가기',
        cancelButtonText: '취소',
        confirmButtonColor: '#FF7849',
        cancelButtonColor: '#6c757d'
      })

      if (result.isConfirmed) {
        navigate('/login')
      }
      return
    }

    // 작성자 확인
    if (user.nickname !== playlist.nickname) {
      await Swal.fire({
        title: '권한 없음',
        text: '삭제 권한이 없습니다.',
        icon: 'error',
        confirmButtonText: '확인',
        confirmButtonColor: '#FF7849'
      })
      return
    }

    // 삭제 확인
    const result = await Swal.fire({
      title: '플레이리스트 삭제',
      text: `"${playlist.title}" 플레이리스트를 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      reverseButtons: true
    })

    if (!result.isConfirmed) return

    setDeleting(true)

    try {
      const response = await deletePlaylist(id!)

      if (response.success) {
        await Swal.fire({
          title: '삭제 완료',
          text: '플레이리스트가 성공적으로 삭제되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
          confirmButtonColor: '#FF7849'
        })
        navigate('/playlist')
      } else {
        await Swal.fire({
          title: '삭제 실패',
          text: response.message || '플레이리스트 삭제에 실패했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
          confirmButtonColor: '#FF7849'
        })
      }
    } catch (err: any) {
      console.error('Delete playlist error:', err)

      let errorMessage = '플레이리스트 삭제 중 오류가 발생했습니다.'

      if (err.response?.status === 403) {
        errorMessage = '삭제 권한이 없습니다.'
      } else if (err.response?.status === 404) {
        errorMessage = '플레이리스트를 찾을 수 없습니다.'
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      }

      await Swal.fire({
        title: '오류 발생',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: '확인',
        confirmButtonColor: '#FF7849'
      })
    } finally {
      setDeleting(false)
    }
  }

  // 북마크 상태 동기화
  useEffect(() => {
    if (playlist && isAuthenticated) {
      const contextBookmarkState = isBookmarked(playlist.playListId.toString())
      if (playlist.isBookmarked !== contextBookmarkState) {
        setPlaylist(prev =>
          prev
            ? {
              ...prev,
              isBookmarked: contextBookmarkState,
            }
            : null,
        )
      }
    }
  }, [playlist?.playListId, isBookmarked, isAuthenticated])

  // 페이지 변경 핸들러 (PC)
  const handlePageChange = (page: number) => {
    if (page !== currentPage && !loadingPage) {
      fetchPlaylistDetail(page)
    }
  }

  // 무한스크롤 감지 핸들러 (모바일)
  const handleScroll = useCallback(() => {
    if (
      loadingPage ||
      isFetchingMore ||
      !playlist ||
      currentPage >= playlist.movies.totalPages - 1 ||
      error
    )
      return
    const container = containerRef.current
    if (!container) return
    if (container.scrollHeight - container.scrollTop - container.clientHeight < 200) {
      setIsFetchingMore(true)
      fetchPlaylistDetail(currentPage + 1, true)
      setCurrentPage(prev => prev + 1)
    }
  }, [loadingPage, isFetchingMore, playlist, currentPage, error])

  // 모바일에서만 무한스크롤 적용
  useEffect(() => {
    const container = containerRef.current
    if (window.innerWidth > 768 || !container) return
    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // 탭/정렬 변경 시 스크롤 맨 위로
  useEffect(() => {
    const container = containerRef.current
    if (container) container.scrollTop = 0
  }, [id])

  // 초기 로드
  useEffect(() => {
    if (user !== undefined) {
      fetchPlaylistDetail()
    }
  }, [id, user])

  if (loading) {
    return (
      <Container ref={containerRef}>
        <LoadingMessage>로딩 중...</LoadingMessage>
      </Container>
    )
  }

  if (error || !playlist) {
    return (
      <Container ref={containerRef}>
        <ErrorMessage>{error || '플레이리스트를 찾을 수 없습니다.'}</ErrorMessage>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <BaseButton variant="orange" onClick={() => navigate(-1)}>
            돌아가기
          </BaseButton>
        </div>
      </Container>
    )
  }

  // 컴포넌트 내부에 추가
  const renderPageNumbers = () => {
    if (!playlist) return null;
    const pages = [];
    for (let i = 0; i < playlist.movies.totalPages; i++) {
      pages.push(
        <PaginationButton
          key={i}
          $active={i === currentPage}
          onClick={() => handlePageChange(i)}
          disabled={loadingPage}
        >
          {i + 1}
        </PaginationButton>
      );
    }
    return pages;
  };

  const bookmarkStatus =
    playlist && isAuthenticated ? isBookmarked(playlist.playListId.toString()) : false

  const isMobile = window.innerWidth <= 768
  const isOwner = user && playlist && user.nickname === playlist.nickname;

  return (
    <Container ref={containerRef}>
      <BreadcrumbNav>
        <BreadcrumbItem onClick={() => navigate('/playlist')}>플레이리스트</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <CurrentPage>{playlist.title}</CurrentPage>
      </BreadcrumbNav>

      <Header>
        <LeftSection>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </BackButton>
          <TitleSection>
            <PlaylistTitle>
              {playlist.title}
              {playlist.hidden && (
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: '#ff7849',
                    marginLeft: '0.5rem',
                    padding: '0.2rem 0.5rem',
                    border: '1px solid #ff7849',
                    borderRadius: '4px',
                  }}
                >
                  비공개
                </span>
              )}
            </PlaylistTitle>
            <PlaylistMeta>
              작성자: {playlist.nickname} | 영화 {playlist.movieCount}편
            </PlaylistMeta>
          </TitleSection>
        </LeftSection>

        <RightSection>
          {!isOwner && isAuthenticated && (
            <BookmarkButton
              $isBookmarked={bookmarkStatus}
              onClick={handleToggleBookmark}
              disabled={bookmarking}
            >
              {bookmarkStatus ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              {bookmarkStatus ? '관심 해제' : '관심 등록'}
            </BookmarkButton>
          )}

          {isOwner && (
            <>
              <BaseButton
                variant="dark"
                onClick={() => navigate(`/playlist/${id}/edit`)}
                disabled={deleting}
              >
                수정
              </BaseButton>
              <BaseButton variant="red" onClick={handleDeletePlaylist} disabled={deleting}>
                {deleting ? '삭제 중...' : '삭제'}
              </BaseButton>
            </>
          )}
        </RightSection>
      </Header>

      <div style={{ position: 'relative' }}>
        <MovieGrid style={{ opacity: loadingPage ? 0.5 : 1 }}>
          {(isMobile ? allMovies : playlist.movies.content).map(movie => (
            <MovieCard key={movie.movieId}>
              <ImageLoader
                src={movie.posterUrl}
                alt={movie.title}
                onError={() => console.log(`이미지 로딩 실패: ${movie.title}`)}
              />
              <MovieInfo>
                <MovieTitle>{movie.title}</MovieTitle>
                <MovieYear>{movie.releaseDate?.slice(0, 4) || '미정'}</MovieYear>
              </MovieInfo>
            </MovieCard>
          ))}
        </MovieGrid>

        {loadingPage && (
          <LoadingOverlay>
            <LoadingMessage>페이지를 불러오는 중...</LoadingMessage>
          </LoadingOverlay>
        )}
      </div>

      {/* PC에서만 페이지네이션 */}
      {!isMobile && playlist.movies.totalPages > 1 && (
        <Pagination>
          <PaginationButton
            disabled={currentPage === 0 || loadingPage}
            onClick={() => handlePageChange(0)}
          >
            <ChevronLeft size={16} />
            <ChevronLeft size={16} />
          </PaginationButton>
          <PaginationButton
            disabled={currentPage === 0 || loadingPage}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft size={16} />
          </PaginationButton>

          {renderPageNumbers()}

          <PaginationButton
            disabled={currentPage === playlist.movies.totalPages - 1 || loadingPage}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ChevronRight size={16} />
          </PaginationButton>
          <PaginationButton
            disabled={currentPage === playlist.movies.totalPages - 1 || loadingPage}
            onClick={() => handlePageChange(playlist.movies.totalPages - 1)}
          >
            <ChevronRight size={16} />
            <ChevronRight size={16} />
          </PaginationButton>
        </Pagination>
      )}

      {/* 모바일에서 추가 로딩 메시지 */}
      {isMobile && isFetchingMore && (
        <LoadingMessage>불러오는 중...</LoadingMessage>
      )}
    </Container>
  )
}

export default PlaylistDetail