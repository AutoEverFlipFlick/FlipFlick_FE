import axiosInstance from './axiosInstance';

// 기존 인터페이스들
export interface Movie {
  movieId: number;
  title: string;
  releaseDate: string;
  posterUrl: string;
}

export interface MoviePage {
  content: Movie[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
}

export interface PlaylistDetail {
  playListId: number;
  title: string;
  nickname: string;
  movieCount: number;
  bookmarkCount: number;
  isBookmarked?: boolean;
  movies: MoviePage;
}

export interface PlaylistDetailResponse {
  status: number;
  success: boolean;
  message: string;
  data: PlaylistDetail;
}

export interface BookmarkResponse {
  status: number;
  success: boolean;
  message: string;
  data?: any;
}

// 플레이리스트 목록 관련 인터페이스 추가
export interface PlaylistItem {
  playListId: number;
  title: string;
  nickname: string;
  thumbnailUrl: string;
  movieCount: number;
  bookmarkCount: number;
}

export interface PlaylistData {
  content: PlaylistItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
}

export interface PlaylistResponse {
  status: number;
  success: boolean;
  message: string;
  data: PlaylistData;
}

export type SortBy = 'popularity' | 'latest' | 'oldest';

// 플레이리스트 생성 관련 인터페이스 추가
export interface CreateMovieItem {
  tmdbId: number;
  posterUrl: string;
  title: string;
  releaseDate: string | null;
}

export interface CreatePlaylistRequest {
  title: string;
  hidden: boolean;
  movies: CreateMovieItem[];
}

export interface CreatePlaylistResponse {
  status: number;
  success: boolean;
  message: string;
  data?: any;
}

export interface Movie {
  tmdbId: number;
  title: string;
  releaseDate: string;
  image: string;
}

export interface SearchMovieData {
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  content: Movie[];
}

export interface SearchMovieResponse {
  status: number;
  success: boolean;
  message: string;
  data: SearchMovieData;
}


// 플레이리스트 생성
export const createPlaylist = async (
  playlistData: CreatePlaylistRequest,
  userId: number = 1
): Promise<CreatePlaylistResponse> => {
  const response = await axiosInstance.post<CreatePlaylistResponse>(
    `/playlist/create?userId=${userId}`,
    playlistData
  );
  return response.data;
};

// 플레이리스트 상세 정보 가져오기
export const getPlaylistDetail = async (
  playlistId: string,
  page: number = 0,
  size: number = 18
): Promise<PlaylistDetailResponse> => {
  const response = await axiosInstance.get<PlaylistDetailResponse>(
    `/playlist/${playlistId}?page=${page}&size=${size}`
  );
  return response.data;
};

// 전체 플레이리스트 가져오기
export const getAllPlaylists = async (
  page: number = 0,
  size: number = 20,
  sortBy: SortBy = 'latest'
): Promise<PlaylistResponse> => {
  const response = await axiosInstance.get<PlaylistResponse>('/playlist/all', {
    params: {
      page,
      size,
      sortBy
    }
  });
  return response.data;
};

// 내 플레이리스트 가져오기
export const getMyPlaylists = async (
  userId: number,
  page: number = 0,
  size: number = 20
): Promise<PlaylistResponse> => {
  const response = await axiosInstance.get<PlaylistResponse>('/playlist/my', {
    params: {
      userId,
      page,
      size
    }
  });
  return response.data;
};

// 북마크한 플레이리스트 가져오기
export const getBookmarkedPlaylists = async (
  userId: number,
  page: number = 0,
  size: number = 20
): Promise<PlaylistResponse> => {
  const response = await axiosInstance.get<PlaylistResponse>('/playlist/bookmarked', {
    params: {
      userId,
      page,
      size
    }
  });
  return response.data;
};

// 북마크 추가/해제
export const togglePlaylistBookmark = async (
  playListId: number,
  userId: number = 3
): Promise<BookmarkResponse> => {
  const requestBody = {
    playListId
  };

  const response = await axiosInstance.post<BookmarkResponse>(
    `/playlist/bookmark?userId=${userId}`,
    requestBody
  );
  return response.data;
};

// 북마크 상태 확인 (필요시)
export const checkBookmarkStatus = async (
  playListId: number,
  userId: number = 3
): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(
      `/playlist/${playListId}/bookmark/status?userId=${userId}`
    );
    return response.data.data.isBookmarked;
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
};

// 북마크 목록 응답 인터페이스 추가
export interface BookmarkListResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    playListIds: number[];
    totalCount: number;
  };
}

// 사용자 북마크 목록 가져오기 - 수정
export const getUserBookmarks = async (userId: number): Promise<string[]> => {
  const response = await axiosInstance.get<BookmarkListResponse>(`/playlist/user/${userId}/bookmarks`);
  
  // 숫자 배열을 문자열 배열로 변환
  return response.data.data.playListIds.map(id => id.toString());
};

// 영화 검색
export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<SearchMovieResponse> => {
  const response = await axiosInstance.post<SearchMovieResponse>('/search/movie', {
    query: query.trim(),
    page: page
  });
  return response.data;
};
