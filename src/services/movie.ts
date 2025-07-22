import axiosInstance from '../services/axiosInstance'

// 팝콘지수별 TOP 10
export const topPopcorn = async (limit: number) => {
  const res = await axiosInstance.get(`/api/v1/movie/top-popcorn`, {
    params: { limit },
  })
  return res.data
}

// 한국영화 예매율 TOP 10
export const boxoffice = async () => {
  const today = new Date() // 현재 날짜 객체 생성
  const year = today.getFullYear() // 연도 추출 (예: 2025)
  const month = String(today.getMonth() + 1) // 월 추출 (0~11 이므로 +1)
    .padStart(2, '0') // 2자리로 맞추기 (예: '04')
  const day = String(today.getDate()) // 일 추출
    .padStart(2, '0')

  const formatted = `${year}-${month}-${day}`
  const res = await axiosInstance.get(`/api/v1/movie/boxoffice`, {
    params: { today: formatted },
  })
  return res.data
}
