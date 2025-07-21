import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import BaseButton from '../../components/common/BaseButton';
import { Plus, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  getAllPlaylists,
  getMyPlaylists,
  getBookmarkedPlaylists,
  PlaylistItem,
  SortBy
} from '../../services/playlist';
import { useAuth } from '../../context/AuthContext';

// 애니메이션 정의
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const PlaylistContainer = styled.div`
  color: white;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto; /* 중앙정렬 추가 */
  padding: 1.5rem 2rem;
  font-family: 'Arial', sans-serif;
  overflow-y: auto;
  box-sizing: border-box;
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const TabButtons = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
    justify-content: center;
  }
`;

const Tab = styled.div<{ $active: boolean }>`
  position: relative;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? '#FF7849' : '#9CA3AF')};
  padding: 0.5rem 0;
  transition: color 0.2s ease;
  
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
  
  &:hover {
    color: #FF7849;
  }
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const CountInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  /* 모바일에서도 항상 같은 줄에 유지 */
`;

const Count = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
`;

const SortContainer = styled.div`
  position: relative;
`;

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
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

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
  display: ${props => props.$isOpen ? 'block' : 'none'};
  margin-top: 0.25rem;
`;

const DropdownItem = styled.button<{ $active: boolean }>`
  width: 100%;
  background: none;
  border: none;
  color: ${props => props.$active ? '#ff7849' : '#ccc'};
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
`;

// TotalSearch와 동일한 그리드 시스템
const PlaylistGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(5, 1fr);
  margin-bottom: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// TotalSearch와 동일한 카드 스타일
const PlaylistCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  animation: ${fadeInUp} 0.3s ease both;
  cursor: pointer; 
  transition: transform 0.2s;
  
  &:hover { 
    transform: translateY(-4px); 
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

// TotalSearch와 동일한 이미지 래퍼
const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 280px;
  background: #333;
  border-radius: 4px 4px 0 0;
  overflow: hidden;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    margin-right: 12px;
    border-radius: 4px;
  }
`;

// TotalSearch와 동일한 스켈레톤
const Skeleton = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: ${shimmer} 1.2s infinite;
  }
`;

// TotalSearch와 동일한 카드 바디
const CardBody = styled.div`
  padding: 12px;

  @media (max-width: 768px) {
    flex: 1;
    padding: 12px 12px 12px 0;
  }
`;

// TotalSearch와 동일한 카드 타이틀
const CardTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

// TotalSearch와 동일한 하단 정보
const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

const CreatorName = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: 8px;
`;

const MovieCount = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
  flex-shrink: 0;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
    flex-wrap: wrap;
  }
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? '#ff6b35' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#ff6b35' : '#555'};
  color: ${props => props.$active ? 'white' : '#ccc'};
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ff6b35;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background: transparent;
      color: #ccc;
    }
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 0.875rem;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #ccc;
  font-size: 1.1rem;
  margin: 3rem 0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ff4444;
  font-size: 1.1rem;
  margin: 3rem 0;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #aaa;
  font-size: 1.1rem;
  margin: 4rem 0;
`;

