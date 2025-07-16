import React, { useState } from 'react';
import styled from 'styled-components';
import BaseButton from '../components/common/BaseButton';
import { Heart, Plus } from 'lucide-react';

interface PlaylistItem {
  id: number;
  title: string;
  author: string;
  date: string;
  thumbnail: string;
  isLiked: boolean;
}

const PlaylistContainer = styled.div`
  color: white;
  min-height: 100vh;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
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
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$active ? 'white' : '#aaa'};
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  border-bottom: ${props => props.$active ? '2px solid white' : 'none'};
  transition: all 0.2s ease;

  &:hover {
    color: white;
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

const SortButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: white;
  }
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const PlaylistCard = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ThumbnailContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const LikeButton = styled.button<{ $isLiked: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    color: ${props => props.$isLiked ? '#ff4444' : 'white'};
    fill: ${props => props.$isLiked ? '#ff4444' : 'none'};
  }

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
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

const PlaylistPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'liked'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([
    {
      id: 1,
      title: '플리1',
      author: '익명가짱',
      date: '작품 30',
      thumbnail: '../../../스티치.jpg',
      isLiked: false
    },
    {
      id: 2,
      title: '플리1',
      author: '익명가짱',
      date: '작품 30',
      thumbnail: '../../../스티치.jpg',
      isLiked: true
    },
    {
      id: 3,
      title: '플리1',
      author: '익명가짱',
      date: '작품 30',
      thumbnail: '../../../스티치.jpg',
      isLiked: false
    },
    {
      id: 4,
      title: '플리1',
      author: '익명가짱',
      date: '작품 30',
      thumbnail: '../../../스티치.jpg',
      isLiked: false
    },
    // 더 많은 데이터 추가
    ...Array.from({ length: 12 }, (_, i) => ({
      id: i + 5,
      title: '플리1',
      author: '익명가짱',
      date: '작품 30',
      thumbnail: '../../../스티치.jpg',
      isLiked: false
    }))
  ]);

  const handleLike = (id: number) => {
    setPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === id 
          ? { ...playlist, isLiked: !playlist.isLiked }
          : playlist
      )
    );
  };

  const handleCreatePlaylist = () => {
    // 플레이리스트 생성 로직
    console.log('플레이리스트 생성');
  };

  const totalPages = Math.ceil(playlists.length / 12);

  return (
    <PlaylistContainer>
      <TitleContainer>
        <Title>플레이리스트</Title>
      </TitleContainer>

      <TabContainer>
        <TabButtons>
          <Tab 
            $active={activeTab === 'all'} 
            onClick={() => setActiveTab('all')}
          >
            전체
          </Tab>
          <Tab 
            $active={activeTab === 'my'} 
            onClick={() => setActiveTab('my')}
          >
            내 플레이리스트
          </Tab>
          <Tab 
            $active={activeTab === 'liked'} 
            onClick={() => setActiveTab('liked')}
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
        <Count>총 17개</Count>
        <SortButton>
          최근 작성 순 ▼
        </SortButton>
      </CountInfo>

      <PlaylistGrid>
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id}>
            <ThumbnailContainer>
              <Thumbnail src={playlist.thumbnail} alt={playlist.title} />
              <LikeButton 
                $isLiked={playlist.isLiked}
                onClick={() => handleLike(playlist.id)}
              >
                <Heart size={20} />
              </LikeButton>
            </ThumbnailContainer>
            <CardInfo>
              <CardTitle>{playlist.title}</CardTitle>
              <CardMeta>
                <span>{playlist.author}</span>
                <span>{playlist.date}</span>
              </CardMeta>
            </CardInfo>
          </PlaylistCard>
        ))}
      </PlaylistGrid>

      <Pagination>
        <PaginationButton 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          &lt;
        </PaginationButton>
        <PaginationButton 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          &lt;&lt;
        </PaginationButton>
        
        {[...Array(totalPages)].map((_, i) => (
          <PaginationButton
            key={i + 1}
            $active={currentPage === i + 1}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </PaginationButton>
        ))}
        
        <PaginationButton 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        >
          &gt;
        </PaginationButton>
        <PaginationButton 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        >
          &gt;&gt;
        </PaginationButton>
      </Pagination>
    </PlaylistContainer>
  );
};

export default PlaylistPage;