import React, { useState } from 'react'
import styled from 'styled-components'
import backgroundImage from '@/assets/common/background2.webp'
import BaseInput from '@/components/common/BaseInput'
import BaseButton from '@/components/common/BaseButton'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '@/context/AuthContext'

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: url(${backgroundImage}) center center / contain no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    background: none; // 모바일에서 배경 제거
  }
`

const MobileLogo = styled.img`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 180px;
    height: auto;
    margin-bottom: 32px;
  }
`

const LoginBox = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 450px;
  align-items: center;

  @media (max-width: 768px) {
    width: 70%;
  }
`

const ResponsiveInput = styled(BaseInput)`
  width: 100%;
  padding-left: 4px;
`
const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`

const FindPasswordText = styled.span`
  font-size: 12px;
  color: #ffa500;
  cursor: pointer;
  align-self: flex-end; // 오른쪽 정렬

  margin-top: 4px;

  &:hover {
    color: #ff8800;
  }
`

const LoginButton = styled(BaseButton)`
  width: 250px;
  height: 48px;
  font-size: 16px;
  min-width: 160px;
  @media (max-width: 768px) {
    width: 200px;
    height: 40px;
    font-size: 14px;
  }
`

const EmailLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async () => {
    try {
      // ✅ accessToken 저장
      const success = await login(email, password)

      if (success) {
        console.log('✅ EmailLogin: 로그인 성공')

        // 모달창 없이 바로 페이지 이동
        navigate('/', { replace: true })
      } else {
        console.log('❌ EmailLogin: 로그인 실패')
        Swal.fire({
          icon: 'error',
          title: '로그인 실패',
          text: '이메일 또는 비밀번호가 올바르지 않습니다.',
          background: '#1e1e2f',
          color: '#fff',
        })
      }
    } catch (error) {
      console.error('❌ EmailLogin: 로그인 에러:', error)
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '로그인 중 오류가 발생했습니다.',
        background: '#1e1e2f',
        color: '#fff',
      })
    }
  }

  return (
    <Wrapper>
      <LoginBox>
        <MobileLogo src="/logo_full.webp" alt="로고" />
        <InputWrapper>
          <ResponsiveInput
            inputSize="small"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </InputWrapper>

        <InputWrapper>
          <ResponsiveInput
            inputSize="small"
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <FindPasswordText onClick={() => navigate('/find-password')}>
            비밀번호 찾아볼래?
          </FindPasswordText>
        </InputWrapper>

        <LoginButton variant="dark" onClick={handleLogin}>
          로그인 해볼래?
        </LoginButton>
      </LoginBox>
    </Wrapper>
  )
}

export default EmailLogin
