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
    image: string
}

export interface Cast {
    tmdbId: number
    name: string
    profileImage: string
    knownFor: string[]
}

export interface Playlist {
    id: number
    title: string
    image: string
    creator: string
    count: number
}

export interface User {
    id: number
    name: string
    avatar: string
    followers: number
}

export const searchMovies = async (
    query: string,
    page: number,
): Promise<PageResult<Movie>> => {
    const resp = await axiosInstance.post('/search/movie', { query, page })
    return resp.data.data
}

export const searchCasts = async (
    query: string,
    page: number,
): Promise<PageResult<Cast>> => {
    const resp = await axiosInstance.post('/search/cast', { query, page })
    return resp.data.data
}

export const searchPlaylists = async (
    query: string,
    page: number,
): Promise<PageResult<Playlist>> => {
    const resp = await axiosInstance.post('/search/playlist', { query, page })
    return resp.data.data
}

export const searchUsers = async (
    query: string,
    page: number,
): Promise<PageResult<User>> => {
    const resp = await axiosInstance.post('/search/user', { query, page })
    return resp.data.data
}
