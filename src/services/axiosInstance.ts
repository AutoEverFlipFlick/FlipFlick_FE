import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://api.ddalkkug.kro.kr/api/v1',
  // withCredentials: true,
})

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers = config.headers ?? {}

    // Bearer 토큰 추가
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  response => response,
  (error: any) => {
    if (error.response?.status === 401) {
      console.log(error.response)
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
