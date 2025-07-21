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
