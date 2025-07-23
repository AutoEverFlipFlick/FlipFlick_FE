import axiosInstance from '@/services/axiosInstance'

export const bookmarkMovie = async (movieId: number) => {
  console.log('bookmarkMovie caller with movieId: ', movieId)
  const res = await axiosInstance.post(`/api/v1/movie/bookmark`, {
    movieId: movieId,
  })
  return res.data
}

export const watchedMovie = async (movieId: number) => {
  const res = await axiosInstance.post(`/api/v1/movie/watched`, {
    movieId: movieId,
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
    likeHateType: 'LIKE',
  })
  return res.data
}

export const hateMovie = async (movieId: number) => {
  const res = await axiosInstance.post(`/api/v1/movie/like-hate`, {
    movieId: movieId,
    likeHateType: 'HATE',
  })
  return res.data
}

export const getMovieReview = async (tmdbId: string | undefined, page: number) => {
  const res = await axiosInstance.get(`/api/v1/review/movie/${tmdbId}/latest`, {
    params: {
      page: page,
      size: 10, // 페이지당 리뷰 개수
    },
  })
  return res.data
}

export interface ReviewParams {
  tmdbId: number
  star: number
  content: string
  spoiler: boolean
}

export interface ReviewUpdateParams {
  star: number
  content: string
  spoiler: boolean
}

export const createMovieReview = async (params: ReviewParams) => {
  const res = await axiosInstance.post(`/api/v1/review/create`, params)
  return res.data
}

export const deleteMovieReview = async (reviewId: number) => {
  const res = await axiosInstance.delete(`/api/v1/review/${reviewId}`)
  return res.data
}
export const updateMovieReview = async (reviewId: number, params: ReviewUpdateParams) => {
  const res = await axiosInstance.put(`/api/v1/review/${reviewId}`, params)
  return res.data
}

export const getMyMovieReview = async (tmdbId: string | undefined) => {
  if (!tmdbId) console.error('getMyMovieReview called with undefined tmdbId')
  console.log('getMyMovieReview called with tmdbId')
  const res = await axiosInstance.get(`/api/v1/review/movie/${tmdbId}/my/status`)
  return res.data
}

export const getMovieDebate = async (tmdbId: string | undefined, page: number) => {
  const res = await axiosInstance.get(`/api/v1/debate/movie/${tmdbId}/latest`, {
    params: {
      page: page,
      size: 10, // 페이지당 토론 개수
    },
  })
  return res.data
}

// 리뷰 좋아요 토글
export const likeReview = async (reviewId: number) => {
  console.log('📡 likeReview API 호출:', reviewId)

  if (!reviewId || reviewId === 0) {
    throw new Error('리뷰 ID가 필요합니다.')
  }

  try {
    const requestBody = {
      reviewId: reviewId,
      type: 'LIKE',
    }

    console.log('📡 전송할 데이터:', requestBody)

    const res = await axiosInstance.post(`/api/v1/review/like-hate`, requestBody) // URL 변경
    console.log('📡 likeReview API 응답:', res.data)
    return res.data
  } catch (error: any) {
    console.error('❌ likeReview API 에러:', error)
    console.error('❌ 에러 응답:', error.response?.data)
    throw error
  }
}

// 리뷰 싫어요 토글
export const hateReview = async (reviewId: number) => {
  console.log('📡 hateReview API 호출:', reviewId)

  if (!reviewId || reviewId === 0) {
    throw new Error('리뷰 ID가 필요합니다.')
  }

  try {
    const requestBody = {
      reviewId: reviewId,
      type: 'HATE',
    }

    console.log('📡 전송할 데이터:', requestBody)

    const res = await axiosInstance.post(`/api/v1/review/like-hate`, requestBody) // 같은 엔드포인트 사용
    console.log('📡 hateReview API 응답:', res.data)
    return res.data
  } catch (error: any) {
    console.error('❌ hateReview API 에러:', error)
    console.error('❌ 에러 응답:', error.response?.data)
    throw error
  }
}

// 토론 좋아요 토글
export const likeDebate = async (debateId: number) => {
  const res = await axiosInstance.post(`/api/v1/debate/like-hate`, {
    debateId: debateId,
    likeHateType: 'LIKE',
  })
  return res.data
}

// 토론 싫어요 토글
export const hateDebate = async (debateId: number) => {
  const res = await axiosInstance.post(`/api/v1/debate/like-hate`, {
    debateId: debateId,
    likeHateType: 'HATE',
  })
  return res.data
}

// 인기순 리뷰 조회
export const getMovieReviewByPopular = async (tmdbId: string | undefined, page: number) => {
  const res = await axiosInstance.get(`/api/v1/review/movie/${tmdbId}/popular`, {
    params: {
      page: page,
      size: 10,
    },
  })
  return res.data
}

// 유사한 성향의 리뷰 조회
export const getSimilarReviews = async (tmdbId: string | undefined, page: number) => {
  const res = await axiosInstance.get(`/api/v1/recommendation/similar-reviews/${tmdbId}`, {
    params: {
      page: page,
      size: 10,
    },
  })
  return res.data
}
