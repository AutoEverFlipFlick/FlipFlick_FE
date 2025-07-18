import React, { useState } from 'react'
import styled from 'styled-components'
import backgroundImage from '@/assets/common/background.png'
import BaseInput from '@/components/common/BaseInput'
import BaseButton from '@/components/common/BaseButton'
import { login } from '@/services/member'
import { useNavigate } from 'react-router-dom'

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: url(${backgroundImage}) center center / contain no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    background-size: cover;
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
    width: 50%;
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
`

const EmailLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await login({ email, password })

      // ✅ accessToken 저장
      localStorage.setItem('accessToken', res.data.accessToken)

      // ✅ 로그인 성공 처리
      navigate('/')
      // TODO: 메인 페이지나 홈으로 이동
      // navigate('/home') <-- react-router 사용 시
    } catch (err) {
      console.error('로그인 실패:', err)
      alert('이메일 또는 비밀번호가 잘못되었습니다.')
    }
  }

  return (
    <Wrapper>
      <LoginBox>
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
          <FindPasswordText>비밀번호 찾아볼래?</FindPasswordText>
        </InputWrapper>

        <LoginButton variant="dark" onClick={handleLogin}>
          로그인 해볼래?
        </LoginButton>
      </LoginBox>
    </Wrapper>
  )
}

export default EmailLogin
