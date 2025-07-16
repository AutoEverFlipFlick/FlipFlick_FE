import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserBookmarks, togglePlaylistBookmark } from '../services/playlist';

interface BookmarkContextType {
  bookmarkedPlaylists: Set<string>;
  isBookmarked: (playlistId: string) => boolean;
  toggleBookmark: (playlistId: string) => Promise<boolean>;
  refreshBookmarks: () => Promise<void>;
  loading: boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const useBookmark = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmark must be used within a BookmarkProvider');
  }
  return context;
};

interface BookmarkProviderProps {
  children: ReactNode;
  userId?: number;
}

export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({ 
  children, 
  userId = 3
}) => {
  const [bookmarkedPlaylists, setBookmarkedPlaylists] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // 북마크 목록 새로고침
  const refreshBookmarks = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const bookmarks = await getUserBookmarks(userId);
      setBookmarkedPlaylists(new Set(bookmarks));
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      // 에러 발생 시 빈 Set으로 초기화
      setBookmarkedPlaylists(new Set());
    } finally {
      setLoading(false);
    }
  };

  // 북마크 토글
  const toggleBookmark = async (playlistId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const response = await togglePlaylistBookmark(parseInt(playlistId), userId);
      
      if (response.success) {
        setBookmarkedPlaylists(prev => {
          const newSet = new Set(prev);
          if (newSet.has(playlistId)) {
            newSet.delete(playlistId);
          } else {
            newSet.add(playlistId);
          }
          return newSet;
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      return false;
    }
  };

  // 북마크 상태 확인
  const isBookmarked = (playlistId: string): boolean => {
    return bookmarkedPlaylists.has(playlistId);
  };

  // 컴포넌트 마운트 시 북마크 목록 로드
  useEffect(() => {
    if (userId) {
      refreshBookmarks();
    }
  }, [userId]);

  return (
    <BookmarkContext.Provider value={{
      bookmarkedPlaylists,
      isBookmarked,
      toggleBookmark,
      refreshBookmarks,
      loading
    }}>
      {children}
    </BookmarkContext.Provider>
  );
};