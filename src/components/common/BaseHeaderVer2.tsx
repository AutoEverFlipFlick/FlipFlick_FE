import styled, { css } from 'styled-components'
import BaseInput from './BaseInput'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import HomeIcon from '@/assets/category/home.webp'
import BolkiIcon from '@/assets/category/bolkinator.webp'
import { Search } from 'lucide-react'
import AvatarIcon from '@/assets/icons/profile.png'
import useTokenObserver from '@/utils/auth/tokenObserver'
import { userInfo } from '@/services/member'
import { Icon } from '@iconify/react'

const HeaderWrapper = styled.div`
  z-index: 10;
  position: sticky;
  top: 0;
  width: 100%;
`

const Wrapper = styled.header`
  /* 1) 래퍼 자체를 border-box로 지정 */
  box-sizing: border-box;

  /* 2) 자손 · 의사요소까지 상속(inherit)하도록 강제 */
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  display: flex;
  position: relative;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;

  padding: 0 var(--search-padding-inline);

  /* 전제 height 여기서 조정 */
  height: 80px;
  max-width: 1920px;
`

const LogoContainer = styled.a`
  align-items: center;
  vertical-align: middle;
  display: inline-flex;
  z-index: 1;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    box-sizing: border-box;

    right: -12px;
    left: -12px;
    top: 12px;
    bottom: 12px;
    cursor: pointer;
  }
`
const Logo = styled.div`
  width: 120px;
  height: 42px;
  background-image: var(--logo-full-image);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;
`

const LogoSmall = styled.div`
  background-image: var(--logo-text);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;

  /* later : 모바일 화면일 때 block을 해줘야 한다 */
  display: none;
  cursor: pointer;
`

const AbsoluteContainer = styled.form`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;

  box-sizing: border-box;
  padding-inline: var(--search-padding-inline);
`

