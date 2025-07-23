import React, { useEffect, useState, useCallback, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
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

import { ArrowLeft } from 'lucide-react'

interface IsMobile {
  $ismobile: boolean
}

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: hidden;
`

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  overflow-x: hidden;
  min-height: 100%;
`

const BackButton = styled.button<IsMobile>`
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: left;
  justify-content: left;
  margin-left: ${props => (props.$ismobile ? '3%' : '6%')};
  padding: 0;

  &:hover {
    color: #ff7849;
  }
`

const Spacer = styled.div`
  width: 24px; // BackButton과 동일한 너비
`

const HeaderRow = styled.div<IsMobile>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  margin-bottom: 1rem;
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
  color: ${({ $active }) => ($active ? '#FF7849' : '#9CA3AF')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  font-size: ${props => (props.$ismobile ? '0.9rem' : '1rem')};
  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: ${({ $active }) => ($active ? '100%' : '0')};
    height: 2px;
    background: #ff7849;
    transition: width 0.3s;
  }
`

const UserList = styled.div<IsMobile>`
  display: flex;
  flex-direction: column;
  gap: ${props => (props.$ismobile ? '1.2rem' : '1.2rem')};
  min-height: 600px;
`

const UserItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  animation: ${fadeInUp} 0.3s ease both;
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

const ImageWrapper = styled.div`
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`
const Skeleton = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: ${shimmer} 1.2s infinite;
  }
`

const ProfileImageLoader: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  return (
    <ImageWrapper>
      {!loaded && !error && <Skeleton />}
      {!error && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            display: loaded ? 'block' : 'none',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      {error && (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.2rem',
          }}
        >
          ?
        </div>
      )}
    </ImageWrapper>
  )
}

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

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`

const PaginationButton = styled.button<{ $active?: boolean }>`
  background: ${props => (props.$active ? '#ff6b35' : 'transparent')};
  border: 1px solid ${props => (props.$active ? '#ff6b35' : '#555')};
  color: ${props => (props.$active ? 'white' : '#ccc')};
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 0.2rem;

  &:hover {
    background: #ff6b35;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.div`
  text-align: center;
  color: #ff4444;
  font-size: 1.1rem;
  margin: 2rem 0;
`

const EmptyMessage = styled.div`
  text-align: center;
  color: #ccc;
  font-size: 1rem;
  margin: 2rem 0;
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

  const [page, setPage] = useState(0)
  const [isLastPage, setIsLastPage] = useState(false)
  const pageSize = 20
  const [loading, setLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [total, setTotal] = useState(0)

  const observer = useRef<IntersectionObserver | null>(null)

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

  const fetchItems = async () => {
    if (!profileId) return
    setLoading(true)
    setHasLoaded(false)
    setError(false)
    try {
      const idNum = Number(profileId)
      const res =
        activeTab === '팔로워'
          ? await getFollowersById(idNum, page, pageSize)
          : await getFollowingsById(idNum, page, pageSize)

      setTotal(res.data.data.totalElements)
      let loginId: number | null = null
      try {
        const loginRes = await userInfoGet()
        loginId = loginRes.data.data.id
        setMyId(loginId)
      } catch {
        // 로그인 안 된 상태: 로그인 ID는 null로 유지
        setMyId(null)
      }

      const mapped = await Promise.all(
        res.data.data.content.map(async (user: any) => {
          let isFollowing = false
          if (loginId !== null) {
            isFollowing = await checkFollowStatus(user.id).catch(() => false)
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
      if (isMobile) {
        // 모바일: 무한스크롤
        setUsers(prev => (page === 0 ? mapped : [...prev, ...mapped]))
      } else {
        // 데스크탑: 페이징
        setUsers(mapped)
      }
      setIsLastPage(res.data.data.last)
    } catch (e) {
      console.error(e)
      setError(true)
    } finally {
      setLoading(false)
      setHasLoaded(true)
    }
  }

  // 탭·페이지 변경 시마다 즉각 호출
  useEffect(() => {
    fetchItems()
  }, [activeTab, page])

  useEffect(() => {
    if (isLastPage && observer.current) {
      observer.current.disconnect()
    }
  }, [isLastPage])

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect()
      if (!isMobile || loading || isLastPage || !node) return
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1)
        }
      })
      observer.current.observe(node)
    },
    [isMobile, loading, isLastPage],
  )

  return (
    <Container>
      <ContentWrapper>
        <HeaderRow $ismobile={isMobile}>
          <BackButton $ismobile={isMobile} onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </BackButton>
          <Title $ismobile={isMobile}>{activeTab}</Title>
          <Spacer /> {/* 오른쪽 빈 칸 */}
        </HeaderRow>
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

        {error && <ErrorMessage>사용자를 불러오는 중 오류가 발생했습니다.</ErrorMessage>}
        {!loading && !error && users.length === 0 && (
          <EmptyMessage>표시할 유저가 없습니다.</EmptyMessage>
        )}

        {users.length > 0 && (
          <UserList $ismobile={isMobile}>
            {users.map((user, idx) => {
              const compositeKey = `${activeTab}-${user.id}`
              return (
                <UserItem
                  key={compositeKey}
                  ref={isMobile && idx === users.length - 1 ? lastItemRef : undefined}
                  onClick={() => goToProfile(user.id)}
                >
                  <LeftInfo>
                    {user.profileImg &&
                    user.profileImg !== 'null' &&
                    user.profileImg !== 'string' ? (
                      <ProfileImageLoader src={user.profileImg} alt={user.name} />
                    ) : (
                      <Avatar size={70}>{user.name.charAt(0)}</Avatar>
                    )}
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
              )
            })}
          </UserList>
        )}
        {/*  페이지네이션 여기에 넣기 */}
        {!isMobile && hasLoaded && total > pageSize && (
          <PaginationWrapper>
            <PaginationButton disabled={page === 0} onClick={() => setPage(0)}>
              &lt;&lt;
            </PaginationButton>
            <PaginationButton disabled={page === 0} onClick={() => setPage(prev => prev - 1)}>
              &lt;
            </PaginationButton>
            {Array.from({ length: Math.min(5, Math.ceil(total / pageSize)) }, (_, i) => {
              const start = Math.max(0, page - 2)
              const pageNum = start + i
              if (pageNum >= Math.ceil(total / pageSize)) return null
              return (
                <PaginationButton
                  key={pageNum}
                  $active={page === pageNum}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum + 1}
                </PaginationButton>
              )
            })}
            <PaginationButton
              disabled={page >= Math.ceil(total / pageSize) - 1}
              onClick={() => setPage(prev => prev + 1)}
            >
              &gt;
            </PaginationButton>
            <PaginationButton
              disabled={page >= Math.ceil(total / pageSize) - 1}
              onClick={() => setPage(Math.ceil(total / pageSize) - 1)}
            >
              &gt;&gt;
            </PaginationButton>
          </PaginationWrapper>
        )}
      </ContentWrapper>
    </Container>
  )
}

export default MyPageFollowList
