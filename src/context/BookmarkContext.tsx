import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserBookmarks, togglePlaylistBookmark } from '../services/playlist';
import { useAuth } from './AuthContext';

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
}

export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [bookmarkedPlaylists, setBookmarkedPlaylists] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // 북마크 목록 새로고침
  const refreshBookmarks = async () => {
    if (!user || !isAuthenticated) return;
    
    setLoading(true);
    try {
      const bookmarks = await getUserBookmarks(user.id);
      console.log('Loaded bookmarks:', bookmarks);
      setBookmarkedPlaylists(new Set(bookmarks));
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      setBookmarkedPlaylists(new Set());
    } finally {
      setLoading(false);
    }
  };

  // 북마크 토글
  const toggleBookmark = async (playlistId: string): Promise<boolean> => {
    if (!user || !isAuthenticated) return false;
    
    try {
      const response = await togglePlaylistBookmark(parseInt(playlistId));
      
      if (response.success) {
        setBookmarkedPlaylists(prev => {
          const newSet = new Set(prev);
          if (newSet.has(playlistId)) {
            newSet.delete(playlistId);
            console.log(`Bookmark removed: ${playlistId}`);
          } else {
            newSet.add(playlistId);
            console.log(`Bookmark added: ${playlistId}`);
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

  // 사용자 인증 상태 변경 시 북마크 목록 처리
  useEffect(() => {
    if (user && isAuthenticated) {
      refreshBookmarks();
    } else {
      setBookmarkedPlaylists(new Set());
    }
  }, [user, isAuthenticated]);

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