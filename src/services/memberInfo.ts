// src/services/memberInfo.ts
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
  return axios.get<ApiResponse<MemberResponseDto>>('/member/user-info')
}

// 특정 ID의 유저 정보 가져오기
export function getUserById(
  id: string | number,
): Promise<AxiosResponse<ApiResponse<MemberResponseDto>>> {
  return axios.get<ApiResponse<MemberResponseDto>>(`/member/user-info/${id}`)
}

// 팔로우 확인 여부
export const checkFollowStatus = async (targetId: number) => {
  const response = await axios.get(`/follow/check?targetId=${targetId}`)
  return response.data.data.isFollowing as boolean
}

// 팔로우
export const followUser = async (targetId: number) => {
  return axios.post(`/follow/${targetId}`)
}

// 언팔로우
export const unfollowUser = async (targetId: number) => {
  return axios.delete(`/follow/${targetId}`)
}

// 특정 유저의 팔로워 리스트
export const getFollowersById = (userId: string | number) => {
  return axios.get(`/follow/${userId}/follower`)
}

// 특정 유저의 팔로잉 리스트
export const getFollowingsById = (userId: string | number) => {
  return axios.get(`/follow/${userId}/following`)
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
