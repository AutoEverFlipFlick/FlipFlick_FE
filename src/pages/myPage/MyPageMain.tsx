import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import zzanggu from './zzanggu.jpg'
import { useMediaQuery } from 'react-responsive'
import BaseContainer from '@/components/common/BaseContainer'
import settings from '@/assets/settings.svg'
import popcorn1 from '@/assets/popcorn/popcorn1.png'
import popcorn2 from '@/assets/popcorn/popcorn2.png'
import popcorn3 from '@/assets/popcorn/popcorn3.png'
import popcorn4 from '@/assets/popcorn/popcorn4.png'
import popcorn5 from '@/assets/popcorn/popcorn5.png'
import popcorn6 from '@/assets/popcorn/popcorn6.png'
import popcorn7 from '@/assets/popcorn/popcorn7.png'
import popcorn8 from '@/assets/popcorn/popcorn8.png'
import {
  userInfoGet,
  getUserById,
  checkFollowStatus,
  followUser,
  unfollowUser,
} from '@/services/memberInfo'

interface IsMobile {
  $ismobile: boolean
}

const Container = styled.div<IsMobile>`
  min-height: 100vh;
  padding: ${props => (props.$ismobile ? '0.9rem' : '2rem')};
`

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  overflow-x: hidden;
`

const Profile = styled.div<IsMobile>`
  /* text-align: center; */
  margin-top: 10px;
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: ${props => (props.$ismobile ? '0' : '5px')};
`

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  margin-left: 3%;
`

const ImageUploadWrapper = styled.label<IsMobile>`
  position: relative;
  /* display: inline-block; */
  width: ${props => (props.$ismobile ? '70px' : '100px')};
  height: ${props => (props.$ismobile ? '70px' : '100px')};
  margin-right: 1rem;
`

const UserImage = styled.img<IsMobile>`
  width: ${props => (props.$ismobile ? '70px' : '100px')};
  height: ${props => (props.$ismobile ? '70px' : '100px')};
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid transparent;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
`

const UserName = styled.div<IsMobile>`
  z-index: 1;
  color: #fff;
  font-weight: bold;
  font-size: ${props => (props.$ismobile ? '1rem' : '1.2rem')};
`

const FollowStats = styled.div<IsMobile>`
  display: flex;
  gap: 1rem;
  font-size: ${props => (props.$ismobile ? '0.6rem' : '0.9rem')};
  margin-top: 10px;
  color: #ccc;
  span {
    cursor: pointer;
  }
`

const FollowButton = styled.button<{ $ismobile: boolean; isFollowing: boolean }>`
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: ${props => (props.$ismobile ? '0.7rem' : '0.9rem')};
  margin-right: ${props => (props.$ismobile ? '5%' : '7%')};
  background-color: ${props => (props.isFollowing ? '#2d2d2d' : '#2563eb')};
  color: #fff;
`

const IconButton = styled.button<{ $ismobile: boolean }>`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #fff;
  margin-right: ${p => (p.$ismobile ? '1.5rem' : '2.5rem')}; // 모든 환경에서 16px 여백

  img {
    width: ${p => (p.$ismobile ? '24px' : '30px')};
    height: auto;
  }
`

const PopcornSection = styled.div<IsMobile>`
  position: relative;
  width: 90%;
  margin: ${props => (props.$ismobile ? '-0.9rem auto 0.9rem' : '0 auto 2rem')};
  display: flex;
  align-items: center;
`

const PopcornLabel = styled.div<IsMobile>`
  position: absolute;
  top: ${props => (props.$ismobile ? '-20px' : '-30px')};
  left: 0;
  color: #fff;
  font-size: ${props => (props.$ismobile ? '0.7rem' : '1rem')};
`

const BarBackground = styled.div`
  background: #444;
  height: 8px;
  border-radius: 4px;
  position: relative;
  flex: 1;
  margin-right: 8px;
`

const BarFill = styled.div<{ percent: number }>`
  background: #f5a623;
  height: 100%;
  width: ${({ percent }) => percent}%;
  border-radius: 4px;
  transition: width 0.3s;
`

const Marker = styled.div<{ percent: number } & IsMobile>`
  position: absolute;
  top: ${props => (props.$ismobile ? '-12px' : '-18px')};
  left: ${({ percent }) => percent}%;
  transform: translateX(-50%);
  font-size: 24px;
  line-height: 1;
`

const PopcornImg = styled.img<IsMobile>`
  width: ${props => (props.$ismobile ? '30px' : '40px')};
  height: auto;
  display: block;
`

const PercentLabel = styled.div<IsMobile>`
  color: #ccc;
  font-size: ${props => (props.$ismobile ? '14px' : '20px')};
  text-align: right;
  margin-bottom: 5px;
  margin-left: 10px;
  font-weight: 500;
`

const UserStatsWrapper = styled(BaseContainer)<IsMobile>`
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: ${props => (props.$ismobile ? '0 auto 1rem' : '0 auto 2rem')};
`

