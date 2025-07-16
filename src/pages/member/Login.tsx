import React from 'react'
import styled from 'styled-components'
import backgroundImage from '@/assets/common/background.png'
import kakaoIcon from '@/assets/icons/kakao.png'
import naverIcon from '@/assets/icons/naver.png'

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

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`

const SocialButton = styled.button<{ bgColor: string }>`
  position: relative;
  width: 400px;
  height: 48px;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.bgColor};
  color: ${props => (props.bgColor === '#03C75A' ? 'white' : 'black')};
  font-weight: bold;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.15s ease;

  &:hover {
    background-color: ${props => (props.bgColor === '#03C75A' ? '#2AE877' : '#fff066')};
  }

  @media (max-width: 700px) {
    width: 260px;
  }
`

const Icon = styled.img`
  position: absolute;
  left: 20px;
  width: 20px;
  height: 20px;
`

const TextRow = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #ff9900;
  display: flex;
  gap: 12px;

  a {
    color: #ff9900;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: #ff6600;
  }
`

const Login: React.FC = () => {
  return (
    <Wrapper>
      <Box>
        <SocialButton bgColor="#FEE500">
          <Icon src={kakaoIcon} alt="카카오" />
          카카오로 시작하기
        </SocialButton>
        <SocialButton bgColor="#03C75A">
          <Icon src={naverIcon} alt="네이버" />
          네이버로 시작하기
        </SocialButton>
        <TextRow>
          <a href="/emaillogin">이메일 로그인</a>|<a href="/signup">이메일 회원가입</a>
        </TextRow>
      </Box>
    </Wrapper>
  )
}

export default Login
