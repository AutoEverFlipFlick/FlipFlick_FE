import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import BaseInput from '@/components/common/BaseInput'
import BaseButton from '@/components/common/BaseButton'
import { updateNickname, updatePassword, updateProfileImage } from '@/services/updateMemberInfo'
import memberInfoService from '@/services/memberInfo'

interface IsMobile {
  $ismobile: boolean
}

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

const ContentWrapper = styled.div`
  width: 90%;
  max-width: 800px;
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0 auto;
`

const ImageUploadWrapper = styled.label<IsMobile>`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  margin-bottom: 10px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid transparent;
`

const PlusIcon = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #fff;
  color: #aaa;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 26px;
  font-size: 28px;
  font-weight: bold;
`

const HiddenInput = styled.input`
  display: none;
`

const FieldGroup = styled.div<IsMobile>`
  display: flex;
  flex-direction: column;
  width: ${props => (props.$ismobile ? '90%' : '85%')};
  align-self: center;
`

const Label = styled.label<IsMobile>`
  color: #ccc;
  font-size: ${props => (props.$ismobile ? '1.3rem' : '1.4rem')};
`

const InputBox = styled(BaseInput)<IsMobile>``

const Button = styled(BaseButton)<IsMobile>`
  margin-top: 10px;
  width: ${props => (props.$ismobile ? '90%' : '85%')};
  padding: 15px;
  align-self: center;
`

const WithdrawButton = styled.button<IsMobile>`
  background: none;
  border: none;
  color: #e50914;
  font-size: ${props => (props.$ismobile ? '0.9rem' : '1.1rem')};
  cursor: pointer;
  align-self: center;
`

const SlideDownWrapper = styled.div<{ visible: boolean }>`
  display: flex;
  justify-content: center;
  width: 100%;
  align-self: center;

  overflow: hidden;
  max-height: ${({ visible }) => (visible ? '200px' : '0')};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => (visible ? 'translateY(0)' : 'translateY(-10px)')};
  transition:
    max-height 0.2s ease,
    opacity 0.2s ease,
    transform 0.2s ease;
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
`

const MyPageEdit = () => {
  const [nickname, setNickname] = useState('')
  const [savedNickname, setSavedNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [isPasswordTyping, setIsPasswordTyping] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const nicknamePattern = /^.{2,20}$/
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  const isMobile = useMediaQuery({
    query: '(max-width:767px)',
  })

  useEffect(() => {
    const infoGet = async () => {
      const resUser = await memberInfoService.userInfoGet()
      console.log(resUser.data.data)
      setNickname(resUser.data.data.nickname)
      setSavedNickname(resUser.data.data.nickname)
      setProfileImageUrl(resUser.data.data.profileImage)
      console.log(resUser.data)
      console.log(resUser.data.data)
    }
    infoGet()
  }, [])

  const handleSaveChanges = async () => {
    const trimmedNickname = nickname.trim()
    // 1. 닉네임 유효성 검사
    if (!trimmedNickname) {
      alert('닉네임을 입력해주세요')
      return
    }
    if (!nicknamePattern.test(trimmedNickname)) {
      alert('닉네임은 2~20자 사이로 입력해주세요.')
      return
    }

    // 2. 비밀번호가 입력된 경우
    if (password.trim()) {
      if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.')
        return
      }

      if (!passwordPattern.test(password)) {
        alert('비밀번호는 영문 대소문자+숫자+특수문자 포함 8자 이상이어야 합니다.')
        return
      }
    }

    // 3. 업데이트 요청
    try {
      await updateNickname(trimmedNickname)
      console.log('닉네임 변경 성공')
    } catch (e) {
      console.error('닉네임 변경 실패', e)
      alert('닉네임 변경 실패')
    }

    if (password.trim()) {
      try {
        await updatePassword(password, confirmPassword)
        alert('비밀번호 변경 성공')
        setPassword('')
        setConfirmPassword('')
        setIsPasswordTyping(false)
      } catch (e: any) {
        const msg = e.response?.data?.message || '비밀번호 변경 실패'
        alert(msg)
      }
    }

    if (selectedFile) {
      const newImageUrl = await updateProfileImage(selectedFile)
      setProfileImageUrl(newImageUrl) // UI 갱신
      setSelectedFile(null)
      console.log('프로필 이미지 변경 성공')
    }

    alert('회원 정보가 성공적으로 저장되었습니다.')
  }

  return (
    <Container>
      <ContentWrapper>
        <ImageUploadWrapper htmlFor="profile-upload" $ismobile={isMobile}>
          <ProfileImage
            src={selectedFile ? URL.createObjectURL(selectedFile) : profileImageUrl}
            alt="프로필 이미지"
          />
          <PlusIcon>+</PlusIcon>
          <HiddenInput
            id="profile-upload"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </ImageUploadWrapper>

        <FieldGroup $ismobile={isMobile}>
          <Label $ismobile={isMobile} htmlFor="nickname">
            닉네임
          </Label>
          <InputBox
            $ismobile={isMobile}
            id="nickname"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            onBlur={() => {
              if (nickname.trim() === '') {
                setNickname(savedNickname) // ← 빈 값이면 기존 닉네임으로 복구
              }
            }}
            state="normal"
            inputSize="medium"
          />
        </FieldGroup>

        <FieldGroup $ismobile={isMobile}>
          <Label $ismobile={isMobile} htmlFor="password">
            비밀번호
          </Label>
          <InputBox
            $ismobile={isMobile}
            id="password"
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              setIsPasswordTyping(e.target.value.length > 0)
            }}
            state="normal"
            inputSize="medium"
          />
        </FieldGroup>

        <SlideDownWrapper visible={isPasswordTyping}>
          <FieldGroup $ismobile={isMobile}>
            <Label $ismobile={isMobile} htmlFor="confirm">
              비밀번호 확인
            </Label>
            <InputBox
              $ismobile={isMobile}
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              state="normal"
              inputSize="medium"
            />
          </FieldGroup>
        </SlideDownWrapper>

        <Button variant="orange" size="medium" $ismobile={isMobile} onClick={handleSaveChanges}>
          저장
        </Button>
        <WithdrawButton $ismobile={isMobile} onClick={() => alert('정말 탈퇴하시겠습니까?')}>
          회원 탈퇴
        </WithdrawButton>
      </ContentWrapper>
    </Container>
  )
}

export default MyPageEdit
