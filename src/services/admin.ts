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
  const res = await axiosInstance.get('/api/v1/admin/members', {
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

export const fetchReports = async (page: number, size: number, keyword: string, status: string) => {
  const params = {
    page,
    size,
    keyword: keyword || '',
    status,
  }

  const res = await axiosInstance.get('/api/v1/admin/reports', { params })
  return res.data.data
}

export const handleReport = async (reportId: number, action: '경고' | '정지' | '차단' | '기각') => {
  const res = await axiosInstance.patch(`/api/v1/admin/report/${reportId}/handle`, {
    action,
  })
  return res.data
}

export const fetchTopReviewedMovies = async () => {
  const res = await axiosInstance.get('/api/v1/admin/movies/top-review')
  return res.data
}
