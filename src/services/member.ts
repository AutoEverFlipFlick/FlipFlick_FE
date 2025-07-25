import axiosInstance from '../services/axiosInstance'

export const signup = async (data: {
  email: string
  password: string
  checkedPassword: string
  nickname: string
  profileImage?: string | null
}) => {
  const res = await axiosInstance.post('/api/v1/member/signup', data)
  return res.data
}

export const login = async (data: { email: string; password: string }) => {
  const res = await axiosInstance.post('/api/v1/member/login', data, {
    withCredentials: true, // refreshToken을 쿠키로 받는 경우 필요
  })
  return res.data
}

export const kakaoLogin = async (code: string) => {
  const res = await axiosInstance.post('/api/v1/member/kakao', { code }, { withCredentials: true })
  return res.data
}

export const naverLogin = async (code: string, state: string) => {
  const res = await axiosInstance.post(
    '/api/v1/member/naver',
    { code, state },
    { withCredentials: true }, // refreshToken 쿠키로 받을 경우
  )
  return res.data
}

// 이메일 중복 검사
export const checkEmailDuplicate = async (email: string) => {
  const res = await axiosInstance.get(`/api/v1/member/check/email`, {
    params: { email },
  })
  return res.data
}

// 닉네임 중복 검사
export const checkNicknameDuplicate = async (nickname: string) => {
  const res = await axiosInstance.get(`/api/v1/member/check/nickname`, {
    params: { nickname },
  })
  return res.data
}

export const updateSocialInfo = async (data: {
  nickname: string
  profileImage?: string | null
}) => {
  const res = await axiosInstance.patch('/api/v1/member/social-info', data)
  return res.data
}
export const sendResetPasswordLink = async (email: string) => {
  const res = await axiosInstance.post('/api/v1/password-reset/send-link', { email })
  return res.data
}

// 비밀번호 재설정 실행 (code + newPassword)
export const resetPassword = async (code: string, newPassword: string) => {
  const res = await axiosInstance.put('/api/v1/password-reset', {
    code,
    newPassword,
  })
  return res.data
}

export const logout = async () => {
  const res = await axiosInstance.post('/api/v1/member/logout', null, {
    withCredentials: true,
  })
  return res.data
}

// 유저 정보 조회 API 추가
export const getUserInfo = async () => {
  const res = await axiosInstance.get('/api/v1/member/user-info')
  return res.data
}
