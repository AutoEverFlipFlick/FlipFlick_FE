import axiosInstance from "@/services/axiosInstance";

export const bookmarkMovie = async (movieId : number) => {
  console.log('bookmarkMovie caller with movieId: ',movieId)
  const res = await axiosInstance.post(`/api/v1/movie/bookmark`, {
    movieId : movieId,
  })
  return res.data
}

export const watchedMovie = async (movieId: number) => {
  const res = await axiosInstance.post(`/api/v1/movie/watched`, {
   movieId : movieId,
  })
  return res.data
}

export const getMovieDetail = async (tmdbId: string | undefined) => {
  const res = await axiosInstance.post(`/api/v1/movie/view`, {
    tmdbId: tmdbId,
  })
  return res.data
}

export const likeMovie = async (movieId: number) => {
  const res = await axiosInstance.post(`/api/v1/movie/like-hate`, {
    movieId: movieId,
    likeHateType: "LIKE"
  })
  return res.data
}

export const hateMovie = async (movieId: number) => {
  const res = await axiosInstance.post(`/api/v1/movie/like-hate`, {
    movieId: movieId,
    likeHateType: "HATE"
  })
  return res.data
}

export const getMovieReview = async (tmdbId: string | undefined, page: number) => {
  const res = await axiosInstance.get(`/api/v1/review/movie/${tmdbId}/latest`, {
    params: {
      page: page,
      size: 10, // 페이지당 리뷰 개수
    }
  })
  return res.data
}

export interface ReviewParams {
  tmdbId: number;
  star: number;
  content: string;
  spoiler: boolean;
}

export const createMovieReview = async (params: ReviewParams) => {
  const res = await axiosInstance.post(`/api/v1/review/create`, params)
  return res.data
}
