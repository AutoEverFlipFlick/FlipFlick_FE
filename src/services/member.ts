import axiosInstance from '../services/axiosInstance'

export const signup = async (data: {
  email: string
  password: string
  checkedPassword: string
  nickname: string
  profileImage?: string
}) => {
  const res = await axiosInstance.post('/member/signup', data)
  return res.data
}

export const login = async (data: { email: string; password: string }) => {
  const res = await axiosInstance.post('/member/login', data, {
    withCredentials: true, // refreshToken을 쿠키로 받는 경우 필요
  })
  return res.data
}

export const kakaoLogin = async (code: string) => {
  const res = await axiosInstance.post('/member/kakao', { code }, { withCredentials: true })
  return res.data
}
