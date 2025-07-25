import axios from '@/services/axiosInstance'
import type { AxiosResponse } from 'axios'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface MemberResponseDto {
  id: number
  email: string
  nickname: string
  profileImage: string
  followerCount: number
  followingCount: number
  isFollowing: boolean
}

// 로그인된 유저 정보 가져오기
export function userInfoGet(): Promise<AxiosResponse<ApiResponse<MemberResponseDto>>> {
  return axios.get<ApiResponse<MemberResponseDto>>('/api/v1/member/user-info')
}

// 특정 ID의 유저 정보 가져오기
export function getUserById(
  id: string | number,
): Promise<AxiosResponse<ApiResponse<MemberResponseDto>>> {
  return axios.get<ApiResponse<MemberResponseDto>>(`/api/v1/member/user-info/${id}`)
}

// 팔로우 확인 여부
export const checkFollowStatus = async (targetId: number) => {
  const response = await axios.get(`/api/v1/follow/check?targetId=${targetId}`)
  return response.data.data.isFollowing as boolean
}

// 팔로우
export const followUser = async (targetId: number) => {
  return axios.post(`/api/v1/follow/${targetId}`)
}

// 언팔로우
export const unfollowUser = async (targetId: number) => {
  return axios.delete(`/api/v1/follow/${targetId}`)
}

// 특정 유저의 팔로워 리스트
export const getFollowersById = (userId: string | number, page: number, size: number) => {
  return axios.get(`/api/v1/follow/${userId}/follower?page=${page}&size=${size}`)
}

// 특정 유저의 팔로잉 리스트
export const getFollowingsById = (userId: string | number, page: number, size: number) => {
  return axios.get(`/api/v1/follow/${userId}/following?page=${page}&size=${size}`)
}

// export const getPopcornScore = async (userId?: number) => {
//   if (userId) {
//     return axios.get(`/api/v1/popcorn/user/${userId}`)
//   } else {
//     return axios.get(`/api/v1/popcorn/my`)
//   }
// }

export const getPopcornScore = async () => {
  const res = await axios.get('/api/v1/popcorn/my')
  return res.data.data
}

export const getUserPopcornScore = async (userId: number) => {
  const res = await axios.get(`/api/v1/popcorn/user/${userId}`)
  return res.data.data
}

export default {
  userInfoGet,
  getUserById,
  checkFollowStatus,
  followUser,
  unfollowUser,
  getFollowersById,
  getFollowingsById,
}
