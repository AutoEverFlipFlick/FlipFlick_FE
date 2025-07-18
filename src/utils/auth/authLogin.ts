const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI
const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize'

export const getKaKaoLoginLink = () => {
  return `${KAKAO_AUTH_URL}?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
}

const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID
const NAVER_REDIRECT_URI = import.meta.env.VITE_NAVER_REDIRECT_URI
const NAVER_AUTH_URL = 'https://nid.naver.com/oauth2.0/authorize'

// 임의 state 값 생성
const generateState = () => Math.random().toString(36).substring(2)

export const getNaverLoginLink = () => {
  const state = generateState()
  return `${NAVER_AUTH_URL}?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URI)}&state=${state}`
}
