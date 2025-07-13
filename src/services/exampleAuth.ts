import type { AxiosResponse } from 'axios'
import axiosInstance from '@/services/axiosInstance'

// 예시 : 로그인 API 응답 타입
export interface LoginResponse {
  accessToken: string
  // 그 외 필드
}

// 예시 : 사용자 정보 조회 API 응답 타입
export interface UserInfo {
  email: string
  nickname: string
  // 그 외 필드
}

export const useAuthApi = () => {
  // 로그인
  const login = async (email: string, password: string): Promise<AxiosResponse<LoginResponse>> => {
    return axiosInstance.post<LoginResponse>('/member/login', { email, password })
  }

  // 사용자 정보 조회
  const getUserInfo = async (): Promise<AxiosResponse<UserInfo>> => {
    return axiosInstance.get<UserInfo>('/member/user-info')
  }

  return {
    login,
    getUserInfo,
  }
}

export default useAuthApi
