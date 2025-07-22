import axiosInstance from './axiosInstance'

// 토론 작성
export const createDebate = async (data: {
  tmdbId: number
  debateTitle: string
  content: string
  spoiler: boolean
}) => {
  const res = await axiosInstance.post('/api/v1/debate/create', data)
  return res.data
}

// 토론 상세 조회
export const getDebateDetail = async (debateId: number) => {
  const res = await axiosInstance.get(`/api/v1/debate/${debateId}`)
  return res.data
}

// 좋아요/싫어요
export const likeHateDebate = async (data: { debateId: number; type: 'LIKE' | 'HATE' }) => {
  const res = await axiosInstance.post('/api/v1/debate/like-hate', data)
  return res.data
}

// 토론 수정
export const updateDebate = async (
  debateId: number,
  data: {
    debateTitle: string
    content: string
    spoiler: boolean
  },
) => {
  const res = await axiosInstance.put(`/api/v1/debate/${debateId}`, data)
  return res.data
}

// 토론 삭제
export const deleteDebate = async (debateId: number) => {
  const res = await axiosInstance.delete(`/api/v1/debate/${debateId}`)
  return res.data
}

// 신고하기
export const reportContent = async (data: {
  reporterId: number
  targetId: number
  type: string
  content: string
  targetTitle: string
  targetContent: string
  targetEntityId: number
}) => {
  const res = await axiosInstance.post('/api/v1/report', data)
  return res.data
}

// 댓글 등록
export const createComment = async (data: { debateId: number; content: string }) => {
  const res = await axiosInstance.post('/api/v1/debate/comments', data)
  return res.data
}

// 댓글 삭제
export const deleteComment = async (commentId: number) => {
  const res = await axiosInstance.delete(`/api/v1/debate/comments/${commentId}`)
  return res.data
}

// ...existing code...

// 댓글 목록 조회 (페이지네이션 추가)
export const getComments = async (debateId: number, page = 0, size = 10) => {
  const res = await axiosInstance.get(
    `/api/v1/debate/comments/${debateId}?page=${page}&size=${size}`,
  )
  return res.data
}

// ...existing code...