// 새 플레이리스트 버튼 컨테이너
const ButtonContainer = styled.div`
  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
  }
`;

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
    <ImageWrapper>
      {!loaded && !error && <Skeleton />}
      {!error && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            display: loaded ? 'block' : 'none',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      {error && (
        <div style={{
          width: '100%',
          height: '100%',
          background: '#333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          이미지 없음
        </div>
      )}
    </ImageWrapper>
  );
};

const PlaylistPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'bookmarked'>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 플레이리스트 가져오기 - 서비스 함수 사용
  const fetchPlaylists = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      switch (activeTab) {
        case 'all':
          response = await getAllPlaylists(currentPage, 20, sortBy);
          break;
        case 'my':
          response = await getMyPlaylists(currentPage, 20);
          break;
        case 'bookmarked':
          response = await getBookmarkedPlaylists(currentPage, 20);
          break;
        default:
          throw new Error('Invalid tab');
      }

      if (response.success && response.data) {
        const data = response.data;
        setPlaylists(data.content || []);
        setTotalElements(data.totalElements || 0);
        setTotalPages(data.totalPages || 0);
      } else {
        throw new Error(response.message || '데이터를 불러올 수 없습니다.');
      }
    } catch (err: any) {
      setError(err.message || '플레이리스트를 불러오는 중 오류가 발생했습니다.');
      setPlaylists([]);
      setTotalElements(0);
      setTotalPages(0);
      console.error('Error fetching playlists:', err);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [activeTab, currentPage, sortBy]);

  // 강제 새로고침 버전
  const handleTabChange = async (tab: 'all' | 'my' | 'bookmarked') => {
    if (activeTab === tab) {
      // 같은 탭을 클릭한 경우 강제로 새로고침
      setHasLoaded(false);
      fetchPlaylists();
      return;
    }
    
    // 로그인이 필요한 탭 확인
    if ((tab === 'my' || tab === 'bookmarked') && !isAuthenticated) {
      const result = await Swal.fire({
        title: '로그인이 필요합니다',
        text: '해당 기능을 이용하려면 로그인이 필요합니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '로그인하러 가기',
        cancelButtonText: '취소',
        confirmButtonColor: '#FF7849',
        cancelButtonColor: '#6c757d'
      });

      if (result.isConfirmed) {
        navigate('/login');
      }
      return;
    }
    
    setActiveTab(tab);
    setCurrentPage(0);
    setHasLoaded(false);
    if (tab !== 'all') {
      setSortBy('latest');
    }
  };

  const handleSortChange = (newSortBy: SortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(0);
    setIsDropdownOpen(false);
    setHasLoaded(false);
  };

  const getSortLabel = (sort: SortBy) => {
    switch (sort) {
      case 'popularity':
        return '인기순';
      case 'latest':
        return '최신순';
      case 'oldest':
        return '오래된순';
      default:
        return '최신순';
    }
  };

  const handleCreatePlaylist = async () => {
    if (!isAuthenticated) {
      const result = await Swal.fire({
        title: '로그인이 필요합니다',
        text: '플레이리스트를 생성하려면 로그인이 필요합니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '로그인하러 가기',
        cancelButtonText: '취소',
        confirmButtonColor: '#FF7849',
        cancelButtonColor: '#6c757d'
      });

      if (result.isConfirmed) {
        navigate('/login');
      }
      return;
    }
    navigate('/createplaylist');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setHasLoaded(false);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationButton
          key={i}
          $active={currentPage === i}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </PaginationButton>
      );
    }

    return pages;
  };

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: 'popularity', label: '인기순' },
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' }
  ];

  const handlePlaylistClick = (playlistId: number) => {
    navigate(`/playlist/${playlistId}`);
  };

  return (
    <PlaylistContainer>
      <TitleContainer>
        <Title>플레이리스트</Title>
      </TitleContainer>

      <TabContainer>
        <TabButtons>
          <Tab 
            $active={activeTab === 'all'} 
            onClick={() => handleTabChange('all')}
          >
            전체
          </Tab>
          {/* 로그인된 사용자만 표시 */}
          {isAuthenticated && (
            <>
              <Tab 
                $active={activeTab === 'my'} 
                onClick={() => handleTabChange('my')}
              >
                내 플레이리스트
              </Tab>
              <Tab 
                $active={activeTab === 'bookmarked'} 
                onClick={() => handleTabChange('bookmarked')}
              >
                관심 플레이리스트
              </Tab>
            </>
          )}
        </TabButtons>
        
        {/* 로그인된 사용자만 플레이리스트 생성 버튼 표시 */}
        {isAuthenticated && (
          <BaseButton 
            variant="orange" 
            icon={<Plus size={16} />}
            onClick={handleCreatePlaylist}
          >
            새 플레이리스트 만들기
          </BaseButton>
        )}
      </TabContainer>

      <CountInfo>
        <Count>총 {totalElements}개</Count>
        {activeTab === 'all' && (
          <SortContainer ref={dropdownRef}>
            <SortButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              {getSortLabel(sortBy)} <ChevronDown size={16} />
            </SortButton>
            <DropdownMenu $isOpen={isDropdownOpen}>
              {sortOptions.map((option) => (
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
        )}
      </CountInfo>

      {/* 로딩 중일 때 */}
      {loading && <LoadingMessage>로딩 중...</LoadingMessage>}
      
      {/* 에러가 있을 때 */}
      {!loading && error && <ErrorMessage>{error}</ErrorMessage>}

      {/* 로딩이 완료되고 에러가 없을 때만 컨텐츠 또는 빈 메시지 표시 */}
      {!loading && !error && hasLoaded && (
        <>
          {playlists && playlists.length > 0 ? (
            <PlaylistGrid>
              {playlists.map((playlist) => (
                <PlaylistCard 
                  key={playlist.playListId}
                  onClick={() => handlePlaylistClick(playlist.playListId)}
                >
                  <ImageLoader
                    src={playlist.thumbnailUrl || '/default-thumbnail.png'}
                    alt={playlist.title}
                    onError={() => console.log(`이미지 로딩 실패: ${playlist.title}`)}
                  />
                  <CardBody>
                    <CardTitle>{playlist.title}</CardTitle>
                    <BottomRow>
                      <CreatorName>{playlist.nickname}</CreatorName>
                      <MovieCount>영화 {playlist.movieCount}개</MovieCount>
                    </BottomRow>
                  </CardBody>
                </PlaylistCard>
              ))}
            </PlaylistGrid>
          ) : (
            <EmptyMessage>
              {activeTab === 'all' && '등록된 플레이리스트가 없습니다.'}
              {activeTab === 'my' && '작성한 플레이리스트가 없습니다.'}
              {activeTab === 'bookmarked' && '관심 플레이리스트가 없습니다.'}
            </EmptyMessage>
          )}
        </>
      )}

      {/* 페이지네이션 - 로딩이 완료되고 에러가 없을 때만 표시 */}
      {!loading && !error && hasLoaded && totalPages > 1 && (
        <Pagination>
          <PaginationButton 
            disabled={currentPage === 0}
            onClick={() => handlePageChange(0)}
          >
            &lt;&lt;
          </PaginationButton>
          <PaginationButton 
            disabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &lt;
          </PaginationButton>
          
          {renderPageNumbers()}
          
          <PaginationButton 
            disabled={currentPage === totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            &gt;
          </PaginationButton>
          <PaginationButton 
            disabled={currentPage === totalPages - 1}
            onClick={() => handlePageChange(totalPages - 1)}
          >
            &gt;&gt;
          </PaginationButton>
        </Pagination>
      )}
    </PlaylistContainer>
  );
};

export default PlaylistPage;