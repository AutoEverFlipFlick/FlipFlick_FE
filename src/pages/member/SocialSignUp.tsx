import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import backgroundImage from '@/assets/common/background.webp'
import BaseInput from '@/components/common/BaseInput'
import BaseButton from '@/components/common/BaseButton'
import profileImageDefault from '@/assets/icons/profile.png'
import cameraIcon from '@/assets/icons/camera.png'
import { checkNicknameDuplicate, updateSocialInfo } from '@/services/member'
import { uploadImage, deleteImage } from '@/services/s3'
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
    width: 60%;
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
  align-self: flex-end;
  margin-left: 5px;
`

const InputGroup = styled.div`
  margin-top: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
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

const SocialSignUp: React.FC = () => {
  const [nickname, setNickname] = useState('')
  const [nicknameMessage, setNicknameMessage] = useState('')
  const [isNicknameValid, setIsNicknameValid] = useState<boolean | null>(null)
  const [isNicknameChecked, setIsNicknameChecked] = useState(false)

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const socialType = sessionStorage.getItem('socialType')
    if (!socialType) {
      alert('잘못된 접근입니다.')
      navigate('/login')
    }
  }, [])

  const validateNickname = (value: string) => {
    const isValid = /^[a-zA-Z0-9가-힣]{2,20}$/.test(value)
    setIsNicknameValid(isValid)
    setNicknameMessage(
      isValid ? '중복 검사가 필요합니다.' : '2~20자의 한글/영문/숫자만 가능합니다.',
    )
  }

  const handleNicknameCheck = async () => {
    try {
      const result = await checkNicknameDuplicate(nickname)
      if (result.data === true) {
        setNicknameMessage('이미 사용 중인 닉네임입니다.')
        setIsNicknameValid(false)
        setIsNicknameChecked(false)
      } else {
        setNicknameMessage('사용 가능한 닉네임입니다.')
        setIsNicknameValid(true)
        setIsNicknameChecked(true)
      }
    } catch (e) {
      console.error('닉네임 중복 검사 실패', e)
      setNicknameMessage('닉네임 중복 검사 중 오류가 발생했습니다.')
      setIsNicknameValid(false)
      setIsNicknameChecked(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)

    try {
      if (profileImageUrl) {
        await deleteImage(profileImageUrl)
      }
      const url = await uploadImage(file)
      setProfileImageUrl(url)
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      alert('이미지 업로드에 실패했습니다.')
    }
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        nickname,
        profileImage: profileImageUrl,
      }
      await updateSocialInfo(payload)

      navigate('/')
    } catch (error) {
      console.error('설정 실패:', error)
      alert('닉네임 설정 실패')
    }
  }

  return (
    <Wrapper>
      <FormBox>
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

        <InputGroup>
          <ResponsiveInput
            placeholder="닉네임"
            type="text"
            value={nickname}
            onChange={e => {
              const value = e.target.value
              setNickname(value)
              validateNickname(value)
              setIsNicknameChecked(false)
            }}
            onBlur={() => {
              if (nickname && /^[a-zA-Z0-9가-힣]{2,20}$/.test(nickname)) {
                handleNicknameCheck()
              }
            }}
            inputSize="small"
          />
          {isNicknameValid !== null && (
            <Message isError={!isNicknameChecked || !isNicknameValid}>{nicknameMessage}</Message>
          )}
        </InputGroup>

        <SubmitButton
          variant="dark"
          size="small"
          disabled={!isNicknameChecked || !isNicknameValid}
          onClick={handleSubmit}
        >
          시작 해볼래?
        </SubmitButton>
      </FormBox>
    </Wrapper>
  )
}

export default SocialSignUp
