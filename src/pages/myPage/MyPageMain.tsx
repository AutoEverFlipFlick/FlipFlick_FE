import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
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
  getPopcornScore,
  getUserPopcornScore,
} from '@/services/memberInfo'

import { getBookmarkCount, getWatchedCount, getLikeCount } from '@/services/moviePreference'
import { getMyPlaylists, getPlaylistsByNickname } from '@/services/playlist'
import { getUserReviewsLatest, getUserDebatesBySort } from '@/services/memberPost'
import { useAuth } from '@/context/AuthContext'
import { Star } from 'lucide-react'

interface IsMobile {
  $ismobile: boolean
}

const Container = styled.div<IsMobile>`
  overflow-x: hidden;
`

const ContentWrapper = styled.div<IsMobile>`
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
const Avatar = styled.div<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  background: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ size }) => size / 2.5}px;
  color: #fff;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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

const BarFill = styled.div<{ percent: number; $mounted: boolean }>`
  background: #f5a623;
  height: 100%;
  width: ${({ percent, $mounted }) => ($mounted ? `${percent}%` : '0%')};
  border-radius: 4px;
  transition: width 1.4s ease-out;
`

const Marker = styled.div<{ percent: number; $mounted: boolean } & IsMobile>`
  position: absolute;
  top: ${props => (props.$ismobile ? '-12px' : '-18px')};
  left: ${({ percent, $mounted }) => ($mounted ? `${percent}%` : '0%')};
  transform: translateX(-50%);
  font-size: 24px;
  line-height: 1;
  transition: left 1.4s ease-out;
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
  overflow: hidden;
`

const SectionHeader = styled.div<IsMobile>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  margin-bottom: 0.5rem;
  font-size: ${props => (props.$ismobile ? '0.9rem' : '1rem')};
`

const CardList = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
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
  cursor: pointer;
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
  max-width: 100%;
`

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #ccc;
  font-size: 0.9rem;
  overflow: hidden;
`

const Rating = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  margin-bottom: 4px;
  font-size: 0.8rem;

  svg {
    margin-right: 4px;
  }
`

const ReviewContent = styled.div`
  font-size: 0.8rem;
  color: #ccc;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 1.2em;
  max-height: 1.2em;
`

const Title = styled.span`
  color: #fff;
  margin-bottom: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
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

// 리뷰 아이템 타입
type reviewArray = {
  reviewId: number
  movieTitle: string
  posterImg: string
  star: number
  content: string
}

// 플레이리스트 아이템 타입
type playlistArray = {
  playListId: number
  title: string
  thumbnailUrl: string
  nickname: string
  movieCount: number
}

