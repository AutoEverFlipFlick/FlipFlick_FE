// import axios from 'axios'
// import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// const axiosInstance: AxiosInstance = axios.create({
//   baseURL: 'https://api.ddalkkug.kro.kr/api/v1',
//   // withCredentials: true,
// })

// // 요청 인터셉터 설정
// axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   const token = localStorage.getItem('accessToken')
//   if (token) {
//     config.headers = config.headers ?? {}

//     // Bearer 토큰 추가
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// // 응답 인터셉터 설정
// axiosInstance.interceptors.response.use(
//   response => response,
//   (error: any) => {
//     if (error.response?.status === 401) {
//       console.log(error.response)
//     }
//     return Promise.reject(error)
//   },
// )

// export default axiosInstance

import axios from 'axios'


// access token을 로컬 스토리지에서 가져오도록 설정
const getAccessToken = () => localStorage.getItem('accessToken')

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true,

})

// 요청 인터셉터: Authorization 헤더 자동 추가
axiosInstance.interceptors.request.use(
  config => {
    const token = getAccessToken()
    const isAuthExcluded =
      config.url?.includes('/member/login') || config.url?.includes('/member/signup')

    if (token && !isAuthExcluded) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error),
)

export default axiosInstance
