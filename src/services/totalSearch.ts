// src/services/totalSearch.ts
import axiosInstance from './axiosInstance'

export interface PageResult<T> {
  totalElements: number
  totalPages: number
  page: number
  size: number
  content: T[]
  last: boolean
}

export interface Movie {
  tmdbId: number
  title: string
  releaseDate: string
  image: string | null
}

export interface Cast {
  tmdbId: number
  name: string
  profileImage: string | null
  knownFor: string[]
}

export interface Playlist {
  playListId: number
  title: string
  nickname: string
  thumbnailUrl: string | null
  movieCount: number
  bookmarkCount: number
}

export interface User {
  memberId: number
  nickname: string
  followCnt: number
  followed: boolean
  profileImage?: string | null
}

export const searchMovies = async (
  query: string,
  page: number
): Promise<PageResult<Movie>> => {
  const resp = await axiosInstance.post('/api/v1/search/movie', { query, page })
  return resp.data.data
}

export const searchCasts = async (
  query: string,
  page: number
): Promise<PageResult<Cast>> => {
  const resp = await axiosInstance.post('/api/v1/search/cast', { query, page })
  return resp.data.data
}

export const searchPlaylists = async (
  query: string,
  page: number
): Promise<PageResult<Playlist>> => {
  const resp = await axiosInstance.post('/api/v1/search/playlist', { query, page })
  return resp.data.data
}

export const searchUsers = async (
  query: string,
  page: number
): Promise<PageResult<User>> => {
  const resp = await axiosInstance.post('/api/v1/search/member', { query, page })
  return resp.data.data
}

// --- 팔로우 / 언팔로우 함수 정의 ---

/**
 * 대상 회원을 팔로우(Post)하고, 성공하면 true 반환
 */
export const followUser = async (memberId: number): Promise<boolean> => {
  await axiosInstance.post(`/api/v1/follow/${memberId}`)
  return true
}

/**
 * 대상 회원을 언팔로우(Delete)하고, 성공하면 false 반환
 */
export const unfollowUser = async (memberId: number): Promise<boolean> => {
  await axiosInstance.delete(`/api/v1/follow/${memberId}`)
  return false
}

/**
 * 현재 상태(followed)에 따라 followUser 또는 unfollowUser 호출
 */
export const toggleFollow = async (
  memberId: number,
  currentlyFollowed: boolean
): Promise<boolean> => {
  return currentlyFollowed
    ? await unfollowUser(memberId)
    : await followUser(memberId)
}
