// import axios from 'axios'
// import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// const axiosInstance: AxiosInstance = axios.create({
//   baseURL: 'http://localhost:8080/api/v1',
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
  baseURL: 'http://localhost:8080',
  withCredentials: true,
})

// 요청 인터셉터: Authorization 헤더 자동 추가
axiosInstance.interceptors.request.use(
  config => {
    const token = getAccessToken()
    const isAuthExcluded =
      config.url?.includes('/member/login') ||
      config.url?.includes('/member/signup') ||
      config.url?.includes('/s3/image') ||
      config.url?.includes('/member/kakao') ||
      config.url?.includes('/member/naver')

    if (token && !isAuthExcluded) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error),
)

// 응답 인터셉터: accessToken 만료 시 재발급 시도
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const res = await axios.post(
          'http://localhost:8080/api/v1/member/reissue',
          {},
          { withCredentials: true },
        )

        const newAccessToken = res.data.data.accessToken
        localStorage.setItem('accessToken', newAccessToken)
        // 커스텀 이벤트 발생 (useTokenObserver가 이걸 감지함)
        window.dispatchEvent(
          new CustomEvent('tokenStorage', {
            detail: { newToken: res.data.data.accessToken },
          }),
        )

        // 원래 요청에 새 토큰 붙이고 재요청
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosInstance(originalRequest)
      } catch (reissueError) {
        console.error('토큰 재발급 실패:', reissueError)
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
