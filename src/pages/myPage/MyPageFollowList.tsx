import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import {
  userInfoGet,
  getFollowersById,
  getFollowingsById,
  followUser,
  unfollowUser,
  checkFollowStatus,
} from '@/services/memberInfo'

interface IsMobile {
  $ismobile: boolean
}

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
`

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  overflow-x: hidden;
`

const Title = styled.h2<IsMobile>`
  font-size: ${props => (props.$ismobile ? '1.2rem' : '1.5rem')};
  margin-bottom: 1rem;
  color: white;
  text-align: center;
`

const Tabs = styled.div<IsMobile>`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: ${props => (props.$ismobile ? 'space-around' : 'left')};
`

const Tab = styled.span<{ $active: boolean } & IsMobile>`
  position: relative;
  cursor: pointer;
  padding-bottom: 0.5rem;
  margin-right: 0.8%;
  margin-bottom: 0.2rem;
  border-radius: 4px;
  color: ${({ $active }) => ($active ? '#F59E0B' : '#9CA3AF')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  font-size: ${props => (props.$ismobile ? '0.9rem' : '1rem')};
  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: ${({ $active }) => ($active ? '100%' : '0')};
    height: 2px;
    background: #f59e0b;
    transition: width 0.3s;
  }
`

const UserList = styled.div<IsMobile>`
  display: flex;
  flex-direction: column;
  gap: ${props => (props.$ismobile ? '1.2rem' : '1.2rem')};
`

const UserItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`

const LeftInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`

const ProfileImg = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
`

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
`

const Name = styled.div<IsMobile>`
  font-size: 1.1rem;
  font-weight: 600;
`

const FollowerText = styled.div<IsMobile>`
  font-size: 0.8rem;
  color: #ccc;
`

const FollowButton = styled.button<{ following: boolean }>`
  background-color: ${props => (props.following ? '#2d2d2d' : '#2563eb')};
  color: #fff;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
`

interface User {
  id: number
  name: string
  followerCount: number
  profileImg: string
  isFollowing: boolean
}

const MyPageFollowList: React.FC = () => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const [users, setUsers] = useState<User[]>([])
  const [myId, setMyId] = useState<number | null>(null)

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const tabFromState = location.state?.tab || '팔로워'
  const [activeTab, setActiveTab] = useState<'팔로워' | '팔로잉'>(tabFromState)
  const profileId = searchParams.get('id') // URL에 ?id=2 식으로 넘어오는 회원 ID

  const goToProfile = (id: number) => {
    navigate(`/my-page?id=${id}`)
  }

  const toggleFollow = async (id: number) => {
    setUsers(prev =>
      prev.map(user => {
        if (user.id === id) {
          const newIsFollowing = !user.isFollowing
          // 팔로우 수 조정
          const newFollowerCount = user.followerCount + (newIsFollowing ? 1 : -1)

          // API 호출
          if (newIsFollowing) {
            followUser(id)
          } else {
            unfollowUser(id)
          }

          return {
            ...user,
            isFollowing: newIsFollowing,
            followerCount: newFollowerCount,
          }
        }
        return user
      }),
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let loginId: number | null = null
        try {
          const userRes = await userInfoGet()
          loginId = userRes.data.data.id
          setMyId(loginId)
        } catch (e) {
          // 로그인 안 된 경우 userInfoGet 실패 → myId는 null 유지
          console.log('로그인 안 됨: 팔로우 상태는 체크 안 함')
        }

        if (!profileId) return

        const idNum = Number(profileId)
        const res =
          activeTab === '팔로워' ? await getFollowersById(idNum) : await getFollowingsById(idNum)

        const mapped = await Promise.all(
          res.data.data.map(async (user: any) => {
            let isFollowing = false
            if (loginId !== null) {
              try {
                isFollowing = await checkFollowStatus(user.id)
              } catch (err) {
                console.warn(`팔로우 상태 확인 실패: ${user.id}`, err)
              }
            }
            return {
              id: user.id,
              name: user.nickname,
              profileImg: user.profileImage,
              followerCount: user.followerCount,
              isFollowing,
            }
          }),
        )

        setUsers(mapped)
      } catch (error) {
        console.error('팔로우 리스트 불러오기 실패', error)
      }
    }
    fetchData()
  }, [activeTab, profileId])

  return (
    <Container>
      <ContentWrapper>
        <Title $ismobile={isMobile}>{activeTab}</Title>
        <Tabs $ismobile={isMobile}>
          <Tab
            $ismobile={isMobile}
            $active={activeTab === '팔로워'}
            onClick={() => setActiveTab('팔로워')}
          >
            팔로워
          </Tab>
          <Tab
            $ismobile={isMobile}
            $active={activeTab === '팔로잉'}
            onClick={() => setActiveTab('팔로잉')}
          >
            팔로잉
          </Tab>
        </Tabs>

        <UserList $ismobile={isMobile}>
          {users.map(user => (
            <UserItem key={user.id} onClick={() => goToProfile(user.id)}>
              <LeftInfo>
                <ProfileImg src={user.profileImg} />
                <InfoText>
                  <Name $ismobile={isMobile}>{user.name}</Name>
                  <FollowerText $ismobile={isMobile}>팔로워 {user.followerCount}</FollowerText>
                </InfoText>
              </LeftInfo>
              {myId !== null && user.id !== myId && (
                <FollowButton
                  following={user.isFollowing}
                  onClick={e => {
                    e.stopPropagation() // ← 여기서 부모 onClick 전파 차단
                    toggleFollow(user.id)
                  }}
                >
                  {user.isFollowing ? '팔로잉' : '팔로우'}
                </FollowButton>
              )}
            </UserItem>
          ))}
        </UserList>
      </ContentWrapper>
    </Container>
  )
}

export default MyPageFollowList