const MyPageMain: React.FC = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  // const { user } = useAuth()
  const [nickname, setNickname] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const navigate = useNavigate()
  const [isFollowing, setIsFollowing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(true)
  const [profileOwnerId, setProfileOwnerId] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const searchParams = new URLSearchParams(location.search)
  const userIdParam = searchParams.get('id')
  const [barMounted, setBarMounted] = useState(false)
  const [followerCount, setFollowerCount] = useState<number>(0)
  const [followingCount, setFollowingCount] = useState<number>(0)
  const [popcornPercent, setPopcornPercent] = useState(0)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [watchedCount, setWatchedCount] = useState(0)
  const [likeCount, setLikeCount] = useState(0)
  const [userReviews, setUserReviews] = useState<reviewArray[]>([])
  const [reviewTotalCount, setReviewTotalCount] = useState<number>(0)
  const [playlists, setPlaylists] = useState<playlistArray[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('찜했어요')
  const [debateTotalCount, setDebateTotalCount] = useState<number>(0)
  const stats: { num: number; label: TabType }[] = [
    { num: bookmarkCount, label: '찜했어요' },
    { num: likeCount, label: '좋아요' },
    { num: watchedCount, label: '봤어요' },
  ]

  const goPreference = (tab: TabType) => {
    navigate('/my-page-preference', { state: { tab, ownerId: profileOwnerId } })
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
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const infoGet = async () => {
      try {
        const myInfo = await userInfoGet()
        setIsLoggedIn(true)

        if (userIdParam && userIdParam !== String(myInfo.data.data.id)) {
          // 다른 사용자 프로필
          setIsOwnProfile(false)
          const otherRes = await getUserById(userIdParam)
          const otherUser = otherRes.data.data
          setProfileOwnerId(otherUser.id)
          setNickname(otherUser.nickname)
          setProfileImageUrl(otherUser.profileImage)
          setFollowerCount(otherUser.followerCount)
          setFollowingCount(otherUser.followingCount)

          // 로그인된 경우에만 팔로우 여부 체크
          const isFollowing = await checkFollowStatus(otherUser.id)
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
        // console.error('로그인하지 않은 사용자')
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
      setIsLoading(false) // 데이터 다 불러온 뒤 표시
    }

    infoGet()
  }, [userIdParam])

  // 좋아요, 찜, 봤어요 개수
  useEffect(() => {
    if (!profileOwnerId) return
    const id = profileOwnerId

    getBookmarkCount(id).then(res => {
      setBookmarkCount(res.data.data.totalElements)
    })
    getWatchedCount(id).then(res => {
      setWatchedCount(res.data.data.totalElements)
    })
    getLikeCount(id).then(res => {
      setLikeCount(res.data.data.totalElements)
    })
  }, [profileOwnerId])

  // 리뷰
  useEffect(() => {
    const fetchReviews = async () => {
      if (!nickname) return
      try {
        const res = await getUserReviewsLatest(nickname)
        const content = res.data.data.reviews
        setUserReviews(content)
        setReviewTotalCount(res.data.data.totalElements)
      } catch (err) {
        console.error('리뷰 목록 불러오기 실패:', err)
      }
    }

    fetchReviews()
  }, [nickname])

  // 플레이리스트
  useEffect(() => {
    setBarMounted(true)
    if (profileOwnerId === null) return

    const fetchPlaylists = async () => {
      try {
        let res
        if (isOwnProfile) {
          res = await getMyPlaylists()
        } else {
          res = await getPlaylistsByNickname(nickname)
        }
        setPlaylists(res.data.content)
      } catch (err) {
        console.error('플레이리스트 불러오기 실패', err)
      }
    }

    fetchPlaylists()
  }, [profileOwnerId, isOwnProfile, nickname])

  // 팝콘 지수
  useEffect(() => {
    if (profileOwnerId === null) return

    const fetchPopcornScore = async () => {
      try {
        let res
        if (isOwnProfile) {
          res = await getPopcornScore()
        } else {
          res = await getUserPopcornScore(profileOwnerId)
        }
        setPopcornPercent(res.popcornScore)
      } catch (err) {
        console.error('팝콘지수 불러오기 실패:', err)
      }
    }

    fetchPopcornScore()
  }, [profileOwnerId, isOwnProfile])

  useEffect(() => {
    if (!nickname) return

    const fetchDebateCount = async () => {
      try {
        const res = await getUserDebatesBySort(nickname, 0, 1, 'latest') // page=0, size=1만 불러와도 totalElements 확인 가능
        setDebateTotalCount(res.data.data.totalElements)
      } catch (err) {
        console.error('토론 글 수 불러오기 실패:', err)
      }
    }

    fetchDebateCount()
  }, [nickname])

  if (!isMounted || isLoading) {
    return null
  }

  return (
    <Container $ismobile={isMobile}>
      {isLoading ? null : (
        <>
          <div></div>
          <ContentWrapper $ismobile={isMobile}>
            <Profile $ismobile={isMobile}>
              <LeftGroup>
                <ImageUploadWrapper $ismobile={isMobile}>
                  {profileImageUrl && profileImageUrl !== 'null' && profileImageUrl !== 'string' ? (
                    <UserImage $ismobile={isMobile} src={profileImageUrl} alt="프로필 이미지" />
                  ) : (
                    <Avatar size={isMobile ? 70 : 100}>
                      {nickname ? nickname.charAt(0) : '?'}
                    </Avatar>
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
                <BarFill percent={popcornPercent} $mounted={barMounted} />
                <Marker $ismobile={isMobile} percent={popcornPercent} $mounted={barMounted}>
                  <PopcornImg
                    $ismobile={isMobile}
                    src={getPopcornIcon(popcornPercent)}
                    alt={`팝콘 ${popcornPercent}%`}
                  />
                </Marker>
              </BarBackground>
              <PercentLabel $ismobile={isMobile}>{barMounted ? popcornPercent : 0}</PercentLabel>
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
                <SectionHeader
                  $ismobile={isMobile}
                  onClick={() => navigate('/my-page-review', { state: { nickname } })}
                  style={{ cursor: 'pointer' }}
                >
                  <span>작성한 리뷰</span>
                  <span>{reviewTotalCount}</span>
                </SectionHeader>
                <CardList>
                  {userReviews.map(review => (
                    <Card key={review.reviewId} onClick={() => navigate(`/movie/detail`)}>
                      <ReviewImage
                        src={`https://image.tmdb.org/t/p/w500${review.posterImg}`}
                        alt="리뷰 포스터"
                      />
                      <CardInfo>
                        <Title>{review.movieTitle}</Title>
                        <Rating>
                          <Star fill="yellow" stroke="#yellow" size={18} />
                          <span>{review.star}</span>
                        </Rating>
                        <ReviewContent>{review.content}</ReviewContent>
                      </CardInfo>
                    </Card>
                  ))}
                </CardList>
              </Section>

              <Section>
                <SectionHeader $ismobile={isMobile}>
                  <span>플레이리스트</span>
                  <span>{playlists.length}</span>
                </SectionHeader>
                <CardList>
                  {playlists.map(p => (
                    <Card
                      key={p.playListId}
                      onClick={() =>
                        navigate(`/playlist/${p.playListId}${`?id=${profileOwnerId}`}`)
                      }
                    >
                      <PlaylistImage src={p.thumbnailUrl} alt={p.title} />
                      <CardInfo>
                        <Title>{p.title}</Title>
                        <Subtitle>
                          {p.nickname} · 작품 {p.movieCount}
                        </Subtitle>
                      </CardInfo>
                    </Card>
                  ))}
                </CardList>
              </Section>
              <SectionFull>
                <SectionHeader
                  $ismobile={isMobile}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/my-page-debate', { state: { nickname } })}
                >
                  <span>토론 글</span>
                  <span>{debateTotalCount}</span>
                </SectionHeader>
              </SectionFull>
            </ContentSections>
          </ContentWrapper>
        </>
      )}
    </Container>
  )
}

export default MyPageMain
