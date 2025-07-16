import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Bookmark, BookmarkCheck, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import BaseButton from '../components/common/BaseButton';
import { 
  getPlaylistDetail, 
  PlaylistDetail as PlaylistDetailType,
} from '../services/playlist';
import { useBookmark } from '../context/BookmarkContext';

// 애니메이션 정의
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
`;

const Container = styled.div`
  color: white;
  min-height: 100vh;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.5s ease;
`;

const TitleSection = styled.div`
  flex: 1;
`;

const PlaylistTitle = styled.h1`
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  font-weight: bold;
`;

const PlaylistMeta = styled.div`
  color: #aaa;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const BookmarkButton = styled.button<{ $isBookmarked: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.$isBookmarked ? '#ff7849' : 'transparent'};
  border: 2px solid ${props => props.$isBookmarked ? '#ff7849' : '#555'};
  color: ${props => props.$isBookmarked ? 'white' : '#ccc'};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$isBookmarked ? '#e66a42' : '#ff7849'};
    border-color: ${props => props.$isBookmarked ? '#e66a42' : '#ff7849'};
    color: white;
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.5s ease;
`;

const MovieCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

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
`;

const MovieImage = styled.img<{ $loaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${props => props.$loaded ? 'block' : 'none'};
`;

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
`;

const MovieInfo = styled.div`
  padding: 0.5rem;
`;

const MovieTitle = styled.h3`
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MovieYear = styled.span`
  font-size: 0.8rem;
  color: #aaa;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? '#ff7849' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#ff7849' : '#555'};
  color: ${props => props.$active ? 'white' : '#ccc'};
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
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #ccc;
  font-size: 1.1rem;
  margin: 4rem 0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ff4444;
  font-size: 1.1rem;
  margin: 4rem 0;
`;

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
`;

// 이미지 로더 컴포넌트
const ImageLoader: React.FC<{
  src: string;
  alt: string;
  onError?: () => void;
}> = ({ src, alt, onError }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(false);
    onError?.();
  };

  return (
    <ImageContainer>
      {(!src || src === 'null' || src.trim() === '') ? (
        <NoImagePlaceholder>
          <ImageIcon size={24} />
          <span>포스터 없음</span>
        </NoImagePlaceholder>
      ) : (
        <>
          {!loaded && !error && (
            <ImageSkeleton>
              이미지 로딩 중...
            </ImageSkeleton>
          )}
          
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
  );
};

const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useBookmark();
  
  const [playlist, setPlaylist] = useState<PlaylistDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarking, setBookmarking] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingPage, setLoadingPage] = useState(false);
  const moviesPerPage = 18;

  // 플레이리스트 상세 정보 가져오기
  const fetchPlaylistDetail = async (page: number = 0) => {
    if (!id) return;
    
    if (page === 0) {
      setLoading(true);
    } else {
      setLoadingPage(true);
    }
    setError(null);
    
    try {
      const response = await getPlaylistDetail(id, page, moviesPerPage);
      
      if (response.success) {
        setPlaylist(response.data);
        setCurrentPage(page);
      } else {
        setError(response.message || '플레이리스트를 불러올 수 없습니다.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '플레이리스트를 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching playlist detail:', err);
    } finally {
      setLoading(false);
      setLoadingPage(false);
    }
  };

  // 북마크 토글
  const handleToggleBookmark = async () => {
    if (!playlist || bookmarking) return;
    
    setBookmarking(true);
    
    try {
      const success = await toggleBookmark(playlist.playListId.toString());
      
      if (success) {
        // UI 업데이트용 로컬 상태 수정
        setPlaylist(prev => prev ? {
          ...prev,
          isBookmarked: !prev.isBookmarked,
          bookmarkCount: prev.isBookmarked ? prev.bookmarkCount - 1 : prev.bookmarkCount + 1
        } : null);
      } else {
        alert('북마크 처리에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('Error toggling bookmark:', err);
      alert('북마크 처리 중 오류가 발생했습니다.');
    } finally {
      setBookmarking(false);
    }
  };

  // 북마크 상태 동기화 (추가)
  useEffect(() => {
    if (playlist) {
      const contextBookmarkState = isBookmarked(playlist.playListId.toString());
      // Context의 상태와 로컬 상태가 다르면 동기화
      if (playlist.isBookmarked !== contextBookmarkState) {
        setPlaylist(prev => prev ? {
          ...prev,
          isBookmarked: contextBookmarkState
        } : null);
      }
    }
  }, [playlist?.playListId, isBookmarked]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page !== currentPage && !loadingPage) {
      fetchPlaylistDetail(page);
    }
  };

  // 페이지 번호 렌더링
  const renderPageNumbers = () => {
    if (!playlist?.movies) return [];
    
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = playlist.movies.totalPages;
    const startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationButton
          key={i}
          $active={currentPage === i}
          onClick={() => handlePageChange(i)}
          disabled={loadingPage}
        >
          {i + 1}
        </PaginationButton>
      );
    }

    return pages;
  };

  // 첫 로드 시에만 실행
  useEffect(() => {
    fetchPlaylistDetail(0);
  }, [id]);

  // 뒤로 가기
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/playlists');
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>플레이리스트를 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  if (error || !playlist) {
    return (
      <Container>
        <ErrorMessage>{error || '플레이리스트를 찾을 수 없습니다.'}</ErrorMessage>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <BaseButton variant="orange" onClick={handleBack}>
            돌아가기
          </BaseButton>
        </div>
      </Container>
    );
  }

  // JSX에서 북마크 상태 표시 수정
  const bookmarkStatus = playlist ? isBookmarked(playlist.playListId.toString()) : false;

  return (
    <Container>
      <Header>
        <TitleSection>
          <PlaylistTitle>{playlist.title}</PlaylistTitle>
          <PlaylistMeta>
            작성자: {playlist.nickname} | 영화 {playlist.movieCount}편
          </PlaylistMeta>
        </TitleSection>
        <BookmarkButton 
          $isBookmarked={bookmarkStatus}
          onClick={handleToggleBookmark}
          disabled={bookmarking}
        >
          {bookmarkStatus ? (
            <BookmarkCheck size={20} />
          ) : (
            <Bookmark size={20} />
          )}
          {bookmarking ? '처리 중...' : (bookmarkStatus ? '관심 해제' : '관심 등록')}
        </BookmarkButton>
      </Header>

      {/* 페이지 로딩 중일 때 오버레이 */}
      <div style={{ position: 'relative' }}>
        <MovieGrid style={{ opacity: loadingPage ? 0.5 : 1 }}>
          {playlist.movies.content.map((movie) => (
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

      {playlist.movies.totalPages > 1 && (
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
    </Container>
  );
};

export default PlaylistDetail;