import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { naverLogin } from '@/services/member'
import { useAuth } from '@/context/AuthContext' // AuthContext 추가
import Swal from 'sweetalert2'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 16px;
`

const NaverRedirectHandler: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { updateUser } = useAuth() // AuthContext의 updateUser 함수 가져오기

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (code && state) {
      const sendCodeToBackend = async () => {
        try {
          console.log('🟢 네이버 로그인 처리 시작:', { code, state })

          const res = await naverLogin(code, state)
          console.log('🟢 네이버 로그인 응답:', res)

          if (res.success) {
            const { accessToken, refreshToken, isNew } = res.data

            // 토큰 저장
            localStorage.setItem('accessToken', accessToken)
            if (refreshToken) {
              localStorage.setItem('refreshToken', refreshToken)
            }

            console.log('🟢 토큰 저장 완료, isNew:', isNew)

            // 커스텀 이벤트 발생 (기존 코드와의 호환성을 위해 유지)
            window.dispatchEvent(
              new CustomEvent('tokenStorage', {
                detail: { newToken: accessToken },
              }),
            )

            if (isNew) {
              // 신규 회원인 경우 - 추가 정보 입력 페이지로
              sessionStorage.setItem('socialType', 'NAVER') // KAKAO → NAVER로 수정
              navigate('/signup/social')
            } else {
              // 기존 회원인 경우 - 유저 정보 가져와서 AuthContext 업데이트
              console.log('🟢 기존 회원, 유저 정보 조회 중...')

              try {
                // 유저 정보 API 호출
                const { getUserInfo } = await import('@/services/member')
                const userInfoResponse = await getUserInfo()

                if (userInfoResponse.success) {
                  console.log('🟢 유저 정보 조회 성공:', userInfoResponse.data)

                  // AuthContext에 유저 정보 설정
                  updateUser(userInfoResponse.data)

                  navigate('/') // 메인 페이지로 이동
                } else {
                  throw new Error('유저 정보 조회 실패')
                }
              } catch (userInfoError) {
                console.error('🟢 유저 정보 조회 실패:', userInfoError)

                // 유저 정보 조회 실패 시에도 메인 페이지로 이동
                // (AuthContext가 페이지 로드 시 다시 시도할 것)
                navigate('/')
              }
            }
          } else {
            throw new Error(res.message || '네이버 로그인 실패')
          }
        } catch (error: any) {
          console.error('🟢 네이버 로그인 에러:', error)

          if (error.response?.status !== 403) {
            Swal.fire({
              icon: 'error',
              title: '로그인 실패',
              text: '네이버 로그인에 실패했습니다.',
              background: '#1e1e2f',
              color: '#fff',
            })
            navigate('/login')
          }
        }
      }

      sendCodeToBackend()
    } else {
      console.error('🟢 인가 코드 또는 state 없음')
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '인가 코드가 없습니다.',
        background: '#1e1e2f',
        color: '#fff',
      })
      navigate('/login')
    }
  }, [searchParams, navigate, updateUser])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
      }}
    >
      <Spinner />
      <p>네이버 로그인 처리 중입니다...</p>
    </div>
  )
}

export default NaverRedirectHandler
