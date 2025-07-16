import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { Search, ImageIcon, RefreshCw, Loader } from 'lucide-react';
import BaseButton from '../common/BaseButton';
import { searchMovies, Movie } from '../../services/playlist';

interface MovieSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedMovies: Movie[]) => void;
  selectedMovieIds: number[];
}

// 로딩 애니메이션
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideInUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
`;

const staggerIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
  padding: 1rem;
  box-sizing: border-box;
  overflow: hidden;
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  animation: ${slideUp} 0.3s ease;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  background: #1a1a1a;
  padding: 2rem 2rem 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
  z-index: 10;
`;

const ModalTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
`;

const ModalTitle = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  margin: 0;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ff7849;
    background: rgba(255, 120, 73, 0.1);
    transform: rotate(90deg);
  }

  &:active {
    transform: rotate(180deg);
  }
`;

const HeaderButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem 2rem 2rem;
  
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid #444;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    outline: none;
    border-color: #ff7849;
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  box-sizing: border-box;
  padding-right: 0.5rem;
  
  animation: ${slideInUp} 0.4s ease-out;
`;

const MovieCard = styled.div<{ $selected: boolean; $index?: number }>`
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid ${props => props.$selected ? '#ff7849' : 'transparent'};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
  
  opacity: 0;
  animation: ${staggerIn} 0.3s ease-out forwards;
  animation-delay: ${props => (props.$index || 0) * 0.05}s;

  &:hover {
    border-color: #ff7849;
    transform: translateY(-2px);
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
  box-sizing: border-box;
`;

const MovieTitle = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
`;

const MovieYear = styled.span`
  font-size: 0.8rem;
  color: #aaa;
`;

const SelectedBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #ff7849;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  box-sizing: border-box;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #aaa;
  font-size: 1rem;
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  animation: ${fadeIn} 0.2s ease-out;
`;

const LoadingIcon = styled(Loader)`
  animation: ${spin} 1s linear infinite;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ff4444;
  font-size: 1rem;
  margin: 2rem 0;
  
  animation: ${slideInUp} 0.3s ease-out;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #aaa;
  font-size: 1rem;
  margin: 2rem 0;
  
  animation: ${slideInUp} 0.3s ease-out;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  box-sizing: border-box;
`;

const SelectedCount = styled.div`
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  
  animation: ${fadeIn} 0.3s ease-out;
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

const MovieSearchModal: React.FC<MovieSearchModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedMovieIds
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // 무한스크롤 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastMovieElementRef = useRef<HTMLDivElement | null>(null);

  // 영화 검색 - 서비스 함수 사용
  const performMovieSearch = async (query: string, page: number = 1, isLoadMore: boolean = false) => {
    if (!query.trim()) {
      setMovies([]);
      setHasSearched(false);
      setShowResults(false);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalElements(0);
      setHasMore(false);
      return;
    }

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      setShowResults(false);
    }

    try {
      const response = await searchMovies(query, page);

      if (response.success) {
        const { 
          content, 
          totalPages: total, 
          page: currentPageFromApi, 
          totalElements: totalElementsFromApi 
        } = response.data;
        
        // 첫 페이지가 아닌 경우 최소 로딩 시간 보장
        if (!isLoadMore) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (isLoadMore) {
          // 추가 페이지 데이터를 기존 데이터에 추가
          setMovies(prev => [...prev, ...content]);
        } else {
          // 첫 페이지 데이터로 교체
          setMovies(content);
        }
        
        setCurrentPage(currentPageFromApi);
        setTotalPages(total);
        setTotalElements(totalElementsFromApi);
        setHasMore(currentPageFromApi < total);
        setShowResults(true);
      } else {
        setError(response.message || '영화 검색에 실패했습니다.');
        if (!isLoadMore) {
          setMovies([]);
        }
        setShowResults(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '영화 검색 중 오류가 발생했습니다.');
      if (!isLoadMore) {
        setMovies([]);
      }
      setShowResults(true);
      console.error('Movie search error:', err);
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  // 다음 페이지 로드
  const loadNextPage = useCallback(() => {
    if (hasMore && !loadingMore && searchQuery.trim()) {
      performMovieSearch(searchQuery, currentPage + 1, true);
    }
  }, [hasMore, loadingMore, searchQuery, currentPage]);

  // Intersection Observer 설정
  const lastMovieElementCallback = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadNextPage();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, loadNextPage]);

  // 검색 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        // 새로운 검색 시 페이지 초기화
        setCurrentPage(1);
        setTotalPages(0);
        setTotalElements(0);
        setHasMore(false);
        performMovieSearch(searchQuery, 1, false);
      } else {
        setMovies([]);
        setHasSearched(false);
        setError(null);
        setShowResults(false);
        setCurrentPage(1);
        setTotalPages(0);
        setTotalElements(0);
        setHasMore(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 영화 선택/해제
  const toggleMovie = (movie: Movie) => {
    if (selectedMovieIds.includes(movie.tmdbId)) {
      return;
    }

    const isSelected = selectedMovies.some(m => m.tmdbId === movie.tmdbId);

    if (isSelected) {
      setSelectedMovies(prev => prev.filter(m => m.tmdbId !== movie.tmdbId));
    } else {
      setSelectedMovies(prev => [...prev, movie]);
    }
  };

  // 새로고침 버튼 클릭 (선택된 영화 초기화)
  const handleRefresh = () => {
    setSelectedMovies([]);
    setSearchQuery('');
    setMovies([]);
    setError(null);
    setHasSearched(false);
    setShowResults(false);
    setCurrentPage(1);
    setTotalPages(0);
    setTotalElements(0);
    setHasMore(false);
  };

  // 확인 버튼 클릭
  const handleConfirm = () => {
    onConfirm(selectedMovies);
    setSelectedMovies([]);
    setSearchQuery('');
    setMovies([]);
    setHasSearched(false);
    setShowResults(false);
    setCurrentPage(1);
    setTotalPages(0);
    setTotalElements(0);
    setHasMore(false);
  };

  // 취소 버튼 클릭
  const handleCancel = () => {
    setSelectedMovies([]);
    setSearchQuery('');
    setMovies([]);
    setHasSearched(false);
    setShowResults(false);
    setCurrentPage(1);
    setTotalPages(0);
    setTotalElements(0);
    setHasMore(false);
    onClose();
  };

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setSelectedMovies([]);
      setSearchQuery('');
      setMovies([]);
      setError(null);
      setHasSearched(false);
      setShowResults(false);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalElements(0);
      setHasMore(false);
    }
  }, [isOpen]);

  // 컴포넌트 언마운트 시 observer 정리
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitleContainer>
            <ModalTitle>영화 추가</ModalTitle>
            <RefreshButton onClick={handleRefresh} title="선택 초기화">
              <RefreshCw size={20} />
            </RefreshButton>
          </ModalTitleContainer>
          <HeaderButtonContainer>
            <BaseButton
              variant="red"
              onClick={handleCancel}
            >
              취소
            </BaseButton>
            <BaseButton
              variant="orange"
              onClick={handleConfirm}
              disabled={selectedMovies.length === 0}
            >
              추가 ({selectedMovies.length})
            </BaseButton>
          </HeaderButtonContainer>
        </ModalHeader>

        <ModalBody>
          <SearchContainer>
            <SearchIcon size={20} />
            <SearchInput
              type="text"
              placeholder="영화를 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          {/* 로딩 중일 때 */}
          {loading && (
            <LoadingMessage>
              <LoadingIcon size={24} />
            </LoadingMessage>
          )}

          {/* 에러가 있을 때 */}
          {!loading && showResults && error && (
            <ErrorMessage>{error}</ErrorMessage>
          )}

          {/* 검색 결과가 있을 때 */}
          {!loading && showResults && !error && movies.length > 0 && (
            <>
              <SelectedCount>
                {selectedMovies.length}개 선택됨 ({totalElements}개)
              </SelectedCount>
              <MovieGrid>
                {movies.map((movie, index) => {
                  const isSelected = selectedMovies.some(m => m.tmdbId === movie.tmdbId);
                  const isAlreadySelected = selectedMovieIds.includes(movie.tmdbId);
                  const isLastItem = index === movies.length - 1;

                  return (
                    <MovieCard
                      key={`${movie.tmdbId}-${index}`}
                      ref={isLastItem ? lastMovieElementCallback : null}
                      $selected={isSelected || isAlreadySelected}
                      $index={index}
                      onClick={() => toggleMovie(movie)}
                      style={{
                        cursor: isAlreadySelected ? 'not-allowed' : 'pointer',
                        opacity: isAlreadySelected ? 0.5 : 1
                      }}
                    >
                      <ImageLoader
                        src={movie.image}
                        alt={movie.title}
                        onError={() => console.log(`이미지 로딩 실패: ${movie.title}`)}
                      />
                      <MovieInfo>
                        <MovieTitle>{movie.title}</MovieTitle>
                        <MovieYear>{movie.releaseDate?.slice(0, 4) || '미정'}</MovieYear>
                      </MovieInfo>
                      {(isSelected || isAlreadySelected) && <SelectedBadge>✓</SelectedBadge>}
                    </MovieCard>
                  );
                })}
              </MovieGrid>
              
              {/* 추가 로딩 표시 */}
              {loadingMore && (
                <LoadingMessage>
                  <LoadingIcon size={20} />
                  <span>더 많은 영화를 불러오는 중...</span>
                </LoadingMessage>
              )}
            </>
          )}

          {/* 검색했지만 결과가 없을 때 */}
          {!loading && showResults && !error && hasSearched && movies.length === 0 && searchQuery && (
            <EmptyMessage>검색 결과가 없습니다.</EmptyMessage>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MovieSearchModal;