const TopSection = styled.div<{ $isFocused?: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  z-index: 1;
  flex-direction: column;
  align-items: center;

  /* 조정해야할 부분 */
  height: 96px;
  /* background-color: rgb(255, 255, 255); */
  transform: translateY(-95px);

  transition: transform var(--search-transition-duration-fast) var(--search-trasitioin-easing-fast);

  ${({ $isFocused }) => {
    return css`
      ${$isFocused &&
      css`
        transform: none;
      `}
    `
  }}
`

const BackgroundSection = styled.div<{ $isFocused?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;

  transform: scaleY(1);

  transition: transform var(--search-transition-duration-fast) var(--search-trasitioin-easing-fast);
  transform-origin: top;

  ${({ $isFocused }) => {
    return css`
      ${$isFocused &&
      css`
        transform: scaleY(2.5);
      `}
    `
  }}

  // 반투명 배경을 위한 속성들
  background: rgba(19, 8, 3, 0.9);
  /* background: rgba(255, 255, 255, 0.04); */
  backdrop-filter: blur(8px);

  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`

const CateSection = styled.div<{ $isFocused?: boolean }>`
  width: 500px;
  /* later : 이 값을 수정해야 할지도 */
  margin: 22px auto 24px;
  opacity: 0;

  transition: opacity 0.175s var(--search-trasition-curve);
  will-change: opacity;

  ${({ $isFocused }) => {
    return css`
      ${$isFocused &&
      css`
        opacity: 1;
      `}
    `
  }}
`
const CateContainer = styled.div`
  margin-top: 8px;
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 35px;
  justify-content: center;
`

const CateItemContainer = styled.a`
  margin-bottom: 12px;
  cursor: pointer;
  outline: none;
  display: flex;

  align-items: center;
`

const CateIconContainer = styled.img`
  height: 50px;
  width: 36px;
`

const CateTextContainer = styled.span`
  margin-left: 16px;
  line-height: var(--line-height-tight);
  font-weight: 600;
  font-size: var(--font-size-sm);
`

// 서치바가 커질 때의 크기를 정의하고 있음
const SearchbarSection = styled.div<{ $isFocused?: boolean }>`
  display: flex;
  position: absolute;
  width: 100%;
  /* 여기가 크기 지정 */
  max-width: 850px;
  height: 66px;
  align-items: center;
  justify-content: space-between;
  /* 중앙에 배치 */
  left: 50%;

  transform: translateX(-50%);
  opacity: 0;

  pointer-events: none;

  ${({ $isFocused }) => {
    return css`
      ${$isFocused &&
      css`
        opacity: 1;
        pointer-events: all;
      `}
    `
  }};
`

// const ActualSearchbar = styled(BaseInput)`
//   transform: scale(0.55);
// `

const MiniSearchbarSection = styled.div<{ $isFocused?: boolean }>`
  position: absolute;
  display: inline-flex;
  max-width: 100%;
  justify-content: center;
  align-items: center;
  left: 50%;
  transform: translateX(-50%);
  opacity: 1;
  transition: opacity 0.075s var(--search-trasition-curve);
  ${({ $isFocused }) => {
    return css`
      ${$isFocused &&
      css`
        opacity: 0;
      `}
    `
  }};
`

const ActualMiniSearchbar = styled(BaseInput)``

const AnanymouseWrapper = styled.div`
  position: fixed;
  opacity: 0;
  pointer-events: none;

  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -2;
`

const ProfileSection = styled.nav`
  position: relative;
  display: flex;
  height: 80px;
  align-items: center;
  justify-content: flex-end;
  color: whites;
`
const ProfileInnerBox = styled.div`
  display: flex;
  flex: auto;
  gap: 5px;
  align-items: center;
  justify-content: flex-end;
  margin-right: 12px;

  cursor: pointer;
`

const LoginButton = styled.button`
  padding: 11px 12px;
  outline: none;
  background: transparent;
  color: var(--text-white);
  box-shadow: none;
  appearance: none;
  /* OS/브라우저 기본 버튼 스타일 제거 */
  -webkit-appearance: none; /* 사파리·크롬용 */
  -moz-appearance: none; /* 파이어폭스용 */

  border: none;

  cursor: pointer;
`

const AvatarContainer = styled.img`
  height: 40px;
  width: 40px;

  opacity: 0.3;
`

// 드롭다운 컨테이너
const DropdownContainer = styled.div`
  position: absolute;
  top: 80%;
  right: 10;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  margin-top: 8px;
  z-index: 10;
  color: black;
`

// 드롭다운 아이템
const DropdownItem = styled.div`
  padding: 8px 12px;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`

const BaseHeaderVer2 = () => {
  const navigate = useNavigate()

  const [searchContext, setSearchContext] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // 토큰 변화 구독
  const token = useTokenObserver()
  const [profileSrc, setProfileSrc] = useState(AvatarIcon)
  const [profileName, setProfileName] = useState('')
  const [isLogin, setIsLogin] = useState(false)

  // 드롭다운 열림 여부
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!token) {
      setProfileSrc(AvatarIcon)
      return
    }

    const fetchProfileImage = async () => {
      try {
        const response = await userInfo()
        console.log(response)
        setIsLogin(true)
        setProfileName(response.data.nickname)
        if (response.profileImage) {
          setProfileSrc(response.data.profileImage)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchProfileImage()
  }, [token])

  const SearchbarInputRef = useRef<HTMLInputElement>(null)

  const handleInputFocused = () => {
    console.log('Focused')
    setIsFocused(true)
    SearchbarInputRef.current?.focus()
  }

  const handleInputBlured = () => {
    console.log('Blured')
  }

  const handleSearbarInputBlured = () => {
    setIsFocused(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 검색 키워드로 이동
      navigate(`/totalsearch?query=${encodeURIComponent(searchContext)}&page=1`)
    }
  }

  return (
    <HeaderWrapper>
      <Wrapper>
        {/* a 태그 */}
        <LogoContainer
          onClick={() => {
            navigate('/')
          }}
        >
          <Logo />
          <LogoSmall />
        </LogoContainer>

        {/* form 태그 */}
        <AbsoluteContainer>
          <TopSection $isFocused={isFocused}>
            <div>
              {/* 4번 항목 */}
              <CateSection $isFocused={isFocused}>
                <CateContainer>
                  <CateItemContainer>
                    <CateIconContainer src={HomeIcon} alt="" style={{ height: '45px' }} />
                    <CateTextContainer>홈</CateTextContainer>
                  </CateItemContainer>
                  <CateItemContainer>
                    <CateIconContainer src={BolkiIcon} alt="" />
                    <CateTextContainer>볼키네이터</CateTextContainer>
                  </CateItemContainer>
                  {/* <CateItemContainer>
                    <CateIconContainer src="/logo.webp" alt="" />
                    <CateTextContainer>홈</CateTextContainer>
                  </CateItemContainer> */}
                </CateContainer>
              </CateSection>
              {/* 5번 항목 */}
              <SearchbarSection $isFocused={isFocused}>
                <BaseInput
                  ref={SearchbarInputRef}
                  fullWidth
                  baseContainerStyle={isFocused ? {} : { style: { transform: 'Scale(0.55)' } }}
                  onBlur={handleSearbarInputBlured}
                  icon={<Search />}
                  enterKeyHint="search"
                  onChange={e => setSearchContext(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </SearchbarSection>
              <MiniSearchbarSection $isFocused={isFocused}>
                <ActualMiniSearchbar
                  onFocus={handleInputFocused}
                  onBlur={handleInputBlured}
                  icon={<Search />}
                />
              </MiniSearchbarSection>
            </div>
          </TopSection>
          <BackgroundSection $isFocused={isFocused} />
        </AbsoluteContainer>

        <AnanymouseWrapper />

        <ProfileSection>
          {isLogin ? (
            <>
              <Icon icon="mdi:notifications" fontSize={'30px'} style={{ marginRight: '15px' }} />
              <ProfileInnerBox ref={profileRef} onClick={() => setIsDropdownOpen(prev => !prev)}>
                {/* 로그인 시 아바타 완전 불투명 */}
                <p style={{ marginRight: '5px' }}>{profileName}</p>
                <AvatarContainer src={profileSrc} alt="프로필" style={{ opacity: 1 }} />

                {/* 드롭다운 메뉴 */}
                {isDropdownOpen && (
                  <DropdownContainer ref={dropdownRef}>
                    <DropdownItem>프로필 수정</DropdownItem>
                    <DropdownItem>로그아웃</DropdownItem>
                  </DropdownContainer>
                )}
              </ProfileInnerBox>
            </>
          ) : (
            <ProfileInnerBox onClick={() => navigate('/login')}>
              <LoginButton>로그인</LoginButton>
              <AvatarContainer src={profileSrc} alt="게스트" style={{ opacity: 0.3 }} />
            </ProfileInnerBox>
          )}
        </ProfileSection>
      </Wrapper>
    </HeaderWrapper>
  )
}
export default BaseHeaderVer2
