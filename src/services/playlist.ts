import axiosInstance from './axiosInstance'

// 기존 인터페이스들
export interface Movie {
  movieId: number
  title: string
  releaseDate: string
  posterUrl: string
}

export interface MoviePage {
  content: Movie[]
  currentPage: number
  totalPages: number
  totalElements: number
  numberOfElements: number
  first: boolean
  last: boolean
}

export interface PlaylistDetail {
  playListId: number
  title: string
  nickname: string
  movieCount: number
  bookmarkCount: number
  isBookmarked?: boolean
  hidden?: boolean // 추가
  movies: MoviePage
}

export interface PlaylistDetailResponse {
  status: number
  success: boolean
  message: string
  data: PlaylistDetail
}

export interface BookmarkResponse {
  status: number
  success: boolean
  message: string
  data?: any
}

// 플레이리스트 목록 관련 인터페이스 추가
export interface PlaylistItem {
  playListId: number
  title: string
  nickname: string
  thumbnailUrl: string
  movieCount: number
  bookmarkCount: number
}

export interface PlaylistData {
  content: PlaylistItem[]
  currentPage: number
  totalPages: number
  totalElements: number
  numberOfElements: number
  first: boolean
  last: boolean
}

export interface PlaylistResponse {
  status: number
  success: boolean
  message: string
  data: PlaylistData
}

export type SortBy = 'popularity' | 'latest' | 'oldest'

// 플레이리스트 생성 관련 인터페이스 추가
export interface CreateMovieItem {
  tmdbId: number
  posterUrl: string
  title: string
  releaseDate: string | null
}

export interface CreatePlaylistRequest {
  title: string
  hidden: boolean
  movies: CreateMovieItem[]
}

export interface CreatePlaylistResponse {
  status: number
  success: boolean
  message: string
  data?: any
}

export interface Movie {
  tmdbId: number
  title: string
  releaseDate: string
  image: string
}

export interface SearchMovieData {
  totalElements: number
  totalPages: number
  page: number
  size: number
  content: Movie[]
}

export interface SearchMovieResponse {
  status: number
  success: boolean
  message: string
  data: SearchMovieData
}

// 플레이리스트 생성 - userId 제거
export const createPlaylist = async (
  playlistData: CreatePlaylistRequest,
): Promise<CreatePlaylistResponse> => {
  const response = await axiosInstance.post<CreatePlaylistResponse>(
    '/api/v1/playlist/create',
    playlistData,
  )
  return response.data
}

// 플레이리스트 상세 정보 가져오기
export const getPlaylistDetail = async (
  playlistId: string,
  page: number = 0,
  size: number = 18,
): Promise<PlaylistDetailResponse> => {
  const response = await axiosInstance.get<PlaylistDetailResponse>(
    `/api/v1/playlist/${playlistId}?page=${page}&size=${size}`,
  )
  return response.data
}

// 전체 플레이리스트 가져오기
export const getAllPlaylists = async (
  page: number = 0,
  size: number = 20,
  sortBy: SortBy = 'latest',
): Promise<PlaylistResponse> => {
  const response = await axiosInstance.get<PlaylistResponse>('/api/v1/playlist/all', {
    params: {
      page,
      size,
      sortBy,
    },
  })
  return response.data
}

// 내 플레이리스트 가져오기 - userId 제거
export const getMyPlaylists = async (
  page: number = 0,
  size: number = 20,
): Promise<PlaylistResponse> => {
  const response = await axiosInstance.get<PlaylistResponse>('/api/v1/playlist/my', {
    params: {
      page,
      size,
    },
  })
  return response.data
}

// 북마크한 플레이리스트 가져오기 - userId 제거
export const getBookmarkedPlaylists = async (
  page: number = 0,
  size: number = 20,
): Promise<PlaylistResponse> => {
  const response = await axiosInstance.get<PlaylistResponse>('/api/v1/playlist/bookmarked', {
    params: {
      page,
      size,
    },
  })
  return response.data
}

// 북마크 추가/해제 - userId 제거
export const togglePlaylistBookmark = async (playListId: number): Promise<BookmarkResponse> => {
  const requestBody = {
    playListId,
  }

  const response = await axiosInstance.post<BookmarkResponse>(
    '/api/v1/playlist/bookmark',
    requestBody,
  )
  return response.data
}

// 북마크 상태 확인 (필요시)
export const checkBookmarkStatus = async (
  playListId: number,
  userId: number = 3,
): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/playlist/${playListId}/bookmark/status?userId=${userId}`,
    )
    return response.data.data.isBookmarked
  } catch (error) {
    console.error('Error checking bookmark status:', error)
    return false
  }
}

// 북마크 목록 응답 인터페이스 추가
export interface BookmarkListResponse {
  status: number
  success: boolean
  message: string
  data: {
    playListIds: number[]
    totalCount: number
  }
}

// 사용자 북마크 목록 가져오기 - 수정
export const getUserBookmarks = async (userId: number): Promise<string[]> => {
  const response = await axiosInstance.get<BookmarkListResponse>(`/api/v1/playlist/user/bookmarks`)
  return response.data.data.playListIds.map(id => id.toString())
}

// 영화 검색
export const searchMovies = async (
  query: string,
  page: number = 1,
): Promise<SearchMovieResponse> => {
  const response = await axiosInstance.post<SearchMovieResponse>('/api/v1/search/movie', {
    query: query.trim(),
    page: page,
  })
  return response.data
}

// 플레이리스트 수정 인터페이스
export interface UpdatePlaylistRequest {
  title: string
  hidden: boolean
  movies: {
    tmdbId: number
    posterUrl: string
    title: string
    releaseDate: string | null
  }[]
}

export interface UpdatePlaylistResponse {
  success: boolean
  message: string
  data?: any
}

// 플레이리스트 수정
export const updatePlaylist = async (
  playlistId: string,
  playlistData: UpdatePlaylistRequest,
): Promise<UpdatePlaylistResponse> => {
  const response = await axiosInstance.put<UpdatePlaylistResponse>(
    `/api/v1/playlist/${playlistId}`,
    playlistData,
  )
  return response.data
}

// 플레이리스트 삭제 응답 인터페이스
export interface DeletePlaylistResponse {
  success: boolean
  message: string
  data?: any
}

// 플레이리스트 삭제
export const deletePlaylist = async (playlistId: string): Promise<DeletePlaylistResponse> => {
  const response = await axiosInstance.delete<DeletePlaylistResponse>(
    `/api/v1/playlist/${playlistId}`,
  )
  return response.data
}

export const getPlaylistsByNickname = async (
  nickname: string,
  page: number = 0,
  size: number = 20,
): Promise<PlaylistResponse> => {
  const response = await axiosInstance.get<PlaylistResponse>(`/api/v1/playlist/user/${nickname}`, {
    params: { page, size },
  })
  return response.data
}