const StatItem = styled.div<{ active: boolean } & IsMobile>`
  flex: 1;
  padding: ${props => (props.$ismobile ? '0.8rem' : '1rem 0')};
  text-align: center;
  cursor: pointer;
`

const StatNumber = styled.div<IsMobile>`
  color: #fff;
  font-size: ${props => (props.$ismobile ? '1.1rem' : '1.2rem')};
  font-weight: 500;
`

const StatLabel = styled.div<IsMobile>`
  color: #ccc;
  font-size: ${props => (props.$ismobile ? '0.8rem' : '0.9rem')};
  margin-top: ${props => (props.$ismobile ? '2px' : '4px')};
`

const ContentSections = styled.div<IsMobile>`
  display: grid;
  grid-template-columns: ${props => (props.$ismobile ? '1fr' : '1fr 1fr')};
  gap: 1rem;
  width: 90%;
  margin: 0 auto 2rem;
`

const Section = styled(BaseContainer)`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 300px;
`

const SectionHeader = styled.div<IsMobile>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-size: ${props => (props.$ismobile ? '0.9rem' : '1rem')};
`

const CardList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  margin-right: 5px;
  margin-top: 5px;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 2px;
  }
`

const Card = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  margin-left: 5px;
`

const ReviewImage = styled.img`
  width: 60px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
`

const PlaylistImage = styled.img`
  width: 90px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
`

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #ccc;
  font-size: 0.9rem;
`

const Rating = styled.div`
  color: #fff;
  margin-bottom: 4px;
`

const Title = styled.span`
  color: #fff;
  margin-bottom: 2px;
`

const Subtitle = styled.span`
  color: #666;
  font-size: 0.8rem;
`

const SectionFull = styled(Section)`
  grid-column: 1 / -1;
  height: 25px;
`

function getPopcornIcon(percent: number) {
  if (percent <= 20) return popcorn1
  if (percent <= 30) return popcorn2
  if (percent <= 40) return popcorn3
  if (percent <= 50) return popcorn4
  if (percent <= 60) return popcorn5
  if (percent <= 70) return popcorn6
  if (percent <= 80) return popcorn7
  return popcorn8
}

type TabType = '찜했어요' | '좋아요' | '봤어요'

