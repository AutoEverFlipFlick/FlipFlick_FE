import type { AxiosResponse } from 'axios'
import axios from '@/services/axiosInstance'

export interface LoginResponse {
  accessToken: string
  // 그 외 필드
}

export const updateNickname = async (nickname: string): Promise<AxiosResponse<void>> => {
  return await axios.put<void>('/api/v1/member/nickname', {
    nickname,
  })
}

export const updatePassword = async (
  password: string,
  confirmPassword: string,
): Promise<AxiosResponse<void>> => {
  try {
    const res = await axios.put<void>('/api/v1/member/password', {
      password,
      confirmPassword,
    })
    return res
  } catch (err) {
    console.error('비밀번호 변경 실패', err)
    throw err
  }
}

export const updateProfileImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await axios.put('/api/v1/member/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return res.data.data // URL 반환
  } catch (err) {
    console.error('프로필 이미지 변경 실패:', err)
    throw err
  }
}
