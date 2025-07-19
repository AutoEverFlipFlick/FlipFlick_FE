import axiosInstance from '../services/axiosInstance'

export const fetchDashboardStats = async () => {
  const res = await axiosInstance.get('/api/v1/admin/stat')
  return res.data
}

export const fetchPopcornStats = async () => {
  const res = await axiosInstance.get('/api/v1/admin/popcorn')
  return res.data
}

export const fetchMembers = async (page: number, size: number, keyword?: string) => {
  const res = await axiosInstance.get('/api/v1/member/members', {
    params: {
      page,
      size,
      keyword: keyword || undefined, // 없으면 undefined로 생략
    },
  })
  return res.data
}

export const updateMemberStatus = async (memberId: number, status: string) => {
  const res = await axiosInstance.patch(`/api/v1/admin/member/${memberId}/status`, { status })
  return res.data
}
