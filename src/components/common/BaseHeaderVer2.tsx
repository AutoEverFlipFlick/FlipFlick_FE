import styled, { css } from 'styled-components'
import BaseInput from './BaseInput'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import HomeIcon from '@/assets/category/home.webp'
import BolkiIcon from '@/assets/category/bolkinator.webp'
import Record from '@/assets/category/record.png'
import { Search } from 'lucide-react'
import AvatarIcon from '@/assets/icons/profile.png'
import useTokenObserver from '@/utils/auth/tokenObserver'
import { userInfoGet } from '@/services/memberInfo'
import { Icon } from '@iconify/react'
import { logout } from '@/services/member'
import media from '@/utils/breakpoints'

const DESIGN_WIDTH = 1536
const DESIGN_HEIGHT = 1024
import { getAlarms, markAlarmAsRead, subscribeToAlarmStream } from '@/services/alarm'
import BaseContainer from './BaseContainer'

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
  ${media.tablet`
    padding: 0 var(--search-padding-inline-mobile);
    height: 60px;
  `}
`
const LeftSection = styled.div`
  display: flex;
  color: white;
`
const SpecialSection = styled.div`
  display: flex;
  gap: 30px;
  margin-left: 20px;
  ${media.notebook`
    gap: 5px;
  `}
  ${media.tablet`
    gap: 15px;
    margin-left: 5px;
  `}
  ${media.mobile`
    gap: 15px;
    margin-left: 0px;
  `}
`
const LeftSpecialContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 48px;
  position: relative;
  z-index: 1;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1) translateY(-5px);
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
  }
`
const LeftSpecialImg = styled.img`
  user-select: none;
`
const LeftSpecialText = styled.div`
  margin-top: -7px;
  /* 말풍선 스타일 */
  padding: 2px 4px;
  background: rgba(255, 255, 255, 0.9);
  color: #000;
  font-size: 10px;
  line-height: 1;
  border-radius: 6px;
  white-space: nowrap;
`
const LogoContainer = styled.a`
  align-items: center;
  vertical-align: middle;
  display: inline-flex;
  z-index: 1;
  position: relative;
  /* &::before {
    content: '';
    position: absolute;
    box-sizing: border-box;
    right: -12px;
    left: -12px;
    top: 12px;
    bottom: 12px;
    cursor: pointer;
  } */
`
const Logo = styled.div`
  width: 100px;
  height: 42px;
  background-image: var(--logo-full-image);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;
  ${media.tablet`
    display: none;
  `}
  ${media.notebook`
    width: 80px;
  `}
`
const LogoSmall = styled.div`
  width: 50px;
  height: 32px;
  background-image: var(--logo-text);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;
  /* later : 모바일 화면일 때 block을 해줘야 한다 */
  display: none;
  cursor: pointer;
  ${media.tablet`
    display: block;
  `}
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
  ${media.tablet`
    padding: 0 var(--search-padding-inline-mobile);
  `}
`
const TopSection = styled.div<{ $isFocused?: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  z-index: 1;
  flex-direction: column;
  align-items: center;
  /* 조정해야할 부분 */
  /* later : 모바일 대응 필요 */
  height: 96px;
  /* background-color: rgb(255, 255, 255); */
  transform: translateY(-96px);
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
  /* later : 모바일 대응 필요 */
  ${({ $isFocused }) => {
    return css`
      ${$isFocused &&
      css`
        transform: scaleY(2.5);

        ${media.tablet`
          transform: scaleY(2.8);
        `}
      `}
    `
  }}
  // 반투명 배경을 위한 속성들
  background: rgba(19, 8, 3, 0.8);
  /* background: rgba(255, 255, 255, 0.04); */
  backdrop-filter: blur(8px);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  ${media.tablet`
    height: 60px;
  `}
`
const CateSection = styled.div<{ $isFocused?: boolean }>`
  width: 500px;
  /* later : 모바일 대응 */
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
  ${media.tablet`
    width: 200px;
    margin: 11px auto 24px;
  `}
`
const CateContainer = styled.div`
  margin-top: 8px;
  position: relative;
  display: grid;
  grid-template-columns: repeat(1, max-content);
  gap: 35px;
  justify-content: center;
`
const CateTextContainer = styled.div`
  height: 62px;
  padding-top: 50px;
  font-size: var(--font-size-2xl);
`
// const CateItemContainer = styled.a`
//   margin-bottom: 12px;
//   cursor: pointer;
//   outline: none;
//   display: flex;
//   align-items: center;
// `
// const CateIconContainer = styled.img`
//   height: 50px;
//   width: 36px;
// `
// const CateTextContainer = styled.span`
//   margin-left: 16px;
//   line-height: var(--line-height-tight);
//   font-weight: 600;
//   font-size: var(--font-size-sm);
// `
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
  text-align: center;
  ${({ $isFocused }) => {
    return css`
      ${$isFocused &&
      css`
        opacity: 1;
        pointer-events: all;
      `}
    `
  }};
  ${media.tablet`
    max-width: 450px;
  `}
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
  ${media.tablet`
    display: none;
  `}
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
  &:last-child {
    margin-right: 0;
  }
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
  ${media.tablet`
    height: 35px;
    width: 35px;
  `}
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

const TextAvatarContainer = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: #999;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
`

const AlarmDropdown = styled(BaseContainer)`
  position: absolute;
  top: 120%;
  right: -120px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
  min-width: 240px;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.25rem 0;

  /* ✅ 반응형 폭 조절 */
  width: 240px;
  max-width: calc(100vw - 20px); /* 화면 줄어들면 자동으로 안으로 밀림 */
  max-height: 300px;
  overflow-y: auto;
  padding: 0.25rem 0;

  &::-webkit-scrollbar {
    display: none;
  }
`

const AlarmItem = styled.div`
  padding: 0.75rem 1rem;
  color: #ccc;
  font-size: 0.8rem;
  white-space: normal;
  word-break: break-word;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
    color: white;
  }

  &:active {
    color: #ff7849;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #3a3a3a;
  }
