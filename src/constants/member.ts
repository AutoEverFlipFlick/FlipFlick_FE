import axiosInstance from './axiosInstance'

export const signup = async (data: {
  email: string
  password: string
  checkedPassword: string
  nickname: string
  profileImage?: string // base64 or URL or FormData 처리 방식에 따라
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
