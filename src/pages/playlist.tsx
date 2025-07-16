import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import BaseButton from '../components/common/BaseButton';
import { Plus, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getAllPlaylists,
  getMyPlaylists,
  getBookmarkedPlaylists,
  PlaylistItem,
  SortBy
} from '../services/playlist';

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
  min-height: 100vh;
  max-height: 100vh;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  overflow-y: auto;
  box-sizing: border-box;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  font-weight: bold;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
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
  margin-bottom: 1rem;
`;

const Count = styled.span`
  font-size: 1rem;
  color: #ccc;
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

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const PlaylistCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  animation: ${fadeInUp} 0.3s ease both;
  cursor: pointer; 
  transition: transform 0.2s;
  position: relative;
  
  &:hover { 
    transform: translateY(-4px); 
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const ThumbnailContainer = styled.div`
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
  font-size: 0.9rem;
`;

const Thumbnail = styled.img<{ $loaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${props => props.$loaded ? 'block' : 'none'};
`;

const CardInfo = styled.div`
  padding: 1rem;
`;

const CardTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: bold;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #aaa;
  font-size: 0.9rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
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
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #ccc;
  font-size: 1.1rem;
  margin: 2rem 0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ff4444;
  font-size: 1.1rem;
  margin: 2rem 0;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #aaa;
  font-size: 1.1rem;
  margin: 4rem 0;
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
    <ThumbnailContainer>
      {!loaded && !error && (
        <ImageSkeleton>
        </ImageSkeleton>
      )}
      {!error && (
        <Thumbnail
          src={src}
          alt={alt}
          $loaded={loaded}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      {error && (
        <ImageSkeleton>
          이미지 없음
        </ImageSkeleton>
      )}
    </ThumbnailContainer>
  );
};

const PlaylistPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'bookmarked'>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userId = 1; // 고정된 유저 ID

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
          response = await getMyPlaylists(userId, currentPage, 20);
          break;
        case 'bookmarked':
          response = await getBookmarkedPlaylists(userId, currentPage, 20);
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
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [activeTab, currentPage, sortBy]);

  const handleTabChange = (tab: 'all' | 'my' | 'bookmarked') => {
    setActiveTab(tab);
    setCurrentPage(0);
    if (tab !== 'all') {
      setSortBy('latest'); // 전체가 아닌 경우 기본값으로 리셋
    }
  };

  const handleSortChange = (newSortBy: SortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(0);
    setIsDropdownOpen(false);
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

  const handleCreatePlaylist = () => {
    navigate('/createplaylist');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        </TabButtons>
        
        <BaseButton 
          variant="orange" 
          icon={<Plus size={16} />}
          onClick={handleCreatePlaylist}
        >
          새 플레이리스트 만들기
        </BaseButton>
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

      {loading && <LoadingMessage>로딩 중...</LoadingMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!loading && !error && (
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
                  <CardInfo>
                    <CardTitle>{playlist.title}</CardTitle>
                    <CardMeta>
                      <span>{playlist.nickname}</span>
                      <span>작품 {playlist.movieCount}</span>
                    </CardMeta>
                  </CardInfo>
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

      {!loading && !error && totalPages > 1 && (
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



