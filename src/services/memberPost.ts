import axios from '@/services/axiosInstance'

export const getUserReviewsLatest = async (nickname: string, page = 0, size = 8) => {
  return await axios.get(`/api/v1/review/user/${nickname}/latest`, {
    params: { page, size },
  })
}
