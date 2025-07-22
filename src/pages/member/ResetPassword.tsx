import React, { useState } from 'react'
import styled from 'styled-components'
import { useSearchParams, useNavigate } from 'react-router-dom'
import BaseInput from '@/components/common/BaseInput'
import BaseButton from '@/components/common/BaseButton'
import { resetPassword } from '@/services/member'
import Swal from 'sweetalert2'

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Logo = styled.img`
  width: 180px;
  height: auto;
  margin-bottom: 32px;

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

const Message = styled.div<{ isError?: boolean }>`
  font-size: 12px;
  color: ${({ isError }) => (isError ? '#ff6666' : '#99ff99')};
  text-align: end;
`

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean | null>(null)
  const [confirmMessage, setConfirmMessage] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const validatePassword = (password: string): boolean => {
    const valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)
    setIsPasswordValid(valid)
    setPasswordMessage(
      valid
        ? '사용 가능한 비밀번호입니다.'
        : '영문 대/소문자 + 숫자 + 특수문자를 포함해 8자 이상 입력해주세요.',
    )
    return valid
  }

  const checkPasswordMatch = (value: string, basePassword = newPassword) => {
    const isMatch = value !== '' && value === basePassword
    setIsPasswordMatch(isMatch)
    setConfirmMessage(isMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.')
  }

  const handleSubmit = async () => {
    if (!code) {
      Swal.fire({
        icon: 'error',
        title: '잘못된 접근입니다',
        text: '유효하지 않은 링크입니다.',
        confirmButtonColor: '#d33',
      })
      return
    }

    if (!validatePassword(newPassword)) {
      Swal.fire({
        icon: 'error',
        title: '비밀번호 형식 오류',
        text: '비밀번호 형식을 확인해주세요.',
        confirmButtonColor: '#d33',
      })
      return
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: '비밀번호 불일치',
        text: '비밀번호가 일치하지 않습니다.',
        confirmButtonColor: '#d33',
      })
      return
    }

    try {
      setIsLoading(true)
      await resetPassword(code, newPassword)
      Swal.fire({
        icon: 'success',
        title: '비밀번호 변경 완료!',
        text: '이제 새로운 비밀번호로 로그인할 수 있어요.',
        confirmButtonColor: '#4CAF50',
      }).then(() => navigate('/login'))
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: '비밀번호 변경 실패',
        text: err.response?.data?.message || '비밀번호 변경에 실패했습니다.',
        confirmButtonColor: '#d33',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Wrapper>
      <Logo src="/logo_full.webp" alt="로고" />
      <Box>
        <BaseInput
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={e => {
            const value = e.target.value
            setNewPassword(value)
            validatePassword(value)
            checkPasswordMatch(confirmPassword, value)
          }}
          inputSize="small"
          state={newPassword ? (isPasswordValid ? 'success' : 'error') : undefined}
        />
        {newPassword && isPasswordValid !== null && (
          <Message isError={!isPasswordValid}>{passwordMessage}</Message>
        )}

        <BaseInput
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={e => {
            const value = e.target.value
            setConfirmPassword(value)
            checkPasswordMatch(value)
          }}
          inputSize="small"
          state={confirmPassword ? (isPasswordMatch ? 'success' : 'error') : undefined}
        />
        {confirmPassword && isPasswordMatch !== null && (
          <Message isError={!isPasswordMatch}>{confirmMessage}</Message>
        )}

        <BaseButton
          variant="dark"
          onClick={handleSubmit}
          disabled={
            isLoading || !isPasswordValid || !isPasswordMatch || !newPassword || !confirmPassword
          }
        >
          {isLoading ? '변경 중...' : '비밀번호 변경'}
        </BaseButton>
      </Box>
    </Wrapper>
  )
}

export default ResetPassword
