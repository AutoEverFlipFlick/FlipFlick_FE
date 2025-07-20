import axios from '@/services/axiosInstance'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from './memberInfo'

// 리스트 조회용 DTO
export interface MovieListItem {
  tmdbId: number
  posterImage: string
  title: string
  year: number
}

// 리스트 응답 (페이징 포함)
export interface MovieListResponseDTO {
  totalElements: number
  totalPages: number
  page: number
  size: number
  isLast: boolean
  content: MovieListItem[]
}

// 찜 리스트
export function getBookmarkList(
  memberId: number,
  page = 0,
  size = 10,
): Promise<AxiosResponse<ApiResponse<MovieListResponseDTO>>> {
  return axios.get(`/movie/bookmark-list`, { params: { memberId, page, size } })
}
export function getBookmarkCount(
  memberId: number,
): Promise<AxiosResponse<ApiResponse<MovieListResponseDTO>>> {
  return getBookmarkList(memberId, 0, 1) // content는 1개만, totalElements로 전체 개수 꺼내기
}

// 본 영화 리스트
export function getWatchedList(
  memberId: number,
  page = 0,
  size = 10,
): Promise<AxiosResponse<ApiResponse<MovieListResponseDTO>>> {
  return axios.get(`/movie/watched-list`, { params: { memberId, page, size } })
}
export function getWatchedCount(
  memberId: number,
): Promise<AxiosResponse<ApiResponse<MovieListResponseDTO>>> {
  return getWatchedList(memberId, 0, 1)
}

// 좋아요 리스트
export function getLikeList(
  memberId: number,
  page = 0,
  size = 10,
): Promise<AxiosResponse<ApiResponse<MovieListResponseDTO>>> {
  return axios.get(`/movie/like-list`, { params: { memberId, page, size } })
}
export function getLikeCount(
  memberId: number,
): Promise<AxiosResponse<ApiResponse<MovieListResponseDTO>>> {
  return getLikeList(memberId, 0, 1)
}
