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
