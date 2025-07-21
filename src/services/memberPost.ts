import axios from '@/services/axiosInstance'

export const getUserReviewsLatest = async (nickname: string, page = 0, size = 8) => {
  return await axios.get(`/api/v1/review/user/${nickname}/latest`, {
    params: { page, size },
  })
}

export type SortBy = 'popular' | 'latest'

export interface ApiResponse<T> {
  code: string
  message: string
  data: T
}

export interface Debate {
  debateId: number
  content: string
  createdAt: string
  likeCnt: number
  image: string
  debateTitle: string
  movieTitle: string
  hateCnt: number
  commentCount: number
}

interface PageResponse<T> {
  content: T[]
  totalElements: number
}

// 사용자 토론 목록 조회 (정렬별)
export const getUserDebatesBySort = async (
  nickname: string,
  page = 0,
  size = 8,
  sortBy: 'latest' | 'popular',
) => {
  const endpoint =
    sortBy === 'popular'
      ? `/api/v1/debate/user/${nickname}/popular`
      : `/api/v1/debate/user/${nickname}/latest`

  return await axios.get<ApiResponse<PageResponse<Debate>>>(endpoint, {
    params: { page, size },
  })
}

// 특정 토론의 댓글 개수 조회
export const getDebateCommentCount = async (debateId: number) => {
  return await axios.get<ApiResponse<number>>(`/api/v1/debate/comments/${debateId}/count`)
}
