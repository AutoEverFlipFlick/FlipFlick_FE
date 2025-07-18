import axiosInstance from '../services/axiosInstance'

export const signup = async (data: {
  email: string
  password: string
  checkedPassword: string
  nickname: string
  profileImage?: string | null
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

export const naverLogin = async (code: string, state: string) => {
  const res = await axiosInstance.post(
    '/member/naver',
    { code, state },
    { withCredentials: true }, // refreshToken 쿠키로 받을 경우
  )
  return res.data
}

// 이메일 중복 검사
export const checkEmailDuplicate = async (email: string) => {
  const res = await axiosInstance.get(`/member/check/email`, {
    params: { email },
  })
  return res.data
}

// 닉네임 중복 검사
export const checkNicknameDuplicate = async (nickname: string) => {
  const res = await axiosInstance.get(`/member/check/nickname`, {
    params: { nickname },
  })
  return res.data
}
