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
}

interface PageResponse<T> {
  content: T[]
  totalElements: number
}

/** 사용자 토론 목록 조회 (최신순) */
export const getUserDebatesLatest = async (nickname: string, page = 0, size = 8) => {
  return await axios.get<ApiResponse<PageResponse<Debate>>>(
    `/api/v1/debate/user/${nickname}/latest`,
    {
      params: { page, size },
    },
  )
}

/** 사용자 토론 목록 조회 (최신순) */
export const getUserDebatesPopular = async (nickname: string, page = 0, size = 8) => {
  return await axios.get<ApiResponse<PageResponse<Debate>>>(
    `/api/v1/debate/user/${nickname}/popular`,
    {
      params: { page, size },
    },
  )
}
