import React, { useState } from 'react'
import styled from 'styled-components'
import BaseInput from '@/components/common/BaseInput'
import BaseButton from '@/components/common/BaseButton'
import { sendResetPasswordLink } from '@/services/member'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column; // ✅ 수직 정렬
  justify-content: center;
  align-items: center;
`

const Logo = styled.img`
  width: 180px;
  height: auto;
  margin-bottom: 32px;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 150px;
    margin-bottom: 24px;
  }
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 400px;

  @media (max-width: 768px) {
    width: 80%;
  }
`
const SuccessBox = styled.div`
  background-color: #e6ffe6;
  color: #2d7a2d;
  border: 1px solid #a1e3a1;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  line-height: 1.5;
`

const Message = styled.div<{ isError?: boolean }>`
  font-size: 13px;
  color: ${({ isError }) => (isError ? '#ff6666' : '#99ff99')};
  text-align: end;
`

const FindPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const [isEmailValid, setIsEmailValid] = useState(false)

  const handleEmailChange = (value: string) => {
    setEmail(value)
    const valid = isValidEmail(value)
    setIsEmailValid(valid)
    setMessage(valid ? '사용 가능한 이메일입니다.' : '올바른 이메일 형식을 입력해주세요.')
  }

  const isValidEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }
  const handleSendEmail = async () => {
    if (!isValidEmail(email)) {
      setMessage('유효한 이메일 형식을 입력하세요.')
      return
    }

    try {
      setIsLoading(true)
      await sendResetPasswordLink(email)
      setSuccess(true)
      setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다.')
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: '이메일 전송 실패',
        text: err.response?.data?.message || '이메일 전송에 실패했습니다.',
        confirmButtonColor: '#d33',
        confirmButtonText: '확인',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Wrapper>
      <Logo src="/logo_full.webp" alt="로고" onClick={() => navigate('/login')} />
      <Box>
        {!success ? (
          <>
            <BaseInput
              type="email"
              placeholder="가입한 이메일 주소를 입력하세요"
              value={email}
              onChange={e => handleEmailChange(e.target.value)}
              inputSize="small"
              state={email ? (isEmailValid ? 'success' : 'error') : undefined}
            />
            {email && <Message isError={!isEmailValid}>{message}</Message>}
            <BaseButton
              variant="dark"
              onClick={handleSendEmail}
              disabled={!isEmailValid || isLoading}
            >
              {isLoading ? '전송 중...' : '이메일 전송'}
            </BaseButton>
          </>
        ) : (
          <SuccessBox>
            이메일을 확인해주세요! <br />
            비밀번호를 재설정할 수 있는 링크가 전송되었습니다.
          </SuccessBox>
        )}
      </Box>
    </Wrapper>
  )
}

export default FindPassword
