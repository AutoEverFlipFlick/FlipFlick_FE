import React, { useState } from 'react'
import styled from 'styled-components'
import backgroundImage from '@/assets/common/background.png'
import BaseInput from '@/components/common/BaseInput'
import BaseButton from '@/components/common/BaseButton'
import profileImageDefault from '@/assets/icons/profile.png'
import cameraIcon from '@/assets/icons/camera.png'
import { signup } from '@/services/member'
import { uploadImage } from '@/services/s3'
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

const FormBox = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 450px;

  @media (max-width: 768px) {
    width: 50%;
  }
`

const SubmitButton = styled(BaseButton)`
  width: 40%;
  height: 48px;
  font-size: 16px;
  min-width: 160px;
`

const ResponsiveInput = styled(BaseInput)`
  width: 100%;
  padding-left: 4px;
`

const Message = styled.div<{ isError?: boolean }>`
  font-size: 13px;
  color: ${({ isError }) => (isError ? '#ff6666' : '#99ff99')};
  align-self: flex-start;
  margin-left: 5px;
`

const InputGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`

const ModalContainer = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ProfileImageWrapper = styled.label`
  position: relative;
  width: 180px;
  height: 180px;
  cursor: pointer;
  align-self: center;
`

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
`
const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  margin-top: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`

const CameraIconButton = styled.label`
  position: absolute;
  right: 8px;
  bottom: 8px;
  background-color: white;
  border-radius: 50%;
  padding: 6px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    width: 30px;
    height: 30px;
  }
`

const ProfileTextButton = styled.span`
  font-size: 14px;
  color: #ffa500;
  cursor: pointer;
  text-decoration: underline;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  &:hover {
    color: #ff8800;
  }

  @media (max-width: 768px) {
    position: static;
    transform: none;
    margin-top: 12px;
  }
`

const ModalButtonBox = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
`

const ModalSubmitButton = styled(BaseButton)`
  width: 100%; // or 원하는 값 예: 240px
  height: 48px;
  font-size: 16px;
`

const Modal = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => (
  <ModalBackground onClick={onClose}>
    <ModalContainer onClick={e => e.stopPropagation()}>{children}</ModalContainer>
  </ModalBackground>
)

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null)

  const [password, setPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null)

  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmMessage, setConfirmMessage] = useState('')
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean | null>(null)

  const [nickname, setNickname] = useState('')
  const [nicknameMessage, setNicknameMessage] = useState('')
  const [isNicknameValid, setIsNicknameValid] = useState<boolean | null>(null)

  const [showModal, setShowModal] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const navigate = useNavigate()

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)

  const handleSignUp = async () => {
    try {
      const payload = {
        email,
        password,
        checkedPassword: confirmPassword,
        nickname,
        profileImage: profileImageUrl ?? null,
      }

      const response = await signup(payload)
      console.log('회원가입 성공:', response)
      alert('회원가입이 완료되었습니다!')
      navigate('/login')
      // 이후 로그인 페이지 이동 등 처리
    } catch (error) {
      console.error('회원가입 실패:', error)
      // 사용자에게 알림 처리도 추가 가능
    }
  }

  const validateEmail = (value: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    setIsEmailValid(isValid)
    setEmailMessage(isValid ? '올바른 이메일 형식입니다.' : '이메일 형식이 올바르지 않습니다.')
  }

  const validatePassword = (value: string) => {
    const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      value,
    )
    setIsPasswordValid(isValid)
    setPasswordMessage(
      isValid
        ? '사용 가능한 비밀번호입니다.'
        : '영문 대/소문자 + 숫자 + 특수문자를 포함해 8자 이상 입력해주세요.',
    )
    validateConfirmPassword(confirmPassword, value)
  }

  const validateConfirmPassword = (value: string, basePassword = password) => {
    const isMatch = value !== '' && value === basePassword
    setIsPasswordMatch(isMatch)
    setConfirmMessage(isMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.')
  }

  const validateNickname = (value: string) => {
    const isValid = /^[a-zA-Z0-9가-힣]{2,20}$/.test(value)
    setIsNicknameValid(isValid)
    setNicknameMessage(
      isValid ? '사용 가능한 닉네임입니다.' : '2~20자의 한글/영문/숫자만 가능합니다.',
    )
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 로컬 미리보기
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)

    try {
      const url = await uploadImage(file)
      setProfileImageUrl(url)
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      alert('이미지 업로드에 실패했습니다.')
    }
  }

  return (
    <Wrapper>
      <FormBox>
        <InputGroup>
          <ResponsiveInput
            placeholder="이메일"
            type="email"
            value={email}
            onChange={e => {
              const value = e.target.value
              setEmail(value)
              validateEmail(value)
            }}
            inputSize="small"
          />
          {isEmailValid !== null && <Message isError={!isEmailValid}>{emailMessage}</Message>}
        </InputGroup>

        <InputGroup>
          <ResponsiveInput
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={e => {
              const value = e.target.value
              setPassword(value)
              validatePassword(value)
            }}
            inputSize="small"
          />
          {isPasswordValid !== null && (
            <Message isError={!isPasswordValid}>{passwordMessage}</Message>
          )}
        </InputGroup>

        <InputGroup>
          <ResponsiveInput
            placeholder="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={e => {
              const value = e.target.value
              setConfirmPassword(value)
              validateConfirmPassword(value)
            }}
            inputSize="small"
          />
          {isPasswordMatch !== null && (
            <Message isError={!isPasswordMatch}>{confirmMessage}</Message>
          )}
        </InputGroup>

        <InputGroup>
          <ResponsiveInput
            placeholder="닉네임"
            type="text"
            value={nickname}
            onChange={e => {
              const value = e.target.value
              setNickname(value)
              validateNickname(value)
            }}
            inputSize="small"
          />
          {isNicknameValid !== null && (
            <Message isError={!isNicknameValid}>{nicknameMessage}</Message>
          )}
        </InputGroup>

        <ButtonRow>
          <SubmitButton
            variant="dark"
            size="small"
            disabled={!isEmailValid || !isPasswordValid || !isPasswordMatch || !isNicknameValid}
            onClick={handleSignUp}
          >
            가입 해볼래?
          </SubmitButton>
          <ProfileTextButton onClick={() => setShowModal(true)}>
            프로필 이미지 설정
          </ProfileTextButton>
        </ButtonRow>

        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <h3>프로필 이미지 설정</h3>

            <ProfileImageWrapper>
              <ProfileImage src={imagePreview || profileImageDefault} alt="미리보기" />

              <CameraIconButton htmlFor="profileImageInput">
                <img src={cameraIcon} alt="카메라 아이콘" />
              </CameraIconButton>

              <input
                id="profileImageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </ProfileImageWrapper>
            <ModalButtonBox>
              <ModalSubmitButton variant="dark" onClick={() => setShowModal(false)}>
                완료
              </ModalSubmitButton>
            </ModalButtonBox>
          </Modal>
        )}
      </FormBox>
    </Wrapper>
  )
}

export default SignUp