`

const AlarmBadge = styled.div`
  position: absolute;
  top: -4px;
  right: 8px;
  background-color: red;
  color: white;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 50%;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const EmptyAlarmMessage = styled.div`
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  color: #999;
  text-align: center;
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
  // 모바일 대응
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767)
      setScale(window.innerHeight / DESIGN_HEIGHT)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 알람 열림
  const [isAlarmOpen, setIsAlarmOpen] = useState(false)
  const [alarms, setAlarms] = useState<any[]>([])
  const alarmRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('token 받아짐!!')
    console.log(token)
    if (!token) {
      setProfileSrc(AvatarIcon)
      return
    }
    const fetchProfileImage = async () => {
      try {
        const response = await userInfoGet()
        console.log(response)
        setIsLogin(true)
        setProfileName(response.data.data.nickname)
        if (response.data.data.profileImage) {
          setProfileSrc(response.data.data.profileImage)
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
      setIsFocused(false)
      // 검색 키워드로 이동
      navigate(`/totalsearch?query=${encodeURIComponent(searchContext)}&page=1`)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem('accessToken')
      setIsLogin(false)
      setProfileName('')
      setProfileSrc(AvatarIcon)
      setIsDropdownOpen(false)
      navigate('/')
    } catch (err) {
      console.error('로그아웃 실패:', err)
    }
  }

  const fetchAlarms = async () => {
    if (!userId) return
    try {
      const res = await getAlarms(userId)
      setAlarms(res)
    } catch (error) {
      console.error('알림 불러오기 실패:', error)
      setAlarms([])
    }
  }

  const handleRead = async (alarmId: number) => {
    await markAlarmAsRead(alarmId)
    setAlarms(prev => prev.filter(a => a.id !== alarmId))
  }

  useEffect(() => {
    if (userId) {
      fetchAlarms()
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return

    const es = subscribeToAlarmStream(userId, newAlarm => {
      setAlarms(prev => (prev.some(a => a.id === newAlarm.id) ? prev : [newAlarm, ...prev]))
    })

    return () => es.close()
  }, [userId])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 드롭다운이 열려 있고, 클릭한 대상이 드롭다운 내부나 프로필 박스가 아닐 경우
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        profileRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])
  }, [isDropdownOpen, isAlarmOpen])

  const toggleAlarm = () => {
    setIsAlarmOpen(prev => !prev)
    fetchAlarms()
  }

  return (
    <HeaderWrapper>
      <Wrapper>
        <LeftSection>
          {/* a 태그 */}
          <LogoContainer
            onClick={() => {
              navigate('/')
            }}
          >
            <Logo />
            <LogoSmall />
          </LogoContainer>
          <SpecialSection>
            <LeftSpecialContainer
              onClick={() => {
                navigate('bolkinator')
              }}
            >
              <LeftSpecialImg src={BolkiIcon} width={32} />
              <LeftSpecialText>볼키네이터</LeftSpecialText>
            </LeftSpecialContainer>
            <LeftSpecialContainer
              onClick={() => {
                navigate('playlist')
              }}
            >
              <LeftSpecialImg src={Record} width={45} />

              <LeftSpecialText>플레이리스트</LeftSpecialText>
            </LeftSpecialContainer>
          </SpecialSection>
        </LeftSection>
        {/* form 태그 */}
        <AbsoluteContainer>
          <TopSection $isFocused={isFocused}>
            <div>
              {/* 4번 항목 */}
              <CateSection $isFocused={isFocused}>
                <CateContainer>
                  {/* 피드백 반영 전부 삭제 */}
                  {/*<CateItemContainer>
                    <CateIconContainer src={HomeIcon} alt="" style={{ height: '45px' }} />
                    <CateTextContainer>홈</CateTextContainer>
                  </CateItemContainer>
                  <CateItemContainer>
                    <CateIconContainer src={BolkiIcon} alt="" />
                    <CateTextContainer>볼키네이터</CateTextContainer>
                  </CateItemContainer>
                  <CateItemContainer>
                    <CateIconContainer src="/logo.webp" alt="" />
                    <CateTextContainer>홈</CateTextContainer>
                  </CateItemContainer>*/}
                  {/* 빈박스 하나 넣음 */}
                  <CateTextContainer></CateTextContainer>
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
                  value={searchContext}
                  onChange={() => {}}
                  inputSize={isMobile ? 'small' : 'medium'}
                />
              </MiniSearchbarSection>
            </div>
          </TopSection>
          <BackgroundSection $isFocused={isFocused} />
        </AbsoluteContainer>
        <AnanymouseWrapper />
        <ProfileSection>
          {isMobile && (
            <Search
              style={{ marginRight: '10px' }}
              onClick={() => {
                setIsFocused(true)
                SearchbarInputRef.current?.focus()
              }}
            />
          )}
          {isLogin ? (
            <>
              <Icon
                icon="mdi:notifications"
                fontSize={isMobile ? '25px' : '30px'}
                style={{...(isMobile ? { marginRight: '10px' } : { marginRight: '15px' }),cursor: 'pointer',}}
                onClick={toggleAlarm}
              />
              {alarms.length > 0 && (
                  <AlarmBadge>{alarms.length > 99 ? '99+' : alarms.length}</AlarmBadge>
                )}
                {isAlarmOpen && (
                  <AlarmDropdown ref={alarmRef as React.RefObject<HTMLDivElement>} as="div">
                    {Array.isArray(alarms) && alarms.length === 0 && (
                      <EmptyAlarmMessage>알림이 없습니다</EmptyAlarmMessage>
                    )}
                    {Array.isArray(alarms) &&
                      alarms.map(alarm => (
                        <AlarmItem key={alarm.id} onClick={() => handleRead(alarm.id)}>
                          {alarm.content}
                        </AlarmItem>
                      ))}
                  </AlarmDropdown>
                )}
              <ProfileInnerBox ref={profileRef} onClick={() => setIsDropdownOpen(prev => !prev)}>
                {profileSrc === AvatarIcon ? (
                  <TextAvatarContainer>{profileName?.charAt(0) || '유'}</TextAvatarContainer>
                ) : (
                  <AvatarContainer src={profileSrc} alt="프로필" style={{ opacity: 1 }} />
                )}
                <p style={{ marginLeft: '5px' }}>{profileName}</p>

                {isDropdownOpen && (
                  <DropdownContainer ref={dropdownRef}>
                    <DropdownItem>프로필 수정</DropdownItem>
                    <DropdownItem onClick={handleLogout}>로그아웃</DropdownItem>
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
