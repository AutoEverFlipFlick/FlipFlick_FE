import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { naverLogin } from '@/services/member'
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

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (code && state) {
      const sendCodeToBackend = async () => {
        try {
          const res = await naverLogin(code, state)

          const { accessToken } = res.data
          localStorage.setItem('accessToken', accessToken)
          navigate('/')
        } catch (error) {
          console.error('네이버 로그인 실패:', error)
          alert('네이버 로그인 실패')
          navigate('/login')
        }
      }

      sendCodeToBackend()
    } else {
      alert('인가 코드가 없습니다.')
      navigate('/login')
    }
  }, [searchParams, navigate])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '100px',
      }}
    >
      <Spinner />
      <p>로그인 처리 중입니다...</p>
    </div>
  )
}

export default NaverRedirectHandler