const MyPageMain = () => {
  const [nickname, setNickname] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const navigate = useNavigate()
  const [isFollowing, setIsFollowing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(true)
  const [profileOwnerId, setProfileOwnerId] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const searchParams = new URLSearchParams(location.search)
  const userIdParam = searchParams.get('id')

  const [followerCount, setFollowerCount] = useState<number>(0)
  const [followingCount, setFollowingCount] = useState<number>(0)
  const popcornPercent = 90

  const [activeTab, setActiveTab] = useState<TabType>('찜했어요')
  const stats: { num: number; label: TabType }[] = [
    { num: 32, label: '찜했어요' },
    { num: 20, label: '좋아요' },
    { num: 10, label: '봤어요' },
  ]
  const reviews = Array(10).fill({ image: zzanggu, rating: 4.5, text: '정말 귀여워요~!' })
  const playlists = Array(10).fill({
    image: zzanggu,
    title: '플리1',
    subtitle: '짱구123 · 작품 10',
  })

  const goPreference = (tab: '찜했어요' | '좋아요' | '봤어요') => {
    setActiveTab(tab)
    navigate('/my-page-preference', { state: { tab } })
  }

  const goFollow = (tab: '팔로워' | '팔로잉') => {
    navigate(`/my-page-follow?id=${profileOwnerId}`, { state: { tab } })
  }

  const handleFollowToggle = async () => {
    if (!profileOwnerId) return

    try {
      if (isFollowing) {
        await unfollowUser(profileOwnerId)
        setIsFollowing(false)
        setFollowerCount(prev => prev - 1)
      } else {
        await followUser(profileOwnerId)
        setIsFollowing(true)
        setFollowerCount(prev => prev + 1)
      }
    } catch (e) {
      console.error('팔로우/언팔로우 실패:', e)
    }
  }

  useEffect(() => {
    const infoGet = async () => {
      try {
        const myInfo = await userInfoGet()
        setIsLoggedIn(true)

        if (userIdParam && userIdParam !== String(myInfo.data.data.id) && !isLoggedIn) {
          // 다른 사용자 프로필
          setIsOwnProfile(false)
          const otherRes = await getUserById(userIdParam)

          const otherUserId = otherRes.data.data.id
          setProfileOwnerId(otherUserId)
          setNickname(otherRes.data.data.nickname)
          setProfileImageUrl(otherRes.data.data.profileImage)
          setFollowerCount(otherRes.data.data.followerCount)
          setFollowingCount(otherRes.data.data.followingCount)

          // 로그인된 경우에만 팔로우 여부 체크
          const isFollowing = await checkFollowStatus(otherUserId)
          setIsFollowing(isFollowing)
        } else {
          // 내 프로필
          setIsOwnProfile(true)
          setProfileOwnerId(myInfo.data.data.id)
          setNickname(myInfo.data.data.nickname)
          setProfileImageUrl(myInfo.data.data.profileImage)
          setFollowerCount(myInfo.data.data.followerCount)
          setFollowingCount(myInfo.data.data.followingCount)
        }
      } catch (e) {
        console.error('로그인하지 않은 사용자')
        setIsLoggedIn(false)

        // 로그인 안 한 상태에서도 상대 프로필은 불러오기
        if (userIdParam) {
          try {
            setIsOwnProfile(false)
            const otherRes = await getUserById(userIdParam)
            setProfileOwnerId(otherRes.data.data.id)
            setNickname(otherRes.data.data.nickname)
            setProfileImageUrl(otherRes.data.data.profileImage)
            setFollowerCount(otherRes.data.data.followerCount)
            setFollowingCount(otherRes.data.data.followingCount)
          } catch (error) {
            console.error('프로필 정보 불러오기 실패:', error)
          }
        }
      }
    }

    infoGet()
  }, [userIdParam])

  return (
    <Container $ismobile={isMobile}>
      <ContentWrapper>
        <Profile $ismobile={isMobile}>
          <LeftGroup>
            <ImageUploadWrapper $ismobile={isMobile}>
              {profileImageUrl && (
                <UserImage
                  $ismobile={isMobile}
                  src={selectedFile ? URL.createObjectURL(selectedFile) : profileImageUrl}
                  alt="프로필 이미지"
                />
              )}
            </ImageUploadWrapper>
            <UserInfo>
              <UserName $ismobile={isMobile}>{nickname}</UserName>
              <FollowStats $ismobile={isMobile}>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => goFollow('팔로워')}
                  onKeyDown={() => {}}
                >
                  팔로워 {followerCount}명
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => goFollow('팔로잉')}
                  onKeyDown={() => {}}
                >
                  팔로잉 {followingCount}명
                </span>
              </FollowStats>
            </UserInfo>
          </LeftGroup>
          {isOwnProfile
            ? isLoggedIn && (
                /* 내 프로필일 때 설정 아이콘 */
                <IconButton $ismobile={isMobile} onClick={() => navigate('/my-page-edit')}>
                  <img src={settings} alt="설정" />
                </IconButton>
              )
            : isLoggedIn && (
                /* 남 프로필일 때 팔로우/언팔로우 버튼 */
                <FollowButton
                  $ismobile={isMobile}
                  isFollowing={isFollowing}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? '팔로잉' : '팔로우'}
                </FollowButton>
              )}
        </Profile>
        <PopcornSection $ismobile={isMobile}>
          <BarBackground>
            <PopcornLabel $ismobile={isMobile}>팝콘 지수</PopcornLabel>
            <BarFill percent={popcornPercent} />
            <Marker $ismobile={isMobile} percent={popcornPercent}>
              <PopcornImg
                $ismobile={isMobile}
                src={getPopcornIcon(popcornPercent)}
                alt={`팝콘 ${popcornPercent}%`}
              />
            </Marker>
          </BarBackground>
          <PercentLabel $ismobile={isMobile}>{popcornPercent}</PercentLabel>
        </PopcornSection>
        <UserStatsWrapper $ismobile={isMobile}>
          {stats.map(s => (
            <StatItem
              $ismobile={isMobile}
              key={s.label}
              active={activeTab === s.label}
              onClick={() => {
                goPreference(s.label)
              }}
            >
              <StatNumber $ismobile={isMobile}>{s.num}</StatNumber>
              <StatLabel $ismobile={isMobile}>{s.label}</StatLabel>
            </StatItem>
          ))}
        </UserStatsWrapper>
        <ContentSections $ismobile={isMobile}>
          <Section>
            <SectionHeader $ismobile={isMobile} onClick={() => navigate('/my-page-review')}>
              <span>작성한 리뷰</span>
              <span>17</span>
            </SectionHeader>
            <CardList>
              {reviews.map((r, i) => (
                <Card key={i}>
                  <ReviewImage src={r.image} alt="리뷰 포스터" />
                  <CardInfo>
                    <Rating>★ {r.rating}</Rating>
                    <div>{r.text}</div>
                  </CardInfo>
                </Card>
              ))}
            </CardList>
          </Section>

          <Section>
            <SectionHeader $ismobile={isMobile} onClick={() => navigate('/my-page-review')}>
              <span>플레이리스트</span>
              <span>17</span>
            </SectionHeader>
            <CardList>
              {playlists.map((p, i) => (
                <Card key={i}>
                  <PlaylistImage src={p.image} alt="플리 썸네일" />
                  <CardInfo>
                    <Title>{p.title}</Title>
                    <Subtitle>{p.subtitle}</Subtitle>
                  </CardInfo>
                </Card>
              ))}
            </CardList>
          </Section>
          <SectionFull>
            <SectionHeader $ismobile={isMobile} onClick={() => navigate('/my-page-debate')}>
              <span>토론 글</span>
              <span>17</span>
            </SectionHeader>
          </SectionFull>
        </ContentSections>
      </ContentWrapper>
    </Container>
  )
}

export default MyPageMain